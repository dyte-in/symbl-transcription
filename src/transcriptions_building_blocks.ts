import type { BroadcastMessagePayload } from '@dytesdk/web-core';

let ws: WebSocket;

let transcriptions: BroadcastMessagePayload[] = [];
let conversationId: string = '';

const symblIdToPeerIdMap: {[key: string]: string} = {};

function getWebSocket() {
    return ws;
}
function setWebSocket(newWS: WebSocket) {
    ws = newWS;
}

function getTranscriptions() {
    return transcriptions;
}

function setTranscriptions(newTranscriptions: BroadcastMessagePayload[]) {
    transcriptions = newTranscriptions;
}

function getPeerIdBySymblId(symblId: string) {
    return symblIdToPeerIdMap[symblId];
}

function setPeerIdForSymblId(symblId: string, peerId: string) {
    symblIdToPeerIdMap[symblId] = peerId;
}

function getConversationId() {
    return conversationId;
}

function setConversationId(newConversationId: string) {
    conversationId = newConversationId;
}

export {
    getWebSocket,
    setWebSocket,
    getTranscriptions,
    setTranscriptions,
    getPeerIdBySymblId,
    setPeerIdForSymblId,
    getConversationId,
    setConversationId,
};
