import React, { useCallback, useState, useEffect } from 'react';
import { retrieveData } from "./Playback";
import Localbase from 'localbase';
import ExportPopUp from "./ExportPopUp";

let Export = () => {
    let db = new Localbase('db');
    const [popUpState, setPopUpState] = useState(false);
    const [download, setDownload] = useState({
        url: "",
        name: ""
    });
    const exportRec = useCallback(() =>{        
        setPopUpState(true);

    });

    useEffect(() => {
        if(download.url !== "" && download.name !== ""){
            console.log(download);
            //this code has been taken in part and modified from https://github.com/michalstocki/FlashWavRecorder/issues/43
            const a = document.createElement("a");
            let df = document.getElementById("download-file");
            
            a.href = download.url;
            a.download = download.name;
            df.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(download);
            df.removeChild(a);    
        }
    }, [download]);

    return(
        <div id="download-file">
            <button className="function-button" onClick={ exportRec }><img src={require("../style/assets/export.svg").default} alt="Export" /></button>
            { popUpState ? <ExportPopUp setPopUpState={ setPopUpState } setDownload={ setDownload } /> : <></>}
        </div>
    );
}

export default Export;