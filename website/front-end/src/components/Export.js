import React, { useCallback, useState, useEffect } from 'react';
import { retrieveData } from "./Playback";
import Localbase from 'localbase';
import ExportPopUp from "./ExportPopUp";

let Export = () => {
    let db = new Localbase('db');
    const [popUpState, setPopUpState] = useState(false);
    const [download, setDownload] = useState({
        resp: "",
        name: "",
        format: "",
        contentType: ""
    });
    const exportRec = useCallback(() =>{        
        setPopUpState(true);

    });

    useEffect(() => {
        if(download.resp !== "" && download.format !== "" && download.contentType !== ""){
            let tempName = "untitled"; 
            if(download.name !== ""){
                tempName = download.name;
            }
            //this code has been taken in part and modified from https://github.com/michalstocki/FlashWavRecorder/issues/43
            const a = document.createElement("a");
            let df = document.getElementById("download-file");

            console.log(download)
            const b = new Blob([download.resp], {type: download.contentType});
            const url = URL.createObjectURL(b);
            //let lol = new Audio();
            //lol.src = url;
            //lol.play();
            a.href = url;
            //console.log(a.href, download.url)
            a.download = tempName+"."+download.format;
            df.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(download);
            df.removeChild(a);
            setDownload({
                resp: "",
                name: "",
                format: "",
                contentType: ""
            });
        }
    }, [download]);

    return(
        <div id="download-file">
            <button className="function-button" onClick={ exportRec } title="Export" ><img src={require("../style/assets/download.png").default} alt="Export" /></button>
            { popUpState ? <ExportPopUp setPopUpState={ setPopUpState } setDownload={ setDownload } /> : <></>}
        </div>
    );
}

export default Export;