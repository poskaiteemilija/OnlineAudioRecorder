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
    const [currentTime, setTime] = useState(0);
    const [audioState, setAudio] = useState();
    const [recState, setRecord] = useState({record: false});
    const [audForV, setAudForV] =  useState();
    const [playbackState, setPlaybackState] = useState({
        playing: false,
        cursorPoint: 0,
        audioLenght: 0
    });

    let db = new Localbase('db');


    const startPlayback = useCallback(() => {
        audioState.play();

    });

    const pausePlayback = useCallback(() => {
        if(!audioState.paused){
            setTime(audioState.currentTime);
            audioState.pause();
        }
    });

    const skipToFront = useCallback(() =>{
            if(!audioState.paused){
                audioState.pause();
            }
            setTime(0);
            audioState.src = audioState.src;
            console.log(audioState.currentTime);
            //audioState.play();
    })

    /*const onData = useCallback((recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    });*/
    
    const onStop = useCallback((recordedBlob) => {
        //console.log('recordedBlob is: ', recordedBlob);
        db.collection('audio').delete();
        db.collection('audio').add(recordedBlob);
        let audio = new Audio();
        audio.src = recordedBlob.blobURL;
        //console.log(audio);
        setAudio(audio.cloneNode());
        setPlaybackState({audioLenght: audio.duration});
        setAudForV(audio.cloneNode());
      });

    console.log(currentTime, audioState, recState);
    console.log(playbackState);
    
    return(
        <div className="playback">
                <ReactMic
                    record={ recState.record }
                    className="sound-wave"
                    onStop={ onStop }

                    strokeColor="#000000"
                backgroundColor="#FF4081" />
                <button onClick={() => setRecord({record: true})}>Record</button>
                <button onClick={() => setRecord({record: false})}>Stop</button>
                <button onClick={ startPlayback }>Play</button>
                <button onClick={ pausePlayback }>Pause</button>
                <button onClick={ skipToFront }>Skip to front</button>
                <Export />
                <RecordingState data={ audForV }/>
        </div>
    );
}



export default Playback;