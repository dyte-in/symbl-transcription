import merge from 'lodash-es/merge';
import audioTranscriptionMiddleware from './audio_middleware';
import { ActivateTranscriptionsConfig, DeactivateTranscriptionsConfig } from './param_types';
import {
    getConversationId,
    getPeerIdBySymblId,
    getWebSocket,
    setConversationId,
    setPeerIdForSymblId,
    setTranscriptions,
    setWebSocket,
} from './transcriptions_building_blocks';
/**
 *
 * @param ActivateTranscriptionsConfig Required params to initialise the middleware.
 * `meeting` is needed to send messages across peers and to listen to room messages.
 * `symblAccessToken` is needed to connect to symbl.ai.
 * @returns the raw result which `meeting.self.addAudioMiddleware` returns
 */
async function activateTranscriptions({
    meeting,
    symblAccessToken,
    languageCode,
    connectionId,
    speakerUserId,
    symblStartRequestParams = {},
    symblStreamingMessageCallback = () => {},
}: ActivateTranscriptionsConfig) {
    // As a fail-safe, deactivateTranscriptions if activateTranscriptions function is called twice
    // eslint-disable-next-line no-use-before-define
    deactivateTranscriptions({ meeting });

    const symblConnectionId = connectionId || meeting.meta.roomName;
    const symblEndpoint = `wss://api.symbl.ai/v1/streaming/${symblConnectionId}?access_token=${symblAccessToken}`;

    const ws = new WebSocket(symblEndpoint);
    setWebSocket(ws);

    // Fired when a message is received from the WebSocket server
    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'error') {
            console.error('Symbl error: ', data);
            return;
        }
        if (data.type === 'message' && data.message.type === 'conversation_created') {
            // console.log('Symbl conversation created: ', data);
            setConversationId(data.message.data.conversationId);
        }

        if (data.type === 'message_response') {
            data.messages?.forEach((message: any) => {
                // console.log('Live transcript (more accurate): ', message.payload.content, data);

                if (getPeerIdBySymblId(message.from?.id) === meeting.self.id) {
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
                            id: message.id,
                            conversationId: getConversationId(),
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
                setPeerIdForSymblId(data.message.user.id as string, meeting.self.id);

                meeting.participants.broadcastMessage(
                    'audioTranscriptionMessage', // This can be named anything we want
                    {
                        text: data.message.punctuated.transcript,
                        isPartialTranscript: true,
                        // Partial transcriptions would not be having messageId
                        startTimeISO: data.message.duration?.startTime || new Date().toISOString(),
                        endTimeISO: data.message.duration?.endTime || new Date().toISOString(),
                        peerId: meeting.self.id,
                        displayName: meeting.self.name,
                        conversationId: getConversationId(),
                    },
                );
            }
        }

        // Call the callback
        if (symblStreamingMessageCallback) {
            symblStreamingMessageCallback(data);
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

    // If start_request params are there, they wil be given a top priority
    const startRequestParams = merge({
        id: meeting.self.id,
        type: 'start_request',
        meetingTitle: meeting.meta.meetingTitle,
        // insightTypes: ['question', 'action_item'], // Will enable insight generation
        config: {
            confidenceThreshold: 0.5,
            languageCode, // Symbl has bug. This field is not honoured
            speechRecognition: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
            },
        },
        speaker: {
            // if speaker has email key, transcription gets sent at the end
            // speaker supports all arbitary values
            userId: speakerUserId || meeting.self.clientSpecificId || meeting.self.id,
            name: meeting.self.name,
            peerId: meeting.self.id,
        },
    }, symblStartRequestParams);

    // Fired when the connection succeeds.
    ws.onopen = () => {
        ws.send(JSON.stringify(startRequestParams));
    };

    return meeting.self.addAudioMiddleware(audioTranscriptionMiddleware);
}

async function deactivateTranscriptions({
    meeting,
}: DeactivateTranscriptionsConfig) {
    try {
        setTranscriptions([]);
        meeting.self.removeAudioMiddleware(audioTranscriptionMiddleware);
        getWebSocket()?.close();
    } catch (ex) {
        // eslint-disable-next-line no-console
        console.error('Failed to close Symbl websocket. Error: ', ex);
    }
}

export {
    activateTranscriptions,
    deactivateTranscriptions,
};
