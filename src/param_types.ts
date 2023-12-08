import type DyteClient from '@dytesdk/web-core';
import type { BroadcastMessagePayload } from '@dytesdk/web-core/';

export interface ActivateTranscriptionsConfig {
    meeting: DyteClient,
    symblAccessToken: string,
    languageCode?: string,
    connectionId?: string,
    speakerUserId?: string,
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
