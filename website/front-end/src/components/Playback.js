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
    const [audioState, setAudio] = useState({value: []});
    const [recState, setRecord] = useState({record: false});
    const [duration, setDuration] = useState({value: [0]});
    const [playback, setPlayback] = useState();
    const [trackCount, setTrackCount] = useState({value: -1});
    const [updateList, setUpdateList] = useState(false);

    let db = new Localbase('db');
    
    const onStop = useCallback((recordedBlob) => {
        db.collection('audio').add({count: audioState.value.length, blob: recordedBlob})
        .then(setUpdateList(true));
        
        
    });

    useEffect(() => {
        if(updateList === true){
            db.collection('audio').get().then(doc => {
                console.log(doc);
                const recBlob = doc[audioState.value.length].blob;
                let audio = new Audio();
                audio.src = recBlob.blobURL;
                const recDur = recBlob.stopTime - recBlob.startTime;
                //if(audioState.value !== []){
                let newList = audioState.value;
                const newRec = {
                    count: doc[audioState.value.length].count,
                    rec: audio.cloneNode(),
                    dur: recDur
                };
                newList.push(newRec);
                setAudio({value: newList});
                const newDur = duration.value;
                newDur.push(recDur);
                setDuration({value: newDur});
               //}
               //else{
               //    const newRec = {
               //        count: audioState.value.length,
               //        rec: audio.cloneNode(),
               //        dur: recDur
               //    };
               //    const newList = [newRec]
               //    setAudio({value: newList});
               //    const newDur = [recDur];
               //    setDuration({value: newDur});
               //}
                setUpdateList(false);
            })
        }
        
        
    }, [updateList]);

    const stopBut = useCallback(() => {
        if(recState.record === true){
            setRecord({record: false});
            setTrackCount({value: trackCount.value+1});
        }
        else{
            setPlayback("stop")
        }
    });

    const convert = useCallback((milis) => {
        //this solution has been modified to my needs and takes from this source https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
        const minutes = Math.floor(milis/60000);
        const seconds = ((milis%60000)/1000).toFixed(0);
        const miliseconds = milis - Math.floor(milis/1000)*1000;
        return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds + '\'' + (miliseconds < 100 ? '0' : '') + (miliseconds < 10 ? '0' : '') + miliseconds;
    });

    console.log(trackCount);

    return(
        <div className="playback">
                <div id="recording-control-panel">
                    <div id="button-panel">
                        <button id="rec" className="function-button" onClick={() => setRecord({record: true})}><img src={require("../style/assets/rec.svg").default} alt="Record" /></button>
                        <button id="stop" className="function-button" onClick={() => stopBut()}><img src={require("../style/assets/stop.svg").default} alt="Stop" /></button>
                        <button id="play" className="function-button" onClick={ () => setPlayback("play") }><img src={require("../style/assets/play.svg").default} alt="Play" /></button>
                        <button id="pause" className="function-button" onClick={ () => setPlayback("pause") }><img src={require("../style/assets/pause.svg").default} alt="Pause" /></button>
                        <button id="stf" className="function-button" onClick={ () => setPlayback("skipToFront") }><img src={require("../style/assets/stf.svg").default} alt="Skip to Front" /></button>
                        <button id="stb" className="function-button" onClick={ () => setPlayback("skipToBack") }><img src={require("../style/assets/stb.svg").default} alt="Skip to Back" /></button>
                    </div>
                    <p id="time-stamp">{convert(Math.max(...duration.value))}</p>
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
                    <TimeScale dur = {Math.max(...duration.value)} />
                    <RecordingState data = { audioState } playback={playback} setAudio = {setAudio} setTrackCount = {setTrackCount} trackCount = {trackCount}/>
                </div>
                {/*</PlaybackContext.Provider>*/}                
        </div>
    );
}



export default Playback;