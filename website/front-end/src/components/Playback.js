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
                        setCurrentTime({time: time});
                        let button = document.getElementById("undo-button");
                        button.disabled = false;
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
                let redobutton = document.getElementById("redo-button");
                redobutton.disabled = false;
            }
            else{
                if(listPointer-1 === 0){
                    let button = document.getElementById("undo-button");
                    button.disabled = true;
                }
                setCurrentTime({time: stack[listPointer-1].time});
                db.collection("audio").set(stack[listPointer-1].document).then(() => {
                    setUpdateList(true);
                    let redobutton = document.getElementById("redo-button");
                    redobutton.disabled = false;
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
            console.log(listPointer);
            
            if(listPointer === stack.length-1){
                let button = document.getElementById("redo-button");
                button.disabled = true;
                let undobutton = document.getElementById("undo-button");
                undobutton.disabled = false;
            }
            else{
                if(listPointer+1 === stack.length-1){
                    let button = document.getElementById("redo-button");
                    button.disabled = true;
                }
                setCurrentTime({time: stack[listPointer+1].time});
                db.collection("audio").set(stack[listPointer+1].document).then(() => {
                    setUpdateList(true);
                });
                let undobutton = document.getElementById("undo-button");
                undobutton.disabled = false;
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

    return(
        <div className="playback">
                <button onClick={handleUndo} id="undo-button">Undo</button>
                <button onClick={handleRedo} id="redo-button">Redo</button>
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