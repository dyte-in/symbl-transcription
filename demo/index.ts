import DyteClient from '@dytesdk/web-core';
import { defineCustomElements } from '@dytesdk/ui-kit/loader/index.es2017';
import {
    activateTranscriptions,
    addTranscriptionsListener,
} from '../src/index';

defineCustomElements();

const init = async () => {
    try {
        const url = new URL(window.location.href);
        const roomName = url.searchParams.get('roomName') || '';
        const authToken = url.searchParams.get('authToken') || '';
        const symblAccessToken = url.searchParams.get('symblAccessToken') || '';

        const meeting = await DyteClient.init({
            authToken,
            roomName,
            apiBase: 'https://api.dyte.io',
            defaults: {
                audio: false,
                video: false,
            },
        });

        (document.getElementById('my-meeting') as any).meeting = meeting;
        Object.assign(window, { meeting });

        // Initialize speech client
        await activateTranscriptions({
            meeting,
            languageCode: 'en-US',
            symblAccessToken,
        });

        await addTranscriptionsListener({
            meeting,
            noOfTranscriptionsToCache: 200,
            transcriptionsCallback: (transcriptions) => {
                const transcription = document.getElementById('dyte-transcriptions') as HTMLDivElement;
                const list = transcriptions.slice(-3);
                transcription.innerHTML = '';
                list.forEach((item) => {
                    const speaker = document.createElement('span');
                    speaker.classList.add('dyte-transcription-speaker');
                    speaker.innerText = `${item.displayName}: `;

                    const text = document.createElement('span');
                    text.classList.add('dyte-transcription-text');
                    text.innerText = item.text.toString().trim() !== '' ? item.text.toString().trim() : '...';

                    const container = document.createElement('span');
                    container.classList.add('dyte-transcription-line');
                    container.appendChild(speaker);
                    container.appendChild(text);

                    transcription.appendChild(container);
                });
            },
        });
    } catch (e) {
        console.log(e);
    }
};

init();
