import React, { useCallback, useState } from 'react'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'; //audio recording npm library

//the code in record button is referenced from sample code on https://www.npmjs.com/package/audio-react-recorder    

let RecordButton = () =>{
    const [recState, setRecord] = useState("");

    const onStop = useCallback((audioData) => {
        console.log('audio', audioData);
        const audio = new Audio(audioData.url);
        audio.play();
    });

    return(
        <div className="recordButton">
            <AudioReactRecorder state={ recState } onStop={ onStop }/>
            <button onClick={() => setRecord(RecordState.START)}>Record</button>
            <button onClick={() => setRecord(RecordState.STOP)}>Stop</button>
        </div>
    );
}

export default RecordButton;