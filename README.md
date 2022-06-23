# Dyte <> Symbl.ai transcriptions

## How to use?

Find the Dyte integration logic in your codebase which may look like this

```
// Somewhere in your codebase
const meeting = await DyteClient.init(...)
```

On top of the file where integration was found, import this package.

```
import { activateTranscriptions, deactivateTranscriptions } from '@dytesdk/symbl-transcription';
```

Now activate transcriptions.

```
activateTranscriptions({
    meeting: meeting, // From DyteClient.init
    symblAccessToken: 'ACCESS_TOKEN_FROM_SYMBL_AI',
    noOfTranscriptionsToCache: 200,
    callback?: (allFormattedTranscriptions ),
});
```

Once done, deactivate the transcriptions.

```
deactivateTranscriptions({
    meeting: meeting, // From DyteClient.init
    symblAccessToken: 'ACCESS_TOKEN_FROM_SYMBL_AI',
});
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
