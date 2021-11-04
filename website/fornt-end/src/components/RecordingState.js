import React from 'react';
import AudioWave from './AudioWave';

function RecordingState (props) {
    console.log(props.audSS);
    if(props.audioState!=undefined){
        return <AudioWave audio={props.audioState}/>;
    }
    return <div/>;
    
}

export default RecordingState;