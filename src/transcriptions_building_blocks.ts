import type { BroadcastMessagePayload } from '@dytesdk/web-core';

let ws: WebSocket;

let transcriptions: BroadcastMessagePayload[] = [];

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

export {
    getWebSocket,
    setWebSocket,
    getTranscriptions,
    setTranscriptions,
    getPeerIdBySymblId,
    setPeerIdForSymblId,
};
