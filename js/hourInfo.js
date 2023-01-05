let hourInfoRecords=null;
const iconData={
    01: "sun",
    02: "cloudy",
    03: "cloudy",
    04: "cloud",
    05: "cloud",
    06: "cloud",
    07: "cloud",
    24: "cloud",
    25: "cloud",
    26: "cloud",
    27: "cloud",
    28: "cloud",
    08: "rain",
    09: "rain",
    10: "rain",
    11: "rain",
    13: "rain",
    14: "rain",
    17: "rain",
    20: "rain",
    29: "rain",
    31: "rain",
    32: "rain",
    38: "rain",
    39: "rain",
    12: "sun_rain",
    16: "sun_rain",
    19: "sun_rain",
    30: "sun_rain",
    15: "thunderstorm",
    18: "thunderstorm",
    21: "thunderstorm",
    22: "thunderstorm",
    33: "thunderstorm",
    34: "thunderstorm",
    35: "thunderstorm",
    36: "thunderstorm",
    41: "thunderstorm"
};

const countyIds={
    "F-D0047-003":"宜蘭縣",
    "F-D0047-007":"桃園市",
    "F-D0047-011":"新竹縣",
    "F-D0047-015":"苗栗縣",
    "F-D0047-019":"彰化縣",
    "F-D0047-023":"南投縣",
    "F-D0047-027":"雲林縣",
    "F-D0047-031":"嘉義縣",
    "F-D0047-035":"屏東縣",
    "F-D0047-039":"臺東縣",
    "F-D0047-043":"花蓮縣",
    "F-D0047-047":"澎湖縣",
    "F-D0047-051":"基隆市",
    "F-D0047-055":"新竹市",
    "F-D0047-059":"嘉義市",
    "F-D0047-063":"臺北市",
    "F-D0047-067":"高雄市",
    "F-D0047-071":"新北市",
    "F-D0047-075":"臺中市",
    "F-D0047-079":"臺南市",
    "F-D0047-083":"連江縣",
    "F-D0047-087":"金門縣",
}

  const hourInfo=document.querySelector(".hourInfo");
  const countyId=document.getElementById("country-list");
  countyId.addEventListener("change", getValue);
  
  function getValue(event){
      const selectedValue=event.target.value;
      locationName=countyIds[selectedValue];
      hourInfo.innerHTML="";
      fetchHourInfo(locationName);
  }

function fetchHourInfo(locationName){
    fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=${CWB_API_KEY}&locationName=${locationName}`).then((response)=>{
	    return response.json();
    }).then((data)=>{
        hourInfoRecords=data.records;
        renderHourForecast();
    });
}
 
function renderHourForecast(){
    const hourInfo=document.querySelector(".hourInfo");

    const time=new Date();
    let getHour=time.getHours(); 

    //天氣現象>圖
    const weatherPattern=hourInfoRecords.locations[0].location[0].weatherElement[1].time[0].elementValue[1].value;
    const weatherPatternValue=Number(weatherPattern);

    //溫度
    const T=hourInfoRecords.locations[0].location[0].weatherElement[3].time[0].elementValue[0].value;

    //降雨機率
    // const rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[0].elementValue[0].value;

    //container
    const hourInfoContainer=document.createElement("div");
          hourInfoContainer.className="hourInfo__container";
    const TTimeDiv=document.createElement("div");
          TTimeDiv.className="hourInfo__time infoBold";
    const iconDiv=document.createElement("div");
          iconDiv.className="hourInfo__iconBox";
    const iconImg=document.createElement("img");
          iconImg.className="hourInfo__icon";
    // const rain6hDDiv=document.createElement("div");
    const TDiv=document.createElement("div");
          TDiv.className="hourInfo__temp infoBold";

    //div內容
    TTimeDiv.innerText="現在";
    const icon=iconData[weatherPatternValue];
    if (getHour<6 && icon==="sun_rain"){
        iconImg.src="./image/icon/moon_rain.png";
    }else if (getHour>=17 && getHour<=24 && icon==="sun_rain"){
        iconImg.src="./image/icon/moon_rain.png";
    }else if(getHour<6 && icon==="cloud"){
        iconImg.src="./image/icon/moon_cloud.png";
    }else if(getHour>=17 && getHour<=24 && icon==="cloud"){
        iconImg.src="./image/icon/moon_cloud.png";
    }else{
        iconImg.src=`./image/icon/${icon}.png`;
    }
    // rain6hDDiv.innerText=rain6h+"%";
    TDiv.innerText=T+"°";

    hourInfoContainer.appendChild(TTimeDiv);
    iconDiv.appendChild(iconImg);
    hourInfoContainer.appendChild(iconDiv);
    // hourInfoContainer.appendChild(rain6hDDiv);
    hourInfoContainer.appendChild(TDiv);

    hourInfo.appendChild(hourInfoContainer);

    for (let i=1,j=3,k=1;i<15;i++,j+=3,k++){
        // 時間判斷
        let hour;
        let TTime;
        if (getHour<12){
            hour=getHour+j;          
            if (hour>48){
                hour=getHour+j-48;
                TTime="上午"+hour+"時";
            }else if (hour>36){
                hour=getHour+j-36;
                TTime="下午"+hour+"時";
            }
            else if (hour>24){
                hour=getHour+j-24;
                TTime="上午"+hour+"時";
            }else if (hour>12){
                hour=getHour+j-12;
                TTime="下午"+hour+"時";
            }else{
                TTime="上午"+hour+"時";
            }
        }else{
            hour=getHour+j-12;

            if (hour>48){
                hour=getHour+j-60;
                TTime="下午"+hour+"時";
            }else if (hour>36){
                hour=getHour+j-48;
                TTime="上午"+hour+"時";
            }else if (hour>24){
                hour=getHour+j-36;
                TTime="下午"+hour+"時";
            }else if (hour>12){
                hour=getHour+j-24;
                TTime="上午"+hour+"時";
            }else{
                TTime="下午"+hour+"時";
            }
        }

        //天氣現象>圖
        const weatherPattern=hourInfoRecords.locations[0].location[0].weatherElement[1].time[i].elementValue[1].value;
        const weatherPatternValue=Number(weatherPattern);

        //溫度
        const T=hourInfoRecords.locations[0].location[0].weatherElement[3].time[i].elementValue[0].value;

        //降雨機率
        // let k1=k;
        // let rain6h;
        // if (k1<2){
        //     rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[0].elementValue[0].value;
        // }else if (1<k1 && k1<4){
        //     rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[1].elementValue[0].value;
        // }else if (3<k1 && k1<6){
        //     rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[2].elementValue[0].value;
        // }else if (5<k1 && k1<8){
        //     rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[3].elementValue[0].value;
        // }else if (7<k1 && k1<10){
        //     rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[4].elementValue[0].value;
        // }else if (9<k1 && k1<12){
        //     rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[5].elementValue[0].value;
        // }else{
        //     rain6h=hourInfoRecords.locations[0].location[0].weatherElement[7].time[6].elementValue[0].value;
        // }

        //container
        const hourInfoContainer=document.createElement("div");
              hourInfoContainer.className="hourInfo__container";
        const TTimeDiv=document.createElement("div");
              TTimeDiv.className="hourInfo__time infoBold";
        const iconDiv=document.createElement("div");
              iconDiv.className="hourInfo__iconBox";
        const iconImg=document.createElement("img");
              iconImg.className="hourInfo__icon";
        // const rain6hDDiv=document.createElement("div");
        const TDiv=document.createElement("div");
              TDiv.className="hourInfo__temp infoBold";

        //div內容
        TTimeDiv.innerText=TTime;
        const icon=iconData[weatherPatternValue];
        if (getHour<6 && icon==="sun_rain"){
            iconImg.src="./image/icon/moon_rain.png";
        }else if (getHour>=17 && getHour<=24 && icon==="sun_rain"){
            iconImg.src="./image/icon/moon_rain.png";
        }else if(getHour<6 && icon==="cloud"){
            iconImg.src="./image/icon/moon_cloud.png";
        }else if(getHour>=17 && getHour<=24 && icon==="cloud"){
            iconImg.src="./image/icon/moon_cloud.png";
        }else{
            iconImg.src=`./image/icon/${icon}.png`;
        }
        // rain6hDDiv.innerText=rain6h+"%";
        TDiv.innerText=T+"°";

        hourInfoContainer.appendChild(TTimeDiv);
        iconDiv.appendChild(iconImg);
        hourInfoContainer.appendChild(iconDiv);
        // TItem.appendChild(rain6hDDiv);
        hourInfoContainer.appendChild(TDiv);
    
        hourInfo.appendChild(hourInfoContainer);
    }
}

window.addEventListener("load", fetchHourInfo("臺北市"));


document.addEventListener('DOMContentLoaded', () => {
    const town=document.querySelector(".blockSB__container");
  
    console.log(town); // HTMLButtonElement object
  
    //  Works as expected
    town.addEventListener('click', () => {
      alert('You clicked the button');
    });
});