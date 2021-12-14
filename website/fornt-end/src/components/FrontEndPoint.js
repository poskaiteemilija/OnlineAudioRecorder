import React, { useCallback } from "react";
import axios from "axios";
import { retrieveData } from "./Playback";
import Localbase from "localbase";



const FrontEndPoint = () =>{
    const testPut = useCallback( async () => {
        let db = new Localbase('db');
        const data = await retrieveData(db);
        console.log(data[0]);
        const file = new File([data[0].blob], "r.webm", {type: "audio/webm"});
        console.log(file);
        let formData = new FormData();
        formData.append("session", localStorage.getItem("sessionID"));
        formData.append("audio_file", file);

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/upload/',
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {});
    });

    const testGet = useCallback(() => {
        console.log("what")
        const ses = localStorage.getItem('sessionID');
        let form = new FormData();
        form.append('session', ses);
        form.append('format', 'mp3');
        form.append('filename', 'test');
        axios({
            method: 'post',
            url: 'http://localhost:8000/api/export',
            data: form,
        })
        .then(resp =>{
            console.log(resp.data);
            //let file = new File(resp.data, "ok.mp3", {type: "audio/mp3"});
            //console.log("aha");
            //console.log(file);
            //const url = URL.createObjectURL(file);
            //console.log("what", url);
            //const a = document.createElement("a");
            //let df = document.getElementById("download-file");
            //
            //a.href = url;
            //a.download = "audio" + '.mp3';
            //df.appendChild(a);
//
            //a.click();
//
            //window.URL.revokeObjectURL(url);
            //df.removeChild(a);

        })
        .catch(error => {})
    });


    return(
        <div>
            <button onClick= {testGet}>testGet</button>
            <button onClick = {testPut}>testPut</button>
        </div>
    );
}

export default FrontEndPoint;