import React, { useCallback, useState, useEffect } from 'react';
import { Howl } from 'howler';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'; //audio recording npm library
import RecordingState from './RecordingState';

//import RecordButton from './Record';
import Localbase from 'localbase';

/*const playbackReducer = (state, action) => {
    //to be added code which switches the state of the application
    switch(action.type){
        case 'play-rec':
            //solution in this switch section taken and modified from https://stackoverflow.com/questions/18650168/convert-blob-to-base64

    }
}*/

async function retrieveData(db){
    let ar = await db.collection('audio').get();
    return ar;
}

let Playback = () =>{
    const [currentTime, setTime] = useState(0);
    const [audioState, setAudio] = useState();
    const [recState, setRecord] = useState("");

    let audioForWave = undefined;
    let db = new Localbase('db');
    //const PlaybackContext = React.createContext();
    //const [state, dispatch] = React.useReducer(playbackReducer /* probably another value to be added here */);
    //const [audioState, setAudio] = useState({"isEmpty" : true});

    /*useEffect(() => {
        setAudio({
            "audio" : props.newRec,
            "isEmpty" : false,
        });
        console.log(audioState);
    }, [props.newRec]);*/


    const startPlayback = useCallback(() => {
        if(audioState==undefined){
            retrieveData(db).then((value) => {
                //let reader = new FileReader();
                //let url = URL.createObjectURL(value[0].blob);
                //let sound = new Howl({
                //    src: [url],
                //    ext: ['wav']
                //});
                //sound.play();
    
                let url = URL.createObjectURL(value[0].blob);
                let audio = new Audio();
                audio.src = url;
                setAudio(audio);
                audioForWave = audio;
                audio.play();
            });
        }
        else{
            if(audioState.paused){
                audioState.play();
            }
            else{
                return;
            }
        }

    });

    const pausePlayback = useCallback(() => {
        if(!audioState.paused){
            setTime(audioState.currentTime);
            audioState.pause();
        }
    });

    const skipToFront = useCallback(() =>{
        audioState.currentTime = 0;
    })

    const onStop = useCallback((audioData) => {
        console.log('audio', audioData);
        db.collection('audio').delete();
        db.collection('audio').add(audioData);
    });

    //const value = {state, dispatch};
    return(
        <div className="playback">
            {/* <PlaybackContext.Provider value={value}> */}
                <AudioReactRecorder state={ recState } onStop={ onStop }/>
                <button onClick={() => setRecord(RecordState.START)}>Record</button>
                <button onClick={() => setRecord(RecordState.STOP)}>Stop</button>
                <button onClick={ startPlayback }>Play</button>
                <button onClick={ pausePlayback }>Pause</button>
                <button onClick={ skipToFront }>Skip to front</button>
                <RecordingState audS={ audioForWave }/>
            {/* </PlaybackContext.Provider> */}
        </div>
    );
}



export default Playback;