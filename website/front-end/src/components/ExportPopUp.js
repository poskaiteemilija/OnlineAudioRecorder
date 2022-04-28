import react, { useCallback, useEffect, useState } from "react";
import "../style/ExportPopUp.css";
import { putData } from "./FrontEndPoint";

const ExportPopUp = ({ setPopUpState, setDownload }) => {
    const [format, setFormat] = useState();

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        console.log(format);
        console.log(event.target.filename.value);
        putData(event.target.filename.value, format, setDownload);
        setPopUpState(false);
        setFormat();
    });

    const handleOnChange = useCallback((event) => {
        setFormat(event.target.value);
    });

    return(<div className="popup-background">
        <div className="export-popup" onBlur={window.focus()}>
            <div id="exit-container">
            <button id="exit" className="button" onClick={ () => {setPopUpState(false)} }><bold>X</bold></button>
            </div>
        
            <h2>EXPORT OPTIONS</h2>
            <form onSubmit={ handleSubmit } >
                <p><label for="filename">File name:</label></p>
                <input type="text" name="filename" id="filename"/>
                <p>File format:</p>
                <div className="rbs">
                    <input type="radio" name="format" value="mp3" id="mp3" onChange={handleOnChange} />
                    <label for="mp3">.mp3</label>
                </div>
                <div className="rbs">
                    <input type="radio" name="format" value="wav" id="wav"onChange={handleOnChange} />
                    <label for="wav">.wav</label>
                </div>
                <div className="rbs">
                    <input type="radio" name="format" value="webm" id="webm" onChange={handleOnChange} />
                    <label for="webm">.webm</label>
                </div>
                <div id="save-exit-buts">
                    <div>
                        <button className="button" onClick={ () => {setPopUpState(false)} }>Exit</button>
                        <input id="save" className="button" type="submit" value="Save"></input>
                    </div>
                   
                </div>
            </form>
        </div>
    </div>);
}


export default ExportPopUp;