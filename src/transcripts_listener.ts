/**
 * Though this file indicates the integration of Symbl.ai.
 * We are not utilising Symbl.ai messaging in favor of Dyte websocket messaging.
 * This is being done to propagate User Name against their transcriptions.
 */

import { BroadcastMessagePayload } from '@dytesdk/web-core/types/client/DyteParticipants';
import {
    AddTranscriptionsListenerConfig,
    RemoveTranscriptionsListenerConfig,
} from './param_types';
import { getTranscriptions, setTranscriptions } from './transcriptions_building_blocks';

let listernerParam : AddTranscriptionsListenerConfig;

const broadcastedMessageCB = async (
    { payload, type } : { payload: BroadcastMessagePayload, type: string },
) => {
    if (type === 'audioTranscriptionMessage') {
        /**
         * NOTE(ravindra-dyte): We want to give the effect of in-place transcription update
         * Therefore we are removing previously in-progress line and putting the new one
         */

        // Remove all in-progress transcriptions of this user
        let filteredTranscriptions: BroadcastMessagePayload[] = [];
        getTranscriptions().forEach((transcription) => {
            const shouldKeep = transcription.peerId !== payload.peerId // allow from others
            || ( // allow this peerId messages only if they are completed
                transcription.peerId === payload.peerId
                    && !transcription.isPartialTranscript
            );
            if (shouldKeep) {
                filteredTranscriptions.push(transcription);
            }
        });

        filteredTranscriptions.push(payload);

        // Keeping last noOfTranscriptionsToCache transcriptions only
        // to not have a huge array of elements
        filteredTranscriptions = filteredTranscriptions.slice(
            -1 * listernerParam.noOfTranscriptionsToCache,
        );

        setTranscriptions(filteredTranscriptions);
        // call the callback
        listernerParam?.transcriptionsCallback(filteredTranscriptions);
    }
};

/**
 * @param AddTranscriptionsListenerConfig
 * noOfTranscriptionsToCache is the count of transcriptions you want
 */
async function addTranscriptionsListener(param: AddTranscriptionsListenerConfig) {
    listernerParam = param;
    param.meeting.participants.on('broadcastedMessage', broadcastedMessageCB);
}

async function removeTranscriptionsListener({
    meeting,
}: RemoveTranscriptionsListenerConfig) {
    try {
        meeting.participants.removeListener('broadcastedMessage', broadcastedMessageCB);
    } catch (ex) {
        // eslint-disable-next-line no-console
        console.error('Failed to close Symbl websocket. Error: ', ex);
    }
}

export {
    addTranscriptionsListener,
    removeTranscriptionsListener,
};
