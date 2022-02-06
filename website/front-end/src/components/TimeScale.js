import react, { useEffect } from 'react';
import "../style/TimeScale.css"

const TimeScale = (props) => {

    useEffect(()=>{
        let duration = props.dur;
        if(duration === 0){
            duration = 10000;
        }
        const topDiv = document.getElementById("time-scale");
        const numberDiv = document.getElementById("numbers");
        topDiv.innerHTML = "";
        numberDiv.innerHTML = "";
        let seconds = duration/1000;
        let itterations = 0;
        itterations = Math.floor(seconds);
        let fraction = duration - itterations*1000;
        let distance = topDiv.clientWidth - ((topDiv.clientWidth*fraction/duration));
        for(let i = 0; i<itterations; i++){
            const scale = document.createElement("div");
            if(i === 0){
                scale.style.borderLeft = "solid 1px white";
                const number = document.createElement("p");
                number.innerHTML = i;
                number.style.marginRight = distance/itterations-10+"px";
                number.style.marginLeft = -1+"px";
                numberDiv.appendChild(number);
                number.className = "num";
            }
            const number = document.createElement("p");
            number.innerHTML = i+1;
            scale.className = "scale";
            scale.style.width = distance/itterations+"px";
            number.className = "num";
            if(i<9){
                number.style.marginRight = distance/itterations-9+"px";
            }
            else{
                number.style.marginRight = distance/itterations-18+"px";
            }
            //numberDiv.appendChild(number);
            topDiv.appendChild(scale);
        }
        
    }, [props.dur]);

    return(
        <div>
            <div id="numbers"></div>
            <div id="time-scale"></div>    
        </div>
    );
}

export default TimeScale;