import react from 'react';
import {useEffect, useCallback, useState} from "react";
import "../style/CustomMenu.css";

const CustomMenu = (props) => {
    //this class is created with reference to this article: https://blog.logrocket.com/creating-context-menu-react/
    const controlContextDirection = useCallback(() => {
        const w = document.documentElement.clientWidth;
        
        const h = document.documentElement.clientHeight;
        console.log(w, h)
        console.log(props.anchorPoint.x, props.anchorPoint.y)
        //const cm = document.getElementById("contextMenu");
        const cmw = 100; //parseInt(cm.style.width);
        const cmh = 80; //parseInt(cm.style.height);
        if(props.anchorPoint.x+cmw > w && props.anchorPoint.y+cmh < h){
            console.log("more w, less h")
            return {top: props.anchorPoint.x-cmw, left: props.anchorPoint.y}
        }
        else if (props.anchorPoint.x+cmw < w && props.anchorPoint.y+cmh > h){
            console.log("less w, more h")
            return {top: props.anchorPoint.x, left: props.anchorPoint.y-cmh}
        }
        else if (props.anchorPoint.x+cmw > w && props.anchorPoint.y+cmh > h){
            console.log("more w, more h")
            return {top: props.anchorPoint.x-cmw, left: props.anchorPoint.y-cmh}
        }
        else{
            console.log("default")
            return {top: props.anchorPoint.x, left: props.anchorPoint.y};
        }
    });

    if(props.showMenu){
        return(
            <ul id='contextMenu' style={controlContextDirection()}>
                <li className="cmi" key="copy" onClick={() => props.setOption("copy")}>Copy</li>
                <li className="cmi" key="cut" onClick={() => props.setOption("cut")}>Cut</li>
                <li className="cmi" key="paste" onClick={() => props.setOption("paste")}>Paste</li>
                <li className="cmi" key="delete" onClick={() => props.setOption("delete")}>Delete</li>
                <li className="cmi" key="isilence" onClick={() => props.setOption("isilence")}>Insert silence</li>
                <li className="last-item" key="rsilence" onClick={() => props.setOption("rsilence")}>Silence region</li>
            </ul>
        );
    }

    return(
        <></>
    );
}

export default CustomMenu