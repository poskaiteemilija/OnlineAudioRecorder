import Localbase from 'localbase';
import React, { useRef, useEffect, useCallback, useState, useContext, useDebugValue } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import "../style/Wave.css";

import CustomMenu from "./CustomMenu.js";
import ConcatenateBlobs from "concatenateblobs";

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
    const [region, setRegion] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({x:0, y:0});
    const [showMenu, setMenu] = useState(false);
    const [option, setOption] = useState("");
    const [currentRegion, setCurrentRegion] = useState({});
    const [currentTrack, setCurrentTrack] = useState({});

    const [delClip, setDelClip] = useState({delete: []});

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

          let wavesurfertemp = WaveSurfer.create({
            container: parentDiv,
            fillParent: true,
            minPxPerSec: 200,
            backgroundColor: "#ffffff",
            plugins:[
              RegionsPlugin.create({
                regions:[
                  
                ]
              })
            ]
          });

          wavesurfertemp.load(recording.rec);
          wavesurfertemp.setCursorColor('#fa95d0');
          wavesurfertemp.setHeight("200");

          wavesurfertemp.on("seek", () => {
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

          wavesurfertemp.on('region-created', () => {
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

          wavesurfertemp.on("region-mouseenter", (region, mouseenter) => {
            console.log("region event");
            console.log(region);
            console.log(mouseenter);
            document.addEventListener("contextmenu", (event) => {
              event.preventDefault();
              setAnchorPoint({x: event.pageY, y: event.pageX});
              setCurrentRegion(region);
              setMenu(true);
            });
            //wavesurfertemp.clearRegions();
            
          });

          if(duration !== maxVal){
            const percentage = duration/maxVal;
            parentDiv.style.width = (wave.clientWidth*percentage) + "px";
          }
          
          //baseDiv.append(parentDiv);
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

            break;
          case "cut":
            break;
          case "paste":
            break;
          case "delete":
            onRegionDelete();
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
          const joinedDuration = (delClip.delete[first].duration + delClip.delete[second].duration)*1000;
          console.log(joinedDuration);

          let joinedBlob = new Blob([delClip.delete[first].data, delClip.delete[second].data], { 'type' : 'audio/ogg; codecs=opus' });
          let link = URL.createObjectURL(joinedBlob);
          let audio = new Audio();
          audio.src = link;
          audio.onloadedmetadata = function(){
            console.log(joinedBlob, audio);
            console.log(joinedDuration);
            db.collection("audio").add(joinedBlob);
            let list = props.audio.value;
            list[delClip.delete[0].track] = {
              rec: audio.cloneNode(),
              dur: joinedDuration
            };
            props.setAudio({value: list});
            setDelClip({delete: []});
          };
          
        }
      }
    }, [delClip]);



    let sliceAudio = (startTime, endTime, blob, tc, o) => {
      //check out this alternative way to copy a part of audiobuffer: https://www.npmjs.com/package/audiobuffer-slice
      //the code in this function is taken and combined from these two sources: https://stackoverflow.com/questions/54303632/trim-an-audio-file-using-javascript-first-3-seconds and https://stackoverflow.com/questions/40363335/how-to-create-an-audiobuffer-from-a-blob
      console.log("this is slice audio");
      console.log(blob, startTime, endTime);
      const audioCont = new AudioContext();
      const fileReader = new FileReader();
    
      let source = audioCont.createBufferSource();
      let destination = audioCont.createMediaStreamDestination();
      let mediaRec = new MediaRecorder(destination.stream);
    
      mediaRec.addEventListener('dataavailable', function(e){
        console.log(e.data, "DATA GRL");
        let a = new Audio();
        let blobURL = URL.createObjectURL(e.data);
        a.src = blobURL;
        a.play();
        
        let temp = delClip.delete;
        temp.push({data: e.data, track: tc, order: o, duration: endTime-startTime});
        
        setDelClip({delete: temp});
      });
      
      fileReader.onloadend = () => {
        const arrayBuffer = fileReader.result;
    
        audioCont.decodeAudioData(arrayBuffer, (audioBuffer) => {
            console.log(audioBuffer);
    
            source.buffer = audioBuffer;
            source.connect(destination);
            mediaRec.start();
            
            const s = Date.now();
            console.log(startTime, endTime, audioCont.currentTime);
            source.start(audioCont.currentTime, startTime, endTime-startTime);
            source.addEventListener('ended', e => {
              const en = Date.now();
              console.log(en - s);
              console.log(endTime-startTime);
              mediaRec.requestData();
            });
        });
      }
    
      fileReader.readAsArrayBuffer(blob);
    
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

    const onCopy = useCallback(() => {

    });

    const onCut = useCallback(() => {

    });

    const onPaste = useCallback(() => {

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

      console.log(res, blob, dur, startTime, endTime, tc, "UGBFRKWNOVRLUNHOILEWRNMOVIP#EHILTRNHBKEJUBGN JBNUJKBNUEITKU");
      
      if(startTime <= 0.1 && dur-endTime > 0.1){
        const emptyBlob = new Blob();

        let temp = delClip.delete;
        temp.push({data: emptyBlob, track: tc, order: 0, duration: 0});
        setDelClip({delete: temp});

        sliceAudio(endTime, dur, blob, tc, 1)
      }
      else if(startTime >= 0.1 && dur-endTime <= 0.1){
        const emptyBlob = new Blob();

        let temp = delClip.delete;
        temp.push({data: emptyBlob, track: tc, order: 1, duration: 0});
        setDelClip({delete: temp});

        sliceAudio(0, startTime, blob, tc, 0);
      }
      else if(startTime <=0.1 && dur-endTime <= 0.1){
        console.log("THE RIGHT PLACE ////////////////////////////");
        onTrackDelete(tc);
      }
      else{
        sliceAudio(0, startTime, blob, tc, 0);
        sliceAudio(endTime, dur, blob, tc, 1);
      }
      
    });

    const onTrackDelete = useCallback(async (tc) => {
      let list = props.audio.value;
      const count = list[tc].count;
      console.log(count);
      db.collection('audio').doc({count: count}).delete().then(document => {
        console.log("DELETED TRACK: ", document);
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
      props.setTrackCount({value: props.trackCount.value-1});
    });
    
    const onPlay = useCallback(() => {
      wavesurfer.value.forEach(track => {
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

    return(
      <div>
        <CustomMenu showMenu = {showMenu} anchorPoint = {anchorPoint} setOption = {setOption}></CustomMenu>
        <div ref={waveformRef} id="wave"></div>
      </div>
      
    );
}

export default AudioWave;