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
import Import from './Import';
import {v4 as uuid} from "uuid";

export async function retrieveData(db){
    let ar = await db.collection('audio').get();
    return ar;
}

let Playback = () =>{
    const [audioState, setAudio] = useState({value: []});
    const [recState, setRecord] = useState({record: false});
    const [duration, setDuration] = useState({value: [0]});
    const [playback, setPlayback] = useState();
    const [trackCount, setTrackCount] = useState({value: []});
    const [updateList, setUpdateList] = useState(false);

    const [versionControl, setVersionControl] = useState(false);
    const [currentTime, setCurrentTime] = useState({time: 0});

    let db = new Localbase('db');

    useEffect(() => {
        if(localStorage.getItem("sessionID") === null){
          db.collection('audio').delete();
          db.collection('versionControl').delete();
          localStorage.setItem("sessionID", uuid() + Date.now());
          localStorage.setItem("previousRec", "");
        }
        else{
          const answer = window.confirm("A previous session has been detected, would you like to continue?");
          if(!answer){
            db.collection('audio').delete();
            db.collection('versionControl').delete();
            localStorage.setItem("sessionID", uuid() + Date.now());
            localStorage.setItem("previousRec", "");
          }
          else{
            setUpdateList(true);
          }
        }
        
      }, []);
    
    const onStop = useCallback((recordedBlob) => {
        console.log(recordedBlob);
        const dur = recordedBlob.stopTime-recordedBlob.startTime;
        db.collection('audio').add({count: trackCount.value.length, blob: recordedBlob.blob, volume: 1, duration: dur})
        .then(() =>{
            setUpdateList(true);
            setVersionControl(true);
        });
        
        
    });

    useEffect(() => {
        setVersionControl(false);
        //db.collection("versionControl").get().then(doc => {
            if(versionControl){
                console.log("hello?")
                db.collection('audio').get().then((doc) =>{
                    //db.collection('versionControl').get()
                    const time = Date.now();
                    db.collection("versionControl").orderBy("time").get().then((vcList)=>{
                        let pointer = 0;
                        console.log(doc);
                        console.log(time)
                        for(let i = 0; i<vcList.length; i++){
                            if(vcList[i].time === currentTime.time){
                                pointer = i;
                                break;
                            }
                        }
                        console.log(pointer)

                        if(pointer !== vcList.length && vcList.length !== 0){
                            const editedStack = deleteStack(vcList, pointer);
                            editedStack.push({time: time, document: doc});
                            db.collection("versionControl").set(editedStack);
                        }
                        else{
                            db.collection("versionControl").add({time: time, document: doc});
                        }
                        if(vcList.length >= 1){
                            let button = document.getElementById("undo-button");
                            button.disabled = false;
                            button.className = "vc-buttons";
                        }
                        setCurrentTime({time: time});
                    });

                });
                
            }
        //});
            
    }, [versionControl]);

    useEffect(() => {
        if(audioState.value.length > 0){
            let newDurationList = [];
            audioState.value.forEach(entry => {
                newDurationList.push(entry.dur);
            });
            setDuration({value: newDurationList});
        }
    }, [audioState]);

    useEffect(() => {
        if(updateList === true){
            db.collection('audio').get().then(doc => {
                //db.collection('versionControl').add({version: versionControl, document: doc});
                let newList = [];
                let newDur = [];
                doc.forEach(entry => {
                    const recBlob = entry.blob;
                    let audio = new Audio();
                    const url = URL.createObjectURL(recBlob);
                    audio.src = url;
                    const recDur = entry.duration;

                    const newRec = {
                        count: entry.count,
                        rec: audio.cloneNode(),
                        dur: recDur
                    };
                    newList.push(newRec);
                    newDur.push(recDur);
                    
                });
                if(newDur.length === 0){
                    setDuration({value: [0]});
                }
                else{
                    setDuration({value: newDur});
                }

                setAudio({value: newList});
                console.log(newList, newDur)
                //if(audioState.value !== []){
                
                
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
            let m = document.getElementsByClassName("sound-wave-active");
            m[0].className = "sound-wave";
            let l = trackCount.value;
            l.push(0);
            setTrackCount({value: l});
            setRecord({record: false});
        }
        else{
            setPlayback("stop")
        }
    });

    const deleteStack = useCallback((document, pointer) => {
        const newList = [];
        for(let i = 0; i<=pointer; i++){
            newList.push(document[i]);
        }
        return newList;
    });

    const handleUndo = useCallback(async () => {
        const stack = await db.collection("versionControl").orderBy('time').get();
        console.log(stack.length)
        if(stack.length > 1){
            let listPointer = 0;
            for(let i = 0; i<stack.length; i++){
                const lastCol = stack[i];
                const lastColTime = lastCol.time;
                console.log(currentTime, lastColTime);
                if(currentTime.time === lastColTime){
                    listPointer = i;
                    break;
                }
            }
            console.log(listPointer);
            
            if(listPointer === 0){
                let button = document.getElementById("undo-button");
                button.disabled = true;
                button.className = "vc-disabled";
                let redobutton = document.getElementById("redo-button");
                redobutton.disabled = false;
                redobutton.className = "vc-buttons";
            }
            else{
                if(listPointer-1 === 0){
                    let button = document.getElementById("undo-button");
                    button.disabled = true;
                    button.className = "vc-disabled";
                }
                setCurrentTime({time: stack[listPointer-1].time});
                db.collection("audio").set(stack[listPointer-1].document).then(() => {
                    setUpdateList(true);
                    let redobutton = document.getElementById("redo-button");
                    redobutton.disabled = false;
                    redobutton.className = "vc-buttons";
                });   
            }
        }
        else{
    
        }
      });
    
      const handleRedo = useCallback(async () => {
        const stack = await db.collection("versionControl").orderBy('time').get();
        console.log(stack);
        if(stack.length > 1){
            let listPointer = 0;
            for(let i = 0; i<stack.length; i++){
                const lastCol = stack[i];
                const lastColTime = lastCol.time;
                console.log(currentTime, lastColTime);
                if(currentTime.time === lastColTime){
                    listPointer = i;
                    break;
                }
            }
            console.log(listPointer, stack.length);
            
            if(listPointer === stack.length-1){
                console.log("??gnieroib35h");
                let button = document.getElementById("redo-button");
                button.disabled = true;
                button.className = "vc-disabled";
                let undobutton = document.getElementById("undo-button");
                undobutton.disabled = false;
                undobutton.className = "vc-buttons";
            }
            else{
                if(listPointer === stack.length-2){
                    console.log("??????wirhbnivnrebopi")
                    let button = document.getElementById("redo-button");
                    button.disabled = true;
                    button.className = "vc-disabled";
                    
                }
                setCurrentTime({time: stack[listPointer+1].time});
                db.collection("audio").set(stack[listPointer+1].document).then(() => {
                    setUpdateList(true);
                });
                let undobutton = document.getElementById("undo-button");
                undobutton.disabled = false;
                undobutton.className = "vc-buttons";
            }
        }
        else{
    
        }
      })
      

    //console.log(audioState);

    const convert = useCallback((milis) => {
        //this solution has been modified to my needs and takes from this source https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
        milis = Math.round(milis)
        const minutes = Math.floor(milis/60000);
        const seconds = ((milis%60000)/1000).toFixed(0);
        const miliseconds = milis - Math.floor(milis/1000)*1000;
        return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds + '\'' + (miliseconds < 100 ? '0' : '') + (miliseconds < 10 ? '0' : '') + miliseconds;
    });

    const onRecord = useCallback(() => {
        if(recState.record === false){
            setRecord({record: true});
            let m = document.getElementsByClassName("sound-wave");
            console.log(m);
            m[0].className = "sound-wave-active";
        }
        if(recState.record === true){
            let m = document.getElementsByClassName("sound-wave-active");
            m[0].className = "sound-wave";
            let l = trackCount.value;
            l.push(0);
            setTrackCount({value: l});
            setRecord({record: false});
        }
        
    });

    const onPause = useCallback(() => {
        if(recState.record === false){
            setPlayback("pause")
        }
        else{
            let m = document.getElementsByClassName("sound-wave-active");
            m[0].className = "sound-wave";
            let l = trackCount.value;
            l.push(0);
            setTrackCount({value: l});
            setRecord({record: false});
        }
    });

    const onPlay = useCallback(() => {
        if(recState.record === false){
            setPlayback("play")
        }
        else{
            let m = document.getElementsByClassName("sound-wave-active");
            m[0].className = "sound-wave";
            let l = trackCount.value;
            l.push(0);
            setTrackCount({value: l});
            setRecord({record: false});
        }
    });

    const onSkipToFront = useCallback(() => {
        if(recState.record === false){
            setPlayback("skipToFront")
        }
        else{
            let m = document.getElementsByClassName("sound-wave-active");
            m[0].className = "sound-wave";
            let l = trackCount.value;
            l.push(0);
            setTrackCount({value: l});
            setRecord({record: false});
        }
    });

    const onSkipToBack = useCallback(() => {
        if(recState.record === false){
            setPlayback("skipToBack")
        }
        else{
            let m = document.getElementsByClassName("sound-wave-active");
            m[0].className = "sound-wave";
            let l = trackCount.value;
            l.push(0);
            setTrackCount({value: l});
            setRecord({record: false});
        }
    });

    return(
        <div className="playback">
                <div id="recording-control-panel">
                    <div id="button-panel">
                        <button id="rec" title="Record" className="function-button" onClick={ onRecord }><img src={require("../style/assets/rec.svg").default} alt="Record" /></button>
                        <button id="stop" title="Stop" className="function-button" onClick={stopBut}><img src={require("../style/assets/stop.svg").default} alt="Stop" /></button>
                        <button id="play" title="Play" className="function-button" onClick={ onPlay }><img src={require("../style/assets/play.svg").default} alt="Play" /></button>
                        <button id="pause" title="Pause" className="function-button" onClick={ onPause }><img src={require("../style/assets/pause.svg").default} alt="Pause" /></button>
                        <button id="stf" title="Skip To Front" className="function-button" onClick={ onSkipToFront }><img src={require("../style/assets/stf.svg").default} alt="Skip to Front" /></button>
                        <button id="stb" title="Skip To Back" className="function-button" onClick={ onSkipToBack }><img src={require("../style/assets/stb.svg").default} alt="Skip to Back" /></button>
                        <div>
                            <p id="time-stamp-label">Project duration:</p>
                            <p id="time-stamp">{convert(Math.max(...duration.value))}</p>
                        </div>
                        
                    </div>
                    
                    <div id="sound-export">
                        <div id="version-control-panel">
                            <button onClick={handleUndo} id="undo-button" className="vc-disabled" title="Undo" ><img src={require("../style/assets/undo.png").default} alt="Undo" style={{width: "85%", height: "auto"}}></img></button>
                            <button onClick={handleRedo} id="redo-button" className="vc-disabled" title="Redo" ><img src={require("../style/assets/redo.png").default} alt="Redo" style={{width: "85%", height: "auto"}}></img></button>
                        </div>
                        <ReactMic
                            record={ recState.record }
                            id="monitor"
                            className="sound-wave"
                            onStop={ onStop }
                            strokeColor="white"
                            backgroundColor="#484848"
                        />
                        <Export />
                        <Import setTrackCount = {setTrackCount} trackCount = {trackCount} setUpdateList = {setUpdateList} setVersionControl={setVersionControl}/>
                    </div>
                </div>
                {/*<PlaybackContext.Provider value={duration}>*/}
                <div id="recording-pane">
                    <TimeScale dur = {Math.max(...duration.value)} />
                    <RecordingState data = { audioState } playback={playback} setAudio = {setAudio} setTrackCount = {setTrackCount} trackCount = {trackCount} versionControl = {versionControl} setVersionControl = {setVersionControl}/>
                </div>
                {/*</PlaybackContext.Provider>*/}                
        </div>
    );
}



export default Playback;