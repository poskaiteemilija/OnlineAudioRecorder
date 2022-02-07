import React, { useCallback, useState } from 'react';
import { retrieveData } from "./Playback";
import Localbase from 'localbase';
import ExportPopUp from "./ExportPopUp";

let Export = () => {
    let db = new Localbase('db');
    const [popUpState, setPopUpState] = useState(false);
    const exportRec = useCallback(() =>{
        //retrieveData(db).then((value) =>{
        //    let url = URL.createObjectURL(value[0].blob);
        //    //console.log(url);
        //    
        //    //this code has been taken in part and modified from https://github.com/michalstocki/FlashWavRecorder/issues/43
        //    const a = document.createElement("a");
        //    let df = document.getElementById("download-file");
        //    
        //    a.href = url;
        //    a.download = "audio" + '.mp3';
        //    df.appendChild(a);
//
        //    a.click();
//
        //    window.URL.revokeObjectURL(url);
        //    df.removeChild(a);
        //});
        
        setPopUpState(true);

    });

    return(
        <div id="download-file">
            <button className="function-button" onClick={ exportRec }><img src={require("../style/assets/export.svg").default} alt="Export" /></button>
            { popUpState ? <ExportPopUp setPopUpState={ setPopUpState } /> : <></>}
        </div>
    );
}

export default Export;