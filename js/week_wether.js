//監聽是否有select change
select=document.getElementById("country-list")
select.addEventListener("change", function(){
    getData(select.options[select.selectedIndex].text)
    getAvgT(select.options[select.selectedIndex].text)
})

getData('臺北市');//fetch初始台北市資料
getAvgT("臺北市");//fetch初始台北市資料

async function getData(countryName){
    const url=`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-2362029B-8E57-4537-AD95-9B5CD8AB3D8D&locationName=${countryName}&lelmentName=UVI&elementName=RH&elementName=UVI&elementName=MaxAT&elementName=MinAT&elementName=WeatherDescription&elementName=Wx&elementName=T&elementName=Td`
    await fetch(url).then(function(res){
        return res.json()
    }).then(function(data){
        result = data.records.locations[0].location[0].weatherElement
        let maxATWeek,minATWeek;
        for (let j of result){
            if ( j.elementName == 'RH') {//平均相對濕度
                const humidityNum  = document.querySelector('.humidity__num');
                humidityNum.innerText = `${j.time[0].elementValue[0].value}%`
            } 
            else if ( j.elementName == 'MinAT') {//最低體感溫度
                const MinAT=j.time
                const temBoxLow= document.querySelectorAll(".tempBox__low")
                let k = 0;

                if (MinAT.length == 15 ){
                    temBoxLow[0].innerHTML = MinAT[0].elementValue[0].value + "°";
                    minATWeek = MinAT[0].elementValue[0].value;
                    k = 1;
                    MinAT.shift();
                }
            
                for(let i=0;i<MinAT.length;i++){
                    if (i%2==0) {
                        temBoxLow[k].innerHTML = MinAT[i].elementValue[0].value + "°"
                    } else {
                        if (temBoxLow[k].innerHTML > MinAT[i].elementValue[0].value) temBoxLow[k].innerHTML = MinAT[i].elementValue[0].value + "°"
                        k++;     
                    }
         
                    if (minATWeek >= MinAT[i].elementValue[0].value) minATWeek = MinAT[i].elementValue[0].value
                }
            } else if ( j.elementName == 'MaxAT') {//最高體感溫度
                const MaxAT = j.time
                const temBoxHigh = document.querySelectorAll(".tempBox__high")
                let k=0;
                if (MaxAT.length == 15 ){
                    temBoxHigh[0].innerHTML = MaxAT[0].elementValue[0].value + "°";
                    maxATWeek = MaxAT[0].elementValue[0].value;
                    k = 1;
                    MaxAT.shift();
                }
            
                for(let i=0;i<MaxAT.length;i++){
                    if (i%2==0) {
                        temBoxHigh[k].innerHTML = MaxAT[i].elementValue[0].value + "°"
                    } else {
                        if (temBoxHigh[k].innerHTML < MaxAT[i].elementValue[0].value) temBoxHigh[k].innerHTML = MaxAT[i].elementValue[0].value + "°"
                        k++;     
                    }

                    if (maxATWeek < MaxAT[i].elementValue[0].value) maxATWeek = MaxAT[i].elementValue[0].value
                    
                }
            } else if ( j.elementName == 'Wx') { //天氣氣象
                let weekWeather=[]
                const Wx=j.time
                for (let i=0;i<Wx.length;i++){
                    weekWeather.push(Wx[i].elementValue[1].value)
                }
                let dayInfo__icon= document.querySelectorAll(".dayInfo__icon")//根據回傳值看要使用哪張icon
                for(let k=0;k<dayInfo__icon.length;k++){
                    if (weekWeather[k]==01){
                        dayInfo__icon[k].src="./image/icon/sun.png"
                    }else if (weekWeather[k]==02||weekWeather[k]==03){
                        dayInfo__icon[k].src="./image/icon/cloudy.png"
                    }else if (weekWeather[k]==04||weekWeather[k]==05||weekWeather[k]==06||weekWeather[k]==07||weekWeather[k]==24||weekWeather[k]==25||weekWeather[k]==26||weekWeather[k]==07||weekWeather[k]==08){
                        dayInfo__icon[k].src="./image/icon/cloud.png"
                    }else if (weekWeather[k]==08||weekWeather[k]==09||weekWeather[k]==10||weekWeather[k]==11||weekWeather[k]==13||weekWeather[k]==14||weekWeather[k]==20||weekWeather[k]==29||weekWeather[k]==31||weekWeather[k]==32||weekWeather[k]==38||weekWeather[k]==39){
                        dayInfo__icon[k].src="./image/icon/rain.png"
                    }else if (weekWeather[k]==12||weekWeather[k]==16||weekWeather[k]==19||weekWeather[k]==30){
                        dayInfo__icon[k].src="./image/icon/sun_rain.png"
                    }else if (weekWeather[k]==15||weekWeather[k]==18||weekWeather[k]==21||weekWeather[k]==22||weekWeather[k]==33||weekWeather[k]==34||weekWeather[k]==35||weekWeather[k]==36||weekWeather[k]==41){
                        dayInfo__icon[k].src="./image/icon/thunderstorm.png"
                    }
                }
            } else if ( j.elementName == 'WeatherDescription') {//天氣綜合描述
                const WeatherDescription=j.time
                let conclusion__info=document.querySelector(".conclusion__info")
                conclusion__info.innerText=`${WeatherDescription[0].elementValue[0].value}`
            } else if ( j.elementName == 'UVI') {//紫外線指數
                let UV__num=document.querySelector(".UV__num");
                const UVI=j.time[0].elementValue[0].value;
                UV__num.innerText=UVI;
                let UVPoint=document.querySelector(".UVBox__point");
                UVIPointPersent=String(Number(UVI)*10)+"%"
                UVPoint.style.left=UVIPointPersent;
                const UVlevel =j.time[0].elementValue[1].value
                document.querySelector(".UV__level").innerText=UVlevel
                let nextUVI =j.time[1].elementValue[0].value;
                const uvInfo = document.querySelector(".UV__info")
                if (nextUVI<=2){
                    uvInfo.innerText="接下來的時間皆為低量級"
                }else if(nextUVI<=5){
                    uvInfo.innerText="接下來的時間皆為中量級"
                }else if(nextUVI<=7){
                    uvInfo.innerText="接下來的時間皆為高量級"
                }else if(nextUVI<=10){
                    uvInfo.innerText="接下來的時間皆為過量級"
                }else if(nextUVI>10){
                    uvInfo.innerText="接下來的時間皆為危險級"
                }
            } else if ( j.elementName == 'Td') {//平均露點溫度
                const Td=j.time
                let humidity__info=document.querySelector(".humidity__info")
                humidity__info.innerText=`平均露點溫度為${Td[0].elementValue[0].value}`
            }
            
        }
        //變更週
        let now = new Date()
        const day1 =now.getDay();
        let week = ["週日","週一","週二","週三","週四","週五","週六"];
        const dayInfoDate = document.querySelectorAll(".dayInfo__date");
        let j=1;
        for (let i=day1+1; i< week.length; i++){
            dayInfoDate[j].textContent = week[i];
            j++;
        }
        for (let i=0; i<day1; i++){
            dayInfoDate[j].textContent = week[i];
            j++;
        }
           
    })
}
//取得體感溫度
async function getAvgT(countryName){
    const url=`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=CWB-2362029B-8E57-4537-AD95-9B5CD8AB3D8D&locationName=${countryName}`
    fetch(url).then(function(res){
        return res.json()
    }).then(function(data){
        //取得體感溫度
        const avgT=data.records.locations[0].location[0].weatherElement[2].time[0].elementValue[0].value; 
        const apparentTemp__num =document.querySelector(".apparentTemp__num");
        apparentTemp__num.innerText=`${avgT}°`;
        //取得舒適度指數
        const comfortable=data.records.locations[0].location[0].weatherElement[5].time[0].elementValue[1].value;
        const apparentTemp__info=document.querySelector(".apparentTemp__info")
        apparentTemp__info.innerText=comfortable
    })
}
