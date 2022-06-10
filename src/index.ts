import {init, cleanup, transcriptions, InitConfig, CleanupConfig} from './middleware/transcript';

async function activateTranscriptions(param: InitConfig){
    if(!param?.meeting?.self){
        throw new Error('arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?');
    }
    if(!param?.symblAccessToken){
        throw new Error('Missing arguments[0].symblAccessToken. We need symbl access token to retrive conversations and to generate transcriptions');
    }
    return init(param);
}

async function deactivateTranscriptions(param: CleanupConfig) {
    if(!param.meeting?.self){
        throw new Error('arguments[0].meeting.self is not available. Did you miss calling new DyteClient first?');
    }
    return cleanup(param);;
}


export {
    activateTranscriptions,
    deactivateTranscriptions,
    transcriptions,
};
