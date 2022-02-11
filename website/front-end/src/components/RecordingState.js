import React, { useContext, useEffect } from 'react';
import AudioWave from './AudioWave';

function RecordingState (props) {
    useEffect(() => {
        //console.log("THIS HAS CHANGED", props.data);
    }, [props.data]);

    if(props.data.value.length !== 0){
        return (
            <AudioWave audio={props.data} playback={props.playback}/>        
        );
    }
    return <div/>;
    
}

export default RecordingState;