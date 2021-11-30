import React, { useCallback, useState, useEffect } from 'react';
//import { Howl } from 'howler';
import RecordingState from './RecordingState';

//import RecordButton from './Record';
import { ReactMic } from 'react-mic';       //new recording npm library that solves multiple issues, that the old library had
import Localbase from 'localbase';
import Export from "./Export";

export async function retrieveData(db){
    let ar = await db.collection('audio').get();
    return ar;
}

let Playback = () =>{
    const [audioState, setAudio] = useState();
    const [recState, setRecord] = useState({record: false});
    //const [audForV, setAudForV] =  useState();
    //const [duration, setDuration] = useState(0);
    const [playback, setPlayback] = useState();

    let db = new Localbase('db');
    
    const onStop = useCallback((recordedBlob) => {
        db.collection('audio').delete();
        db.collection('audio').add(recordedBlob);
        let audio = new Audio();
        audio.src = recordedBlob.blobURL;
        setAudio(audio.cloneNode());
        //setDuration(recordedBlob.stopTime - recordedBlob.startTime);
        //setAudForV(audio.cloneNode());
      });

    
    return(
        <div className="playback">
                <div id="recording-control-panel">
                    <ReactMic
                        record={ recState.record }
                        className="sound-wave"
                        onStop={ onStop }
                        strokeColor="#000000"
                        backgroundColor="#FF4081" />
                    <button onClick={() => setRecord({record: true})}>Record</button>
                    <button onClick={() => setRecord({record: false})}>Stop</button>
                    <button onClick={ () => setPlayback("play") }>Play</button>
                    <button onClick={ () => setPlayback("pause") }>Pause</button>
                    <button onClick={ () => setPlayback("stop") }>Stop</button>
                    <button onClick={ () => setPlayback("skipToFront") }>Skip to front</button>
                    <button onClick={ () => setPlayback("skipToBack") }>Skip to back</button>
                </div>
                <RecordingState data = { audioState } playback={playback}/>
                <Export />
        </div>
    );
}



export default Playback;