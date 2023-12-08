# Dyte <> Symbl.ai transcriptions

## How to test this?

Go to terminal

Install the packages.
`npm install`

Run it locally
`npm run dev`

It will run a server on localhost:3000 serving the HTML containing the sample integration from index.html.

Use the following URL to test.
`
http://localhost:3000/?authToken=PUT_DYTE_PARTICIPANT_AUTH_TOKEN_HERE&symblAccessToken=PUT_SYMBL_ACCESS_TOKEN_HERE
`

## How to use it with Dyte?

Find the Dyte integration logic in your codebase which may look like this

```
// Somewhere in your codebase
const meeting = await DyteClient.init(...)
```

On top of the file where integration was found, import this package.

```
import {
    activateTranscriptions,
    deactivateTranscriptions,
    addTranscriptionsListener,
    removeTranscriptionsListener
} from '@dytesdk/symbl-transcription';
```

Now you can activate Symbl transcriptions.

```
activateTranscriptions({
    meeting: meeting, // From DyteClient.init
    symblAccessToken: 'ACCESS_TOKEN_FROM_SYMBL_AI',
    connectionId: 'SOME_ARBITRARY_CONNECTION_ID', // optional,
    speakerUserId: 'SOME_ARBITRARY_USER_ID_FOR_SPEAKER', // optional
});
```

This would ensure that your audio gets translated and resultant transcriptions get sent to all participants including `self` being referred by `meeting.self`.

`connectionId` field is optional. If not passed, value of `meeting.meta.roomName` will be used as `connectionId`.

`speakerUserId` field is optional. If not passed, value of `meeting.self.clientSpecificId` will be used as `speakerUserId`.



If you want to show transcriptions to a participant or for `self`, you can do so using the following snippet.

```
addTranscriptionsListener({
    meeting: meeting,
    noOfTranscriptionsToCache: 200,
    transcriptionsCallback: (allFormattedTranscriptions) => { console.log(allFormattedTranscriptions); },
})
```

Using `transcriptionsCallback` you can populate the transcriptions in your app/website at any desired place.

<b>NOTE</b>: For every partial or complete sentence, `transcriptionsCallback` will be called, with all formatted transcriptions.

Once meeting is over, deactivate the transcription generation.

```
deactivateTranscriptions({
    meeting: meeting, // From DyteClient.init
    symblAccessToken: 'ACCESS_TOKEN_FROM_SYMBL_AI',
});
```
In similar fashion, remove the transcriptions listener, once the meeting is over.

```
removeTranscriptionsListener({meeting: meeting});
```


# How to get symblAccessToken?

1. Go to <https://symbl.ai/> and register.
2. Find your appId and appSecret on Symbl.ai post registeration in account settings.
3. Run this CURL.

```
curl -k -X POST "https://api.symbl.ai/oauth2/token:generate" \
     -H "accept: application/json" \
     -H "Content-Type: application/json" \
     -d $'{
      "type" : "application",
      "appId": "YOUR_APP_ID",
      "appSecret": "YOUR_APP_SECRET"
    }'
```

# How to subscribe to transcriptions of this conversation?

Please pass a unique `connectionId` for this meeting and a unique `speakerUserId` for the speaker while activating treanscriptions using `activateTranscriptions` method.

This would help you use subscribe API of Symbl, located at https://docs.symbl.ai/reference/subscribe-api along with better control over the speakers.

# How to test Symbl integration quickly without having to integrate Dyte beforehand?

To see the demo or to test the Symbl integration, please go to https://github.com/dyte-in/symbl-transcription and clone the repo and run the npm script named `dev`.

```sh
git clone https://github.com/dyte-in/symbl-transcription.git
cd symbl-transcription
npm install
npm run dev
```

It will run a server on localhost:3000 serving the HTML containing the sample integration from index.html.

Please use the following URL to see the Default Dyte Meeting interface.

```text
http://localhost:3000/?authToken=PUT_DYTE_PARTICIPANT_AUTH_TOKEN_HERE&symblAccessToken=PUT_SYMBL_ACCESS_TOKEN_HERE

```

In case you are still using v1 meetings, please use the following URL.
```text
http://localhost:3000/?authToken=PUT_DYTE_PARTICIPANT_AUTH_TOKEN_HERE&symblAccessToken=PUT_SYMBL_ACCESS_TOKEN_HERE&roomName=PUT_DYTE_ROOM_NAME_HERE
```

Once the Dyte UI is loaded, please turn on the Mic and grant permissions, if asked. Post that, try speaking sentences in English (default) to see the transcriptions.
