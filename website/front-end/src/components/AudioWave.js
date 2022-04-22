import Localbase from 'localbase';
import React, { useRef, useEffect, useCallback, useState, useContext, useDebugValue } from 'react';
import WaveSurfer, { util } from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import "../style/Wave.css";

import CustomMenu from "./CustomMenu.js";
import ConcatenateBlobs from "concatenateblobs";
import AudioBufferSlice, { audioBufferSlice } from "audiobuffer-slice";
import utils from "audio-buffer-utils";
import audioEncoder from "audio-encoder";
import OptionPopUp from './OptionPopUp';


//import ControlDiv from "./ControlDiv";

/*
        TO DO:
        delete a track
        mute a track
        -- don't streach the wave to fit the screen (or don't resize other waves in the process of it)
*/

let AudioWave = (props) => {
    //const { playbackTime, setPlaybackTime } = useContext(PlaybackContext);
    const db = new Localbase("db");

    const [state, setState] = useState();
    const waveformRef = useRef();
    const [wavesurfer, setWaveSurfer] = useState({value: []});
    const waveArrayRef = useRef();
    waveArrayRef.current = wavesurfer.value;
    
    const [region, setRegion] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({x:0, y:0});
    const [showMenu, setMenu] = useState(false);
    const [option, setOption] = useState("");
    
    const [currentRegion, setCurrentRegion] = useState({});
    const [currentTrack, setCurrentTrack] = useState({});

    const [delClip, setDelClip] = useState({delete: []});
    const [copyClip, setCopyClip] = useState({copy: {}, silence: {}});
    const [currentTime, setCurrentTime] = useState(-1);
    const [pasteClip, setPasteClip] = useState({paste: [], mode: "standard"});

    const [showSlider, setShowSlider] = useState({show: false, mode: "s"});
    const [silent, setSilent] = useState({value: -1});
    const [vol, setVol] = useState({value: -1, track: -1});

    const quickTrackOptions = (id) => {
      let mainDiv = document.createElement("div");
      mainDiv.className = "quick-track-options";
      mainDiv.id = "qto"+id;

      let deleteBut = document.createElement("button");
      deleteBut.id = "db"+id;
      deleteBut.innerHTML = "Delete";
      deleteBut.onclick = () => {onDelButton(deleteBut.id)}

      let muteButton = document.createElement("button");
      muteButton.id = "mb"+id;
      muteButton.innerHTML = "Mute";
      muteButton.onclick = () => {onMuteButton(muteButton.id)}

      let changeVolBut = document.createElement("button");
      changeVolBut.id = "cvb"+id;
      changeVolBut.innerHTML = "Change Volume"
      changeVolBut.onclick = () => {onChangeVolume(changeVolBut.id)}

      mainDiv.appendChild(muteButton);
      mainDiv.appendChild(changeVolBut);
      mainDiv.appendChild(deleteBut);

      return mainDiv;
    }

    const onDelButton = (id) => {
      console.log(id, "DELETE***************************");
      const trackCount = parseInt(id.substring(2,id.length));
      console.log(trackCount);
      onTrackDelete(trackCount);
    }

    const onMuteButton = (id) => {
      console.log(id, "MUTE**************************");
      const trackCount = parseInt(id.substring(2,id.length));
      mute(trackCount);
    }

    const mute = useCallback((trackCount) => {
      console.log(waveArrayRef);
      const track = waveArrayRef.current[trackCount];
      console.log(trackCount, track, wavesurfer, track.getMute());
      let b = document.getElementById("mb"+trackCount);
      b.innerHTML = "";

      if(track.getMute()){
        track.setMute(false);
        b.innerHTML = "Mute"
        updateDBVolume(trackCount, 1);
      }
      else{
        console.log("false");
        track.setMute(true);
        b.innerHTML = "Unmute";
        updateDBVolume(trackCount, 0);
      }    
    });

    const onChangeVolume = (id) => {
      console.log(id, "ON CHANGE VOLUME************************")
      const trackCount = parseInt(id.substring(3,id.length));
      changeVol(trackCount);
    }

    const changeVol = useCallback((trackCount) =>{
      console.log(waveArrayRef.current)
      let track = waveArrayRef.current[trackCount];
      console.log(track.getVolume(), track.backend.buffer);
      setShowSlider({show: true, mode: "v", track: trackCount});
    });

    useEffect(() => {
      let wave = document.getElementById("wave");
      wave.innerHTML = "";


      if(waveformRef.current) {
        const audioRecs = props.audio.value;
        let maxVal = 0;

        audioRecs.forEach(rec => {
          if(maxVal <= rec.dur){
            maxVal = rec.dur;
          }
        });
        
        let count = 0;
        
        let newList = [];

        audioRecs.forEach(recording => {
          const duration = recording.dur;
          
          const parentDiv = document.createElement("div");
          parentDiv.id = "track"+count;

          let wavesurfertemp = WaveSurfer.create({
            container: parentDiv,
            fillParent: true,
            minPxPerSec: 200,
            backgroundColor: "#ffffff",
            plugins:[
              RegionsPlugin.create({
                regions:[]
              })
            ]
          });

          console.log(recording.rec);

          wavesurfertemp.load(recording.rec);
          wavesurfertemp.setCursorColor('#fa95d0');
          wavesurfertemp.setHeight("200");

          wavesurfertemp.on("seek", (position) => {
            const currentTime = position*wavesurfertemp.getDuration();
            setCurrentTime(currentTime);
            setCurrentTrack(wavesurfertemp);
            wavesurfertemp.clearRegions();
            setMenu(false);
            //setRegion(false);
          });

          wavesurfertemp.enableDragSelection(
            {
              start: 0,
              end: 1,
              loop: false,
              color: '#cccccc'
            }
          );

          wavesurfertemp.on('region-created', (region) => {
            setCurrentRegion(region);
            setRegion(true);
          });

          wavesurfertemp.on('region-removed', () =>{
            setRegion(false);
          });

          wavesurfertemp.on('region-updated', (region) => {
            //this function is taken from: https://stackoverflow.com/questions/60679114/how-to-avoid-multiple-regions-being-created-in-wavesurferjs
            const regionList = region.wavesurfer.regions.list;
            //console.log("------------------REGION UPDATE--------------", regionList);
            const keys = Object.keys(regionList);
            //console.log(keys, keys.length);
            if(keys.length > 1){
              regionList[keys[0]].remove();
            }
          });

          wavesurfertemp.on("ready", () =>{
            console.log("nvreionwiotnbiwlnboinoirtnblirnbliblorgpodrjgposrjgojrgopij")
            parentDiv.addEventListener("contextmenu", (event) => {
              console.log("right click without region LOL")
              event.preventDefault();
              setAnchorPoint({x: event.pageY, y: event.pageX});
              setMenu(true);
            })
          });

          if(duration !== maxVal){
            const percentage = duration/maxVal;
            parentDiv.style.width = (wave.clientWidth*percentage) + "px";
          }
          
          //baseDiv.append(parentDiv);
          const qto = quickTrackOptions(count);
          parentDiv.appendChild(qto);
          wave.appendChild(parentDiv);

          newList.push(wavesurfertemp);
          
          count++;
        }); 
        //setBackgroundColor()
        
        setWaveSurfer({value: newList});
        setState(true);
      }
    }, [props.audio]);

    useEffect(() => {
      if(state === true){
        switch(props.playback){
          case "play":
            onPlay();
            break;
          case "pause":
            onPause();
            break;
          case "stop":
            onStop();
            break;
          case "skipToFront":
            skipToFront();
            break;
          case "skipToBack":
            skipToBack();
            break;
        }
      }
      
    }, [props.playback]);

    useEffect(() => {
      console.log('***************REGIONS*************');
      console.log(region);
      if(region === true){
        wavesurfer.value.forEach(track => {
          console.log(track);
          console.log(track.regions.list);
          if(Object.keys(track.regions.list).length === 0){
            console.log("this does not get fired");
            track.disableDragSelection();
        }
      });
      }
      else{
        wavesurfer.value.forEach(track => {
          track.enableDragSelection({
            start: 0,
            nd: 1,
            oop: false,
            olor: '#cccccc'
            });
        })
      }

    }, [region]);

    useEffect(() => {
      if(option != ""){
        console.log("in useEffect");
        console.log(currentRegion);
        console.log(currentTrack);
        switch(option){
          case "copy":
            if(Object.keys(currentRegion).length !== 0){
              onCopy();
            }
            else{
              alert("Select a region to be copied!");
            }
            break;
          case "cut":
            if(Object.keys(currentRegion).length !== 0){
              onCut();
            }
            else{
              alert("Select a region to be cut!");
            }
            break;
          case "paste":
            console.log(Object.keys(copyClip.copy).length, currentTime,Object.keys(currentTrack).length)
            if(Object.keys(copyClip.copy).length !== 0 && currentTime !== -1 && Object.keys(currentTrack).length !== 0){
              onPaste();
            }
            else{
              alert("Clipboard is empty!");
            }
            break;
          case "delete":
            if(Object.keys(currentRegion).length !== 0){
              onRegionDelete();
            }
            else{
              alert("Please select a region to delete!");
            }
            break;
          case "silence":
            setShowSlider({show: true, mode: "s"});
            //onSilence();
            break;
        }
      }

      setOption("");
      setMenu(false);
    }, [option]);

    useEffect(() => {
      if(delClip.delete!==[]){
        console.log("CLIPBOARD UPDATE: ", delClip);
        if(delClip.delete.length === 2){
            const first = delClip.delete[0].order === 0 ? 0 : 1;
            const second = delClip.delete[1].order === 0 ? 0 : 1;
            console.log(delClip.delete[0].order, delClip.delete[1].order)

            const buffer1 = delClip.delete[first].data;
            const buffer2 = delClip.delete[second].data;
            const trackCount = delClip.delete[0].track;
            console.log(buffer1, first, buffer2, second);


            let newbuf = {};
            let joinedDuration = 0;
            if(buffer1 === null){
              newbuf = buffer2;
              joinedDuration = buffer2.duration*1000;
            }
            else if(buffer2 === null){
              newbuf = buffer1;
              joinedDuration = buffer1.duration*1000;
            }
            else{
              newbuf = utils.concat([buffer1, buffer2]);
              console.log(newbuf);
              joinedDuration = newbuf.duration*1000;
            }

            updateTracks(newbuf, joinedDuration, trackCount);
            
            setDelClip({delete: []});
            setCurrentRegion({});
        }
      }
    }, [delClip]);

    useEffect(() => {
      console.log(copyClip);
      if(Object.keys(copyClip.copy).length !== 0 && Object.keys(copyClip.copy).length !== 0 && Object.keys(currentRegion).length !== 0){
        currentRegion.wavesurfer.clearRegions();
        setCurrentRegion({});
      }
    }, [copyClip]);

    useEffect(() => {
      if(silent.value !== -1){
        onSilence();
        setSilent({value: -1});
      }
    }, [silent]);

    useEffect(() => {
      if(vol.track !== -1 && vol.value !== -1){
        console.log(vol);
        const t = waveArrayRef.current[vol.track];
        console.log(t);
        t.setVolume(vol.value);
        updateDBVolume(vol.track, vol.value);
      }
    }, [vol]);

    const updateDBVolume = async (c, vol) => {
      const d = await db.collection('audio').get();
      console.log(d);
      const blob = d[c].blob;
      const count = d[c].count;
      const dur = d[c].duration;
      db.collection("audio").doc({count: count}).delete().then(() =>{
        db.collection("audio").add({count: count, blob: blob, volume: vol, duration: dur})
        .then(() =>{
          props.setVersionControl(true)
        });
      });

      
    }

    useEffect(() => {
      if(pasteClip.paste !== []){
        if(pasteClip.paste.length === 2){
          console.log(pasteClip);
          const first = pasteClip.paste[0].o === 0 ? 0 : 1;
          const second = pasteClip.paste[1].o === 0 ? 0 : 1;
          
          const buffer1 = pasteClip.paste[first].data;

          let buffer2 = {};
        
          if(pasteClip.mode === "silence"){
            buffer2 = copyClip.silence;
            console.log(buffer2);
          }
          else{
            buffer2 = copyClip.copy.data;
          }

          let d = buffer2.duration;
          
          const buffer3 = pasteClip.paste[second].data;
          const trackCount = pasteClip.paste[0].tc;

          let bufferArray = [];

          if(buffer1 === null){
            bufferArray = [buffer2, buffer3];
          }
          else if(buffer3 === null){
            bufferArray = [buffer1, buffer2];
          }
          else{
            bufferArray = [buffer1, buffer2, buffer3];
          }
          
          const newBuf = utils.concat(bufferArray);
          const joinedDuration = (pasteClip.paste[0].duration+pasteClip.paste[1].duration+d)*1000;
          console.log(pasteClip.paste[0].duration, pasteClip.paste[1].duration, d)

          console.log(newBuf, joinedDuration, trackCount);
          updateTracks(newBuf, joinedDuration, trackCount);
          
          setPasteClip({paste: [], mode: "standard"});
          const copyC = copyClip.copy;
          setCopyClip({copy: copyC, silence: {}});
        }
      }
    }, [pasteClip])

    const updateTracks = (newbuf, joinedDuration, trackCount) => {
      const dur = newbuf.duration
      audioEncoder(newbuf, 0, null, function onComplete(finalblob){
        //const blob = new Blob([interleaved], {'type': "audio/webm;codecs=opus"});
        let audio = new Audio();
        const bloburl = URL.createObjectURL(finalblob);
        console.log(bloburl);
        audio.src = bloburl;
        /*audio.play();*/

        let list = props.audio.value;
        const count = list[trackCount].count;
        console.log(count);
        db.collection("audio").doc({count: count}).delete().then(() =>{
          db.collection("audio").add({count: count, blob: finalblob, volume: 1, duration: dur*1000}).then(() =>{
            props.setVersionControl(true)
          });
        });
        list[trackCount] = {
          count: count,
          rec: audio.cloneNode(),
          dur: joinedDuration
        };
        props.setAudio({value: list});
      });
    }


    let sliceAudio = (startTime, endTime, blob, tc, o, func) => {
      //check out this alternative way to copy a part of audiobuffer: https://www.npmjs.com/package/audiobuffer-slice
      //the code in this function is taken and combined from these two sources: https://stackoverflow.com/questions/54303632/trim-an-audio-file-using-javascript-first-3-seconds and https://stackoverflow.com/questions/40363335/how-to-create-an-audiobuffer-from-a-blob
      console.log("this is slice audio");
      console.log(startTime, endTime, blob, tc, o);

      const audioCont = new AudioContext();
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        const arrayBuffer = fileReader.result;
        console.log(arrayBuffer);
        audioCont.decodeAudioData(arrayBuffer, (audioBuffer) => {
          //let source = audioCont.createBufferSource();
          AudioBufferSlice(audioBuffer, startTime*1000, endTime*1000,function(error, slicedAudioBuffer){
            if(error){
              console.error(error);
            }
            else{
              //source.buffer = slicedAudioBuffer;
              console.log(slicedAudioBuffer);
              if(func === "delete"){
                let temp = delClip.delete;
                temp.push({data: slicedAudioBuffer, track: tc, order: o, duration: slicedAudioBuffer.duration});
                setDelClip({delete: temp});
              }
              else if(func === "copy"){
                setCopyClip({copy: {
                  data: slicedAudioBuffer,
                  duration: slicedAudioBuffer.duration
                },
                silence: {}
                });
              }
              
            }
          });
        });
      }

      fileReader.readAsArrayBuffer(blob);
    }

    let sliceAudioBuf = (audioBuffer, start, end, order, tc, mode) => {
      audioBufferSlice(audioBuffer, start*1000, end*1000, function(error, slicedAudioBuffer){
        if(error){
          console.error(error);
        }
        else{
          let temp = pasteClip.paste;
          temp.push({
            data: slicedAudioBuffer,
            duration: slicedAudioBuffer.duration,
            tc: tc,
            o: order
        })
          setPasteClip({paste: temp, mode: mode})
        }
      });

    }

    const onSilence = () => {
      console.log("silence");
      const trackID = currentTrack.container.id;
      //console.log(currentTrack.container.id, currentTime)
      const tc = parseInt(trackID.substring(5, trackID.length));
      //console.log(tc)
      const buffer = currentTrack.backend.buffer;

      //get this variable from user
      const userDefinedDur = silent.value;
      const rate = 44100;
      const audioChanels = 2;
      const silentBuffer = utils.create(userDefinedDur*rate, audioChanels, rate);
      const copyC = copyClip.copy;
      setCopyClip({copy: copyC, silence: silentBuffer});

      if(currentTime === 0){
        let temp = pasteClip.paste;
        temp.push({
          data: null,
          duration:0,
          tc: tc,
          o: 0
        });
        setPasteClip({paste: temp, mode: "silence"});
        sliceAudioBuf(buffer, currentTime, buffer.duration, 1, tc, "silence");
      }
      else if(currentTime === buffer.duration){
        let temp = pasteClip.paste;
        temp.push({
          data: null,
          duration:0,
          tc: tc,
          o: 1
        });
        setPasteClip({paste: temp, mode: "silence"});
        sliceAudioBuf(buffer, 0, currentTime, 0, tc, "silence");
      }
      else{
        sliceAudioBuf(buffer, 0, currentTime, 0, tc, "silence");
        sliceAudioBuf(buffer, currentTime, buffer.duration, 1, tc, "silence");
      }

    }

    const getTrackInfo = useCallback(async () => {
      const cT = currentRegion;

      const startTime = cT.start;
      const endTime = cT.end;
      
      let tc = 0;
      let dur = 0;

      for(let i = 0; i< wavesurfer.value.length; i++){
        console.log(wavesurfer.value[i].regions.list);
        if(Object.keys(wavesurfer.value[i].regions.list).length === 1){
          console.log("EXCUSE ME");
          tc = i;
          dur = wavesurfer.value[i].backend.buffer.duration;
          break;
        }
      }
      
      let tempBlob = props.audio.value[tc].rec.src;
      //let dur = props.audio.value[tc].dur/1000;

      console.log("HEREEEEEEEEEE", tempBlob, dur, props.audio.value[tc]);

      let blob = await fetch(tempBlob).then(r => r.blob());
      
      return {fb: blob, d: dur, st: startTime, et: endTime, t: tc};
    });

    const onCopy = useCallback(async () => {
      const res = await getTrackInfo();
      const blob = res.fb;
      const dur = res.d;
      const startTime = res.st;
      const endTime = res.et;
      const tc = res.t;

      console.log(res, blob, dur, startTime, endTime, tc, "COPY *******************************************");

      sliceAudio(startTime, endTime, blob, tc, 0, "copy");
    });

    const onCut = useCallback(async () => {
      await onCopy();
      await onRegionDelete();
    });

    const onPaste = useCallback(() => {
      console.log("paste")
      const trackID = currentTrack.container.id;
      console.log(currentTrack.container.id, currentTime)
      const tc = parseInt(trackID.substring(5, trackID.length));
      console.log(tc)
      const buffer = currentTrack.backend.buffer;
      if(currentTime === 0){
        let temp = pasteClip.paste;
        temp.push({
          data: null,
          duration:0,
          tc: tc,
          o: 0
        });
        setPasteClip({paste: temp, mode: "standard"});
        sliceAudioBuf(buffer, currentTime, buffer.duration, 1, tc, "standard");
      }
      else if(currentTime === buffer.duration){
        let temp = pasteClip.paste;
        temp.push({
          data: null,
          duration:0,
          tc: tc,
          o: 1
        });
        setPasteClip({paste: temp, mode: "standard"});
        sliceAudioBuf(buffer, 0, currentTime, 0, tc, "standard");
      }
      else{
        sliceAudioBuf(buffer, 0, currentTime, 0, tc, "standard");
        sliceAudioBuf(buffer, currentTime, buffer.duration, 1, tc, "standard");
      }
    });

    const onRegionDelete = useCallback(async () => {
      //https://mitya.uk/articles/concatenating-audio-pure-javascript
      //https://github.com/streamproc/MediaStreamRecorder
      const res = await getTrackInfo();
      const blob = res.fb;
      const dur = res.d;
      const startTime = res.st;
      const endTime = res.et;
      const tc = res.t;

      console.log(res, blob, dur, startTime, endTime, tc, "DELETE **************************************");
      
      if(startTime <= 0.1 && dur-endTime > 0.1){
        //const emptyBlob = new Blob([], {type: "audio/x-wav"});

        //sliceAudio(0, dur, emptyBlob, tc, 0, "delete")
        let temp = delClip.delete;
        temp.push({data: null, track: tc, order: 0, duration: 0});
        setDelClip({delete: temp});
        sliceAudio(endTime, dur, blob, tc, 1, "delete")
      }
      else if(startTime >= 0.1 && dur-endTime <= 0.1){
        let temp = delClip.delete;
        temp.push({data: null, track: tc, order: 1, duration: 0});
        setDelClip({delete: temp});

        sliceAudio(0, startTime, blob, tc, 0, "delete");
      }
      else if(startTime <=0.1 && dur-endTime <= 0.1){
        console.log("THE RIGHT PLACE ////////////////////////////");
        onTrackDelete(tc);
      }
      else{
        sliceAudio(0, startTime, blob, tc, 0, "delete");
        sliceAudio(endTime, dur, blob, tc, 1, "delete");
      }
      
    });

    const onTrackDelete = useCallback(async (tc) => {
      let list = props.audio.value;
      const count = list[tc].count;
      console.log(count);
      db.collection('audio').doc({count: count}).delete().then(document => {
        console.log("DELETED TRACK: ", document);
        props.setVersionControl(true)
      });

      let newList = [];
      for(let i = 0; i<list.length; i++){
        if(list[i].count != count){
          newList.push(list[i]);
        }
      }
      
      list = newList;
      //list.pop(props.audio.value[tc]);
      props.setAudio({value: list});
      //props.setTrackCount({value: props.trackCount.value-1});
    });
    
    const onPlay = useCallback(() => {
      wavesurfer.value.forEach(track => {
        console.log(track)
        if(track.backend.source.buffer.duration === track.backend.sheduledPause){
          track.seekTo(0);
        }
        track.play();
      });
    });

    const onPause = useCallback(() =>{
      wavesurfer.value.forEach(track => {
        track.pause();
      });
    });

    const skipToFront = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.pause();
        track.seekTo(0);
        track.play();
      });
    });

    const onStop = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.stop();
      });
    });

    const skipToBack = useCallback(() => {
      wavesurfer.value.forEach(track => {
        track.stop();
        track.seekTo(1);
      });
    });

    console.log("UPDATE: ", wavesurfer.value)

    return(
      <div>
        <CustomMenu showMenu = {showMenu} anchorPoint = {anchorPoint} setOption = {setOption}></CustomMenu>
        <div ref={waveformRef} id="wave"></div>
        <OptionPopUp showSlider = {showSlider} setShowSlider = {setShowSlider} setSilent = {setSilent} setVol = {setVol}></OptionPopUp>
      </div>
      
    );
}

export default AudioWave;