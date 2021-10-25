import React, { useCallback, useState, useEffect } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'; //audio recording npm library
import ReactHowler from 'react-howler';

//the code in record button is referenced from sample code on https://www.npmjs.com/package/audio-react-recorder    

let RecordButton = () =>{
    const [recState, setRecord] = useState("");
    const [audioState, setAudio] = useState();

    const onStop = useCallback((audioData) => {
        console.log('audio', audioData, audioData.url);
        localStorage.setItem('bloblink', audioData.url);
    });

    useEffect(() => {
        setAudio(localStorage.getItem('bloblink'));
        console.log(audioState);
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