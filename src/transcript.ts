/**
 * Though this file indicates the integration of Symbl.ai.
 * We are not utilising Symbl.ai messaging in favor of Dyte websocket messaging
 */

import axios from 'axios';
import DyteClient from '@dytesdk/web-core';
import { BroadcastMessagePayload } from '@dytesdk/web-core/types/client/DyteParticipants';

let ws: WebSocket;

let transcriptions: BroadcastMessagePayload[] = [];

export interface InitConfig {
    meeting: DyteClient,
    symblAccessToken: string,
    noOfTranscriptionsToShow?: number,
    noOfTranscriptionsToCache?: number,
    transcriptionDivId?: string,
}

export interface CleanupConfig{
    meeting: DyteClient,
    symblAccessToken: string,
    transcriptionDivId?: string,
}

const symblIdToPeerIdMap: {[key: string]: string} = {};

// Actual middleware to apply on Dyte
async function audioTranscriptionMiddleware(audioContext: AudioContext) {
    const processor = audioContext.createScriptProcessor(1024, 1, 1);

    processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
        const outputData = e.outputBuffer.getChannelData(0);

        // Output to the buffer to not halt audio output
        inputData.forEach((val, index) => {
            outputData[index] = val;
        });

        const targetBuffer = new Int16Array(inputData.length);
        for (let index = inputData.length; index > 0; index -= 1) {
            targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
        }
        // Send audio stream to websocket.
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(targetBuffer.buffer);
        }
    };

    return processor;
}

/**
 *
 * @param config Required params to initialise the middleware.
 * meeting is needed to send messages across peers and to listen to room messages.
 * symblAccessToken is needed to connect to symbl.ai.
 * noOfTranscriptionsToShow (1 - n) indicates last n transcriptions to show (Default: 3).
 * transcriptionDivId is the id of the div where
 * you want the (noOfTranscriptionsToShow) transcriptions to be populated.
 * If no valid `transcriptionDivId` is provided, we will safely skip dom update.
 * noOfTranscriptionsToCache is the count of transcriptions you want
 *  to save in the cache (Default: 200).
 * @returns the raw result which `meeting.self.addAudioMiddleware` returns
 */
async function init({
    meeting,
    symblAccessToken,
    noOfTranscriptionsToShow = 3,
    noOfTranscriptionsToCache = 200,
    transcriptionDivId,
}: InitConfig) {
    transcriptions.splice(0); // In case, the package gets reinitialized, resetting transcriptions

    const uniqueMeetingId = meeting.meta.roomName;
    const symblEndpoint = `wss://api.symbl.ai/v1/streaming/${uniqueMeetingId}?access_token=${symblAccessToken}`;

    ws = new WebSocket(symblEndpoint);

    // Fired when a message is received from the WebSocket server
    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message' && data.message.type === 'recognition_started' && Object.prototype.hasOwnProperty.call(data.message, 'data')) {
            // Get previous conversations, if your app requires it
            const messagesResp = await axios.get(`https://api.symbl.ai/v1/conversations/${data.message.data.conversationId}/messages`, {
                headers: { Authorization: `Bearer ${symblAccessToken}` },
            });

            const messages = messagesResp.data.messages.map((message: any) => ({
                text: message.text,
                startTime: message.startTime,
            }));

            // When a new peer joins, pushing previous messages
            transcriptions = [].concat(messages).concat(transcriptions);
        }
        if (data.type === 'message_response') {
            data.messages?.forEach((message: any) => {
                // console.log('Live transcript (more accurate): ', message.payload.content, data);

                if (symblIdToPeerIdMap[message.from?.id] === meeting.self.id) {
                    // More accurate Transcript
                    meeting.participants.broadcastMessage(
                        'audioTranscriptionMessage', // This can be named anything we want
                        {
                            text: message.payload.content,
                            isPartialTranscript: false,
                            startTimeISO: message.duration?.startTime || new Date().toISOString(),
                            endTimeISO: message.duration?.endTime || new Date().toISOString(),
                            peerId: meeting.self.id,
                            displayName: meeting.self.name,
                        },
                    );
                }
            });
        }

        if (data.type === 'message' && Object.prototype.hasOwnProperty.call(data.message, 'punctuated')) {
            // console.log('Live transcript (less accurate): ',
            //     data.message.punctuated.transcript, data);
            if (data.message.user?.peerId === meeting.self.id) {
                // Symbl sends their own user Id in from.id for accurate messages
                // Need this mapping there to use it to show/send transcripts
                symblIdToPeerIdMap[data.message.user.id as string] = meeting.self.id;

                meeting.participants.broadcastMessage(
                    'audioTranscriptionMessage', // This can be named anything we want
                    {
                        text: data.message.punctuated.transcript,
                        isPartialTranscript: true,
                        startTimeISO: data.message.duration?.startTime || new Date().toISOString(),
                        endTimeISO: data.message.duration?.endTime || new Date().toISOString(),
                        peerId: meeting.self.id,
                        displayName: meeting.self.name,
                    },
                );
            }
        }
    };

    // Fired when the WebSocket closes unexpectedly due to an error or lost connetion
    ws.onerror = (err) => {
        // eslint-disable-next-line no-console
        console.error('Symbl websocket error: ', err);
    };

    // Fired when the WebSocket connection has been closed
    ws.onclose = () => {
        // eslint-disable-next-line no-console
        console.info('Connection to Symbl websocket closed');
    };

    // Fired when the connection succeeds.
    ws.onopen = () => {
        ws.send(JSON.stringify({
            id: meeting.self.id,
            type: 'start_request',
            meetingTitle: meeting.meta.meetingTitle,
            // insightTypes: ['question', 'action_item'], // Will enable insight generation
            config: {
                confidenceThreshold: 0.5,
                languageCode: 'en-US',
                speechRecognition: {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 44100,
                },
            },
            speaker: {
                peerId: meeting.self.id, // this if has email, gets transcription at the end
                name: meeting.self.name,
            },
        }));
    };

    meeting.participants.on('broadcastedMessage', async (
        { payload, type } : { payload: BroadcastMessagePayload, type: string },
    ) => {
        if (type === 'audioTranscriptionMessage') {
            /**
             * NOTE(ravindra-dyte): We want to give the effect of in-place transcription update
             * Therefore we are removing previously in-progress line and putting the new one
             */

            // Remove all in-progress transcriptions of this user
            const filteredTranscriptions: BroadcastMessagePayload[] = [];
            transcriptions.forEach((transcription) => {
                const shoudKeep = transcription.peerId !== payload.peerId // allow from others
                || ( // allow this peerId messages only if they are completed
                    transcription.peerId === payload.peerId
                        && !transcription.isPartialTranscript
                );
                if (shoudKeep) {
                    filteredTranscriptions.push(transcription);
                }
            });
            transcriptions = filteredTranscriptions;

            transcriptions.push(payload);

            // Keeping last noOfTranscriptionsToCache transcriptions only
            // to not have a huge array of elements
            transcriptions = transcriptions.slice(-1 * noOfTranscriptionsToCache);

            // Update in DOM
            const transcriptionsDiv = document.getElementById(transcriptionDivId) as HTMLDivElement;

            if (transcriptionsDiv) {
                transcriptionsDiv.innerHTML = '';

                const transcriptionsToShow = transcriptions.slice(-1 * noOfTranscriptionsToShow);

                transcriptionsToShow.forEach((transcription) => {
                    const speakerSpan = document.createElement('span');
                    speakerSpan.classList.add('dyte-transcription-speaker');
                    speakerSpan.innerText = `${transcription.displayName}: `;

                    const transcriptionSpan = document.createElement('span');
                    transcriptionSpan.classList.add('dyte-transcription-text');
                    transcriptionSpan.innerText = transcription.text?.toString();

                    const transcriptionLine = document.createElement('span');
                    transcriptionLine.classList.add('dyte-transcription-line');
                    transcriptionLine.appendChild(speakerSpan).appendChild(transcriptionSpan);

                    transcriptionsDiv.appendChild(transcriptionLine);
                });
            }
        }
    });

    return meeting.self.addAudioMiddleware(audioTranscriptionMiddleware);
}

async function cleanup({
    meeting,
    transcriptionDivId,
}: CleanupConfig) {
    try {
        meeting.self.removeAudioMiddleware(audioTranscriptionMiddleware);

        // Remove from DOM
        const transcriptionsDiv = document.getElementById(transcriptionDivId) as HTMLDivElement;
        if (transcriptionsDiv) {
            transcriptionsDiv.childNodes.forEach((child) => {
                child.remove();
            });
        }
        ws?.close();
    } catch (ex) {
        // eslint-disable-next-line no-console
        console.error('Failed to close Symbl websocket. Error: ', ex);
    }
}

function getTranscriptions() {
    return transcriptions;
}

export {
    init,
    cleanup,
    getTranscriptions,
};
