import { getWebSocket } from './transcriptions_building_blocks';

function isAudioInputSilent(inputData: Float32Array) {
    let isSilent = true;
    for (let index = 0; index < inputData.length; index += 1) {
        if (inputData[index] !== 0) {
            isSilent = false;
            break;
        }
    }
    return isSilent;
}

function downsampleBuffer(buffer: AudioBuffer, outSampleRate: number) {
    const sampleRateRatio = buffer.sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    const inputData = buffer.getChannelData(0);

    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0;
        let count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i += 1) {
            accum += inputData[i];
            count += 1;
        }

        result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
        offsetResult += 1;
        offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
}

// Actual middleware to apply on Dyte
async function audioTranscriptionMiddleware(audioContext: AudioContext) {
    const processor = audioContext.createScriptProcessor(1024, 1, 1);

    processor.onaudioprocess = (audioProcessingEvent) => {
        const inputData = (
            audioProcessingEvent.inputBuffer.getChannelData(0)
            || new Float32Array(this.bufferSize)
        );

        // Stale processors might be floating around, do nothing for stale processors.
        if (isAudioInputSilent(inputData)) {
            return;
        }

        const outputData = audioProcessingEvent.outputBuffer.getChannelData(0);

        // Output to the buffer to not halt audio output
        inputData.forEach((val, index) => {
            outputData[index] = val;
        });
        // Send audio stream to websocket.
        const ws = getWebSocket();
        if (ws?.readyState === WebSocket.OPEN) {
            const downsampledBuffer = downsampleBuffer(
                audioProcessingEvent.inputBuffer,
                16000,
            );
            ws.send(downsampledBuffer);
        }
    };

    return processor;
}

export default audioTranscriptionMiddleware;
