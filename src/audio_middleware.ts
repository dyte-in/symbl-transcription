import { getWebSocket } from './transcriptions_building_blocks';

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
        const ws = getWebSocket();
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(targetBuffer.buffer);
        }
    };

    return processor;
}

export default audioTranscriptionMiddleware;
