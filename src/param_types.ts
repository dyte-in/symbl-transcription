import DyteClient from '@dytesdk/web-core/types/client/DyteClient';
import { BroadcastMessagePayload } from '@dytesdk/web-core/types/client/DyteParticipants';

export interface ActivateTranscriptionsConfig {
    meeting: DyteClient,
    symblAccessToken: string,
}

export interface DeactivateTranscriptionsConfig {
    meeting: DyteClient
}

export interface AddTranscriptionsListenerConfig {
    meeting: DyteClient,
    noOfTranscriptionsToCache?: number,
    transcriptionsCallback: (
        allFormattedTranscriptions: BroadcastMessagePayload[]
    ) => void,
}

export interface RemoveTranscriptionsListenerConfig {
    meeting: DyteClient
}
