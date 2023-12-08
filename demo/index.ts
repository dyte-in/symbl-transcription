import DyteClient from '@dytesdk/web-core';
import { defineCustomElements } from '@dytesdk/ui-kit/loader/index.es2017';
import {
    activateTranscriptions,
    addTranscriptionsListener,
    deactivateTranscriptions,
    removeTranscriptionsListener,
} from '../src/index';

defineCustomElements();

const init = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const roomName = params.get('roomName') || '';
        const authToken = params.get('authToken') || '';
        const symblAccessToken = params.get('symblAccessToken') || '';

        if (!authToken || (roomName && !authToken)) {
            alert('Please pass authToken (and roomName, if you are using v1 APIs) in query params');
            return;
        }
        if (!symblAccessToken) {
            alert('Please pass symblAccessToken in query params');
            return;
        }

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

        meeting.self.on('roomLeft', () => {
            const transcriptionsDiv = document.getElementById('dyte-transcriptions') as HTMLDivElement;
            transcriptionsDiv.innerHTML = '';
            deactivateTranscriptions({ meeting });
            removeTranscriptionsListener({ meeting });
        });
    } catch (e) {
        console.log(e);
    }
};

init();
