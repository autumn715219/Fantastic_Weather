/* 鄉鎮市API */
const countryIds={
  "基隆市":"F-D0047-051",
  "臺北市":"F-D0047-063",
  "新北市":"F-D0047-071",
  "桃園市":"F-D0047-007",
  "新竹市":"F-D0047-055",
  "新竹縣":"F-D0047-011",
  "苗栗縣":"F-D0047-015",
  "臺中市":"F-D0047-075",
  "彰化縣":"F-D0047-019",
  "南投縣":"F-D0047-023",
  "雲林縣":"F-D0047-027",
  "嘉義縣":"F-D0047-031",
  "嘉義市":"F-D0047-059",
  "高雄市":"F-D0047-067",
  "臺南市":"F-D0047-079",  
  "屏東縣":"F-D0047-035",
  "宜蘭縣":"F-D0047-003",
  "花蓮縣":"F-D0047-043",
  "臺東縣":"F-D0047-039",
  "澎湖縣":"F-D0047-047",
  "連江縣":"F-D0047-083",
  "金門縣":"F-D0047-087",
}

//下拉選單功能
function initCountry(){
  let countrySelect=document.getElementById("country-list");
  let inner="";
  for (let key in countryIds) {
    if(key=="臺北市"){
      inner+=`<option value="${countryIds[key]}" selected>${key}</option>`;
    }else{
      inner+=`<option value="${countryIds[key]}">${key}</option>`;
    }
  }
  //初始化
  countrySelect.innerHTML=inner;
  countrySelect.addEventListener('change', fetchData(this.value));
  fetchData(countryIds["臺北市"]);
}
initCountry();


const loactionsWrp = document.querySelector("#loactions");
const sevendaysWrp = document.getElementById("weekForecast");


async function fetchData(countryIds) {
  let url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-093?Authorization=${CWB_API_KEY}&locationId=${countryIds}`;
  try {
    let response = await fetch(url);
    let data = await response.json();
    if (response.status !== 200) {
      console.log(' API 出了點問題. Status Code: ' + response.status );
      return;
    }else{
      //內容
      loactionsWrp.innerHTML="";
      let locationArry = data.records.locations[0].location;
      locationArry.forEach((item,i) => renderContent(item,i));
      locationCardLoad(locationArry);
    }
  }    
  catch (err) {
    //console.log({ "error": err });
  }

}

//組出左側選單內容
const renderContent = (item,i) => {
  //console.log( i + item.locationName)
  let locationName = item.locationName; //地區
  let locationWx = item.weatherElement[6].time[0].elementValue[0].value; //天氣現象
  let locationT = item.weatherElement[1].time[0].elementValue[0].value; //平均溫度
  let locationMinT = item.weatherElement[8].time[0].elementValue[0].value; //最低溫度
  let locationMaxT = item.weatherElement[12].time[0].elementValue[0].value; //最高溫度
  const htmlStr = `<div class="blockSB__container" data-index="${i}">
                      <div class="blockSB__area areaTitleSB">${locationName}</div>
                      <div class="blockSB__condition contentSB">${locationWx}</div>
                      <div class="blockSB__temp tempTitleSB">${locationT}°</div>
                      <div class="blockSB__subTemp contentSB">
                          最低${locationMinT}° 最高${locationMaxT}°
                      </div>
                  </div>
                  <hr class="blockSB__hr">`

  loactionsWrp.insertAdjacentHTML("beforeend",htmlStr);
};

//組出7天天氣預測
const renderSevenDaate = (item,i,min,max) => {
  if( i<=6 ){
  //console.log (item,i,min,max)
  let range = max - min;
  let left = (item.minT - min)/range * 100 ;
  let leftValue = left.toFixed(2)+'%';
  let right = (max - item.maxT)/range * 100 ;
  let rightValue = right.toFixed(2) +'%';
  let iconImg = iconSwitch(item.wx);
  let isFirstItemPoint = isFirstItem(i);
  let averageT = ((item.maxT - min)-((item.maxT-item.minT)*.7))/range * 100;
  //console.log(averageT)
  let averageTValue = averageT.toFixed(2)+'%';
  function isFirstItem(i){ 
    //console.log(i)
    if(i===0){ return 'block' }else{ return 'none' } 
  }

  const htmlStr = `<div class="dayInfo">
                      <div class="dayInfo__container">
                        <div class="dayInfo__date">${item.week}</div>
                        <div class="dayInfo__iconbox">
                          <img
                            class="dayInfo__icon"
                            src="./image/icon/${iconImg}.png"
                          />
                        </div>
                        <div class="tempBox">
                          <div class="tempBox__low">${item.minT}</div>
                          <div class="tempBox__barBG">
                            <div class="tempBox__bar" style="clip-path:inset(0 ${rightValue} 0 ${leftValue} round 5px);"></div>
                            <div class="tempBox__point" style="display:${isFirstItemPoint};left:${averageTValue};"></div>

                          </div>
                          <div class="tempBox__high">${item.maxT}</div>
                        </div>
                      </div>
                    </div>`

                    sevendaysWrp.insertAdjacentHTML("beforeend",htmlStr);
  }
};

//左側選單點擊事件
function locationCardLoad(arry){
  let locationCards = document.getElementsByClassName('blockSB__container');
  for (let i = 0; i < locationCards.length; i++) {
      let self = locationCards[i];
      self.addEventListener('click', function (event) {  
        let index = this.getAttribute('data-index'); //html-->data-modal="modal2"
        for (let j=0; j <locationCards.length; j++){
          if(locationCards[j].classList.contains('active')){
            locationCards[j].classList.remove('active');
          }
        }
        this.classList.add("active");
        sevendaysWrp.innerHTML="";
        renderCard(arry[index]);
        //console.log(arry[index])
      }, false);
  }

}

//組出右側內容
function renderCard(item){
  //console.log(item.weatherElement)
  // headline__area
  let locationName = item.locationName; //地區
  let locationWx = item.weatherElement[6].time[0].elementValue[0].value; //天氣現象
  let locationWxtext = Number(item.weatherElement[6].time[0].elementValue[1].value); //天氣現象碼
  let now =new Date();
  let time = Number(now.getHours());
  let background = getImgBackground(time,locationWxtext);
  let locationT = item.weatherElement[1].time[0].elementValue[0].value; //平均溫度
  let locationMinT = item.weatherElement[8].time[0].elementValue[0].value; //最低溫度
  let locationMaxT = item.weatherElement[12].time[0].elementValue[0].value; //最高溫度

  let areaTitle = document.querySelector('.headline__area.areaTitle');
  let tempTitle = document.querySelector('.headline__temp.tempTitle');
  let condition = document.querySelector('.headline__condition.content');
  let subtemp = document.querySelector('.headline__subtemp.content');
  let html = document.querySelector('html');

  html.style.backgroundImage = `url(image/background/${background})`
  areaTitle.textContent = locationName;
  tempTitle.textContent = locationT +'°';
  condition.textContent = locationWx;
  subtemp.textContent = `最低${locationMinT}° 最高${locationMaxT}°`;

  // UV
  let locationUVINum = item.weatherElement[9].time[0].elementValue[0].value; //紫外線指數字
  let locationUVIText = item.weatherElement[9].time[0].elementValue[1].value; //紫外線量級
  let locationUVIText_Next6hr = item.weatherElement[9].time[1].elementValue[1].value; //紫外線量級

  let UVNum = document.querySelector('.UV__num.digitMedium');
  let UVLevel = document.querySelector('.UV__level');
  let UVPoint = document.querySelector('.UVBox__point');
  let UVInfo = document.querySelector('.UV__info.info');
  UVNum.textContent = locationUVINum;
  UVLevel.textContent = locationUVIText;
  UVPoint.style.left = calcUVISwitch(locationUVINum);
  UVInfo.textContent = '未來六小時皆為'+locationUVIText_Next6hr;
  
  // humidity
  let locationRHNum = Number(item.weatherElement[2].time[0].elementValue[0].value); //濕度
  let locationTd = item.weatherElement[14].time[1].elementValue[0].value; //露點

  let humidityNum = document.querySelector('.humidity__num.digitMedium');
  let humidityInfo = document.querySelector('.humidity__info.info');
  humidityNum.textContent = locationRHNum+'%';
  humidityInfo.textContent = '平均露點溫度 '+locationTd+'°';

  // apparentTemp
  let locationMaxAT = Number(item.weatherElement[5].time[0].elementValue[0].value); //最高體感溫度
  let locationMinAT = Number(item.weatherElement[11].time[0].elementValue[0].value); //最低體感溫度
  let locationATText = item.weatherElement[7].time[0].elementValue[1].value; //最低體感溫度

  let locationAveryAT = (locationMaxAT+locationMinAT)/2;
  let apparentTemp = document.querySelector('.apparentTemp__num.digitMedium');
  let apparentTempInfo = document.querySelector('.apparentTemp__info.info');
  apparentTemp.textContent = locationAveryAT +'°';
  apparentTempInfo.textContent = locationATText;

  // conclusion
  let locationDesc = item.weatherElement[10].time[1].elementValue[0].value; //露點
  let conclusionInfo = document.querySelector('.conclusion__info.info');
  conclusionInfo.textContent = locationDesc;

  // 7days forecast
  let locationMinT_List = item.weatherElement[8].time; //最低溫度
  let locationMaxT_List = item.weatherElement[12].time; //最高溫度
  let locationWxText = item.weatherElement[6].time;
  sevenDaysWeather(locationMinT_List,locationMaxT_List,locationWxText);
}

function calcUVISwitch(UVI){
  switch (UVI) {
    default:  return '100%';
    case '1': return '0%';
    case '2': return '10%';
    case '3': return '20%';
    case '4': return '30%';
    case '5': return '40%';
    case '6': return '50%';
    case '7': return '60%';
    case '8': return '70%';
    case '9': return  '80%';
    case '10':  return  '90%';
    case '11':  return '100%';
  }
}

function iconSwitch(code){
  let myCode=Number(code)
  let sun = [1];
  let cloud = [4,5,6,7,24,25,26,27,28];
  let rain = [8,9,10,11,13,14,17,20,29,31,32,38,39];
  let cloudy = [2,3];
  let sun_rain=[12,16,19,30];
  let thunderstorm =[15,18,21,22,33,34,35,36,41];
  if(sun.includes(myCode)){ return "sun";}
  if(cloud.includes(myCode)){ return "cloud";}
  if(rain.includes(myCode)){ return "rain";}
  if(cloudy.includes(myCode)){ return "cloudy";}
  if(sun_rain.includes(myCode)){ return "sun_rain";}
}

function getImgBackground(time,code){
  let sun = [1,24];
  let cloud = [2,3,4,25,26,27,31,36,37];
  let cloudy = [5,6,7,28,32];
  let dark_cloudy = [8,19];
  let small_rain=[9,10,11,12,13,14,29,30,38,39,41];
  let heavy_rain=[15,16,17];
  let thunderstorm =[18,21,22,33,34,35];
  //let snow =[23,42];
  if(sun.includes(code)){
    if( 0<=time && time<5){ return 'night.jpg' }
    if( 5<=time && time<9){ return 'early_morning_sun.jpg' }
    if( 9<=time && time<16){ return 'morning_sun.jpg' }
    if( 16<=time && time<19){ return 'evening_sun.jpg' }
    if( 19<=time && time<24){ return 'night.jpg' }
  }
  if(cloud.includes(code)){
    if( 0<=time && time<5){ console.log('0~5'); return 'night_partly_cloudy.jpg' };
    if( 5<=time && time<9){ console.log('5~9'); return 'early_morning_sun.jpg' };
    if( 9<=time && time<16){ console.log('9~16'); return 'morning_partly_cloudy.jpg' };
    if( 16<=time && time<19){ console.log('16~19'); return 'evening_sun.jpg' };
    if( 19<=time && time<24){ console.log('19~24'); return 'night_partly_cloudy.jpg' };

  }
  if(cloudy.includes(code)){
    if( 5<=time && time<19){ return 'morning_cloudy.jpg' }
    if( 19<=time && time<24){ return 'night_cloudy.jpg' }
    if( 0<=time && time<5){ return 'night_cloudy.jpg' }

  }
  if(dark_cloudy.includes(code)){
    if( 0<=time && time<5){ return 'night_cloudy.jpg' }
    if( 5<=time && time<19){ return 'morining_dark_cloudy.jpg' }
    if( 19<=time && time<24){ return 'night_cloudy.jpg' }
  }
  if(small_rain.includes(code)){
    if( 0<=time && time<5){ return 'night_light_rain.jpg' }
    if( 5<=time && time<19){ return 'morning_light_rain.jpg' }
    if( 19<=time && time<24){ return 'night_light_rain.jpg' }
  }
  if(heavy_rain.includes(code)){
    return 'heavy_rain.jpg'
  }
  if(thunderstorm.includes(code)){
    return 'thunder.jpg'
  }
}
function sevenDaysWeather(minT,maxT,Wx){
  // console.log(minT)
  let minArry =[];
  let maxArry =[];
  let dateArry =[];
  let dataArry =[];
  for (var i = 0; i < 14; i++) {
    let startTime = minT[i].startTime;
    let date = startTime.split(/\s+/);
    let dateValue = date[0];
    let data_maxT = Number(maxT[i].elementValue[0].value);
    let data_minT = Number(minT[i].elementValue[0].value);
    let data_wx = Wx[i].elementValue[1].value;
    if( !dateArry.includes(dateValue) ){
      //第一筆資料
      let data = { 
        'date':dateValue,
        'week':getWeekName(dateValue),
        'minT':data_minT,
        'maxT':data_maxT,
        'wx':data_wx
      };
      dateArry.push(dateValue);
      dataArry.push(data);
    }
    maxArry.push(Number(maxT[i].elementValue[0].value));
    minArry.push(Number(minT[i].elementValue[0].value));
  }

  let min = Math.min.apply(null, minArry);
  let max = Math.max.apply(null, maxArry);

  dataArry.forEach((item,i) => renderSevenDaate(item,i,min,max));
}


function getWeekName(date){
  let now =new Date().getDate();
  let weekname=new Date(date);
  let mydate=weekname.getDate();
  let n = weekname.getDay();
  if (now === mydate){ n=8 };
  switch (n) {
    default:  return '今天';
    case 0: return '週日';
    case 1: return '週一';
    case 2: return '週二';
    case 3: return '週三';
    case 4: return '週四';
    case 5: return '週五';
    case 6: return '週六';
    case 8: return '今天';
  }
}
