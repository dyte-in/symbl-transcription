import type DyteClient from '@dytesdk/web-core';
import type { BroadcastMessagePayload } from '@dytesdk/web-core/';

export interface ActivateTranscriptionsConfig {
    meeting: DyteClient,
    symblAccessToken: string,
    languageCode?: string,
    connectionId?: string,
    speakerUserId?: string,
    symblStartRequestParams?: { // https://docs.symbl.ai/reference/streaming-api-reference#start_request
        [key:string]: any,
    },
    symblStreamingMessageCallback?: (event: any) => void,
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
