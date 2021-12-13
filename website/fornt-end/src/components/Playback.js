import React, { useCallback, useState, useEffect } from 'react';
//import { Howl } from 'howler';
import RecordingState from './RecordingState';

//import RecordButton from './Record';
import { ReactMic } from 'react-mic';       //new recording npm library that solves multiple issues, that the old library had
import Localbase from 'localbase';
import Export from "./Export";
import FrontEndPoint from './FrontEndPoint';
import "../style/Playback.css";
import TimeScale from "./TimeScale";

export async function retrieveData(db){
    let ar = await db.collection('audio').get();
    return ar;
}

let Playback = () =>{
    //const PlaybackContext = React.useContext(0); 

    const [audioState, setAudio] = useState();
    const [recState, setRecord] = useState({record: false});
    //const [audForV, setAudForV] =  useState();
    const [duration, setDuration] = useState(0);
    const [playback, setPlayback] = useState();

    let db = new Localbase('db');
    
    const onStop = useCallback((recordedBlob) => {
        db.collection('audio').add(recordedBlob);
        let audio = new Audio();
        audio.src = recordedBlob.blobURL;
        setAudio(audio.cloneNode());
        setDuration(recordedBlob.stopTime - recordedBlob.startTime);
        //setAudForV(audio.cloneNode());
      });

    const stopBut = useCallback(() => {
        if(recState.record === true){
            setRecord({record: false})
        }
        else{
            setPlayback("stop")
        }
    });

    const convert = useCallback((milis) => {
        const minutes = Math.floor(milis/60000);
        const seconds = ((milis%60000)/1000).toFixed(0);
        const miliseconds = milis - Math.floor(milis/1000)*1000;
        return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds + '\'' + (miliseconds < 100 ? '0' : '') + (miliseconds < 10 ? '0' : '') + miliseconds;
    });
    
    return(
        <div className="playback">
                <div id="recording-control-panel">
                    <div id="button-panel">
                        <button id="rec" className="function-button" onClick={() => setRecord({record: true})}>Record</button>
                        <button id="stop" className="function-button" onClick={() => stopBut()}>Stop</button>
                        <button id="play" className="function-button" onClick={ () => setPlayback("play") }>Play</button>
                        <button id="pause" className="function-button" onClick={ () => setPlayback("pause") }>Pause</button>
                        <button id="stf" className="function-button" onClick={ () => setPlayback("skipToFront") }>Skip to front</button>
                        <button id="stb" className="function-button" onClick={ () => setPlayback("skipToBack") }>Skip to back</button>
                    </div>
                    <p id="time-stamp">{convert(duration)}</p>
                    <div id="sound-export">
                        <ReactMic
                            record={ recState.record }
                            className="sound-wave"
                            onStop={ onStop }
                            strokeColor="white"
                            backgroundColor="#484848"
                        />
                        <Export />
                    </div>
                </div>
                {/*<PlaybackContext.Provider value={duration}>*/}
                <div id="recording-pane">
                    <TimeScale dur = {duration} />
                    <RecordingState data = { audioState } playback={playback}/>
                </div>
                {/*</PlaybackContext.Provider>*/}                
        </div>
    );
}



export default Playback;