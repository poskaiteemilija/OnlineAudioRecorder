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
        if(download.resp !== "" && download.name !== ""){
            //this code has been taken in part and modified from https://github.com/michalstocki/FlashWavRecorder/issues/43
            const a = document.getElementById("the-download-link");
            let df = document.getElementById("download-file");

            console.log(download)
            const b = new Blob([download.resp], {type: download.f});
            const url = URL.createObjectURL(b);
            //let lol = new Audio();
            //lol.src = url;
            //lol.play();
            a.href = url;
            //console.log(a.href, download.url)
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
            <a id="the-download-link" href="" download></a>
            { popUpState ? <ExportPopUp setPopUpState={ setPopUpState } setDownload={ setDownload } /> : <></>}
        </div>
    );
}

export default Export;