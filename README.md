# Dyte <> Symbl.ai transcriptions

## How to use?

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
    addTranscriptionsListerner,
    removeTranscriptionsListener
} from '@dytesdk/symbl-transcription';
```

Now you can activate Symbl transcriptions.

```
activateTranscriptions({
    meeting: meeting, // From DyteClient.init
    symblAccessToken: 'ACCESS_TOKEN_FROM_SYMBL_AI',
});
```

This would ensure that your audio gets translated and resultant transcriptions get sent to all participants including `self` being referred by `meeting.self`.

If you want to show transcriptions to a participant or for `self`, you can do so using the following snippet.

```
addTranscriptionsListerner({
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
