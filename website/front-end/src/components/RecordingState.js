import React, { useContext, useEffect } from 'react';
import AudioWave from './AudioWave';

function RecordingState (props) {
    useEffect(() => {
        //console.log("THIS HAS CHANGED", props.data);
    }, [props.data]);

    //console.log(props.data);
    if(props.data!=undefined){
        return (
            <AudioWave audio={props.data} playback={props.playback}/>        
        );
    }
    return <div/>;
    
}

export default RecordingState;