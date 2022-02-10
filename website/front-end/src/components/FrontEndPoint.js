import React, { useCallback } from "react";
import axios from "axios";
import { retrieveData } from "./Playback";
import Localbase from "localbase";


export const putData = async (filename, format, setDownload) => {
    let db = new Localbase('db');
    const data = await retrieveData(db);
    console.log(data[0]);
    const ses = localStorage.getItem("sessionID");
    const file = new File([data[0].blob], ses+".webm", {type: "audio/webm"});
    console.log(file);
    let formData = new FormData();
    formData.append("session", localStorage.getItem("sessionID"));
    formData.append("audio_file", file);
    axios({
        method: 'post',
        url: 'http://localhost:8000/api/upload/',        //change to this url when running in docker http://127.0.0.1/api/upload/
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
    })
    .then(resp => {
        console.log(resp);
        getData(filename, format, setDownload);
    })
    .catch(error => {
        return error;
    });
}

export const getData = (filename, format, setDownload) => {
    //TO DO implement data check before sending it to the server
    const ses = localStorage.getItem('sessionID');
    let form = new FormData();
    form.append('session', ses);
    form.append('format', format);
    form.append('filename', filename);
    axios({
        method: 'post',
        url: 'http://localhost:8000/api/export',     //change to this url when running in docker http://127.0.0.1/api/export
        data: form,
    })
    .then(resp =>{
        console.log(resp.data);
        setDownload({
            url: resp.data,
            name: filename+"."+format
        });
    })
    .catch(error => {})
}
