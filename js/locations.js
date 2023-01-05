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
      //console.log(countryIds);
      //console.log(data.records.locations[0].location);
    }
  }    
  catch (err) {
    //console.log({ "error": err });
  }

}

//組出內容

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


const renderSevenDaate = (item,i,min,max) => {
  console.log (item,i,min,max)
  let range = max - min;
  let left = (item.minT - min)/range * 100 ;
  let leftValue = left.toFixed(2)+'%'

  let right = (max - item.maxT)/range * 100 ;
  let rightValue = right.toFixed(2) +'%';

  const htmlStr = `<div class="dayInfo">
                      <div class="dayInfo__container">
                        <div class="dayInfo__date">${item.week}</div>
                        <div class="dayInfo__iconbox">
                          <img
                            class="dayInfo__icon"
                            src="./image/icon/cloudy.png"
                          />
                        </div>
                        <div class="tempBox">
                          <div class="tempBox__low">${item.minT}</div>
                          <div class="tempBox__barBG">
                            <div class="tempBox__bar" style="clip-path:inset(0 ${rightValue} 0 ${leftValue} round 5px);">
                            </div>
                          </div>
                          <div class="tempBox__high">${item.maxT}</div>
                        </div>
                      </div>
                    </div>`

                    sevendaysWrp.insertAdjacentHTML("beforeend",htmlStr);
};

function locationCardLoad(arry){

  let locationCards = document.getElementsByClassName('blockSB__container');
  for (var i = 0; i < locationCards.length; i++) {
      let self = locationCards[i];
      self.addEventListener('click', function (event) {  
        let index = this.getAttribute('data-index'); //html-->data-modal="modal2"
        sevendaysWrp.innerHTML="";
        renderCard(arry[index]);
        //console.log(arry[index])
      }, false);
  }
}

function renderCard(item){
  console.log(item.weatherElement)
  // headline__area
  let locationName = item.locationName; //地區
  let locationWx = item.weatherElement[6].time[0].elementValue[0].value; //天氣現象
  let locationT = item.weatherElement[1].time[0].elementValue[0].value; //平均溫度
  let locationMinT = item.weatherElement[8].time[0].elementValue[0].value; //最低溫度
  let locationMaxT = item.weatherElement[12].time[0].elementValue[0].value; //最高溫度

  let areaTitle = document.querySelector('.headline__area.areaTitle');
  let tempTitle = document.querySelector('.headline__temp.tempTitle');
  let condition = document.querySelector('.headline__condition.content');
  let subtemp = document.querySelector('.headline__subtemp.content');
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
  let locationAveryAT = (locationMaxAT+locationMinAT)/2;
  let apparentTemp = document.querySelector('.apparentTemp__num.digitMedium');
  let apparentTempInfo = document.querySelector('.apparentTemp__info.info');
  apparentTemp.textContent = locationAveryAT +'°';
  apparentTempInfo.textContent = calcATInfo(locationT,locationAveryAT);

  // conclusion
  let locationDesc = item.weatherElement[10].time[1].elementValue[0].value; //露點
  let conclusionInfo = document.querySelector('.conclusion__info.info');
  conclusionInfo.textContent = locationDesc;

  // 7days forecast
  let locationMinT_List = item.weatherElement[8].time; //最低溫度
  let locationMaxT_List = item.weatherElement[12].time; //最高溫度
  sevenDaysWeather(locationMinT_List,locationMaxT_List);
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

function calcATInfo(T,AT){
  let Tem = Number(T); //實際溫度
  let ATem = Number(AT); //體感溫度
  if((Tem-ATem)>1.5){
    return "實際溫度較體感溫度略高。"
  }
  if((ATem-Tem)>1.5){
    return "實際溫度較體感溫度略低。"
  }else{
    return "與實際氣溫接近。"
  }
}

function sevenDaysWeather(minT,maxT){
  // console.log(minT)
  let minArry =[];
  let maxArry =[];
  let dateArry =[];
  let dataArry =[];
  let dataArry2 =[];
  for (var i = 0; i < minT.length; i++) {
    let startTime = minT[i].startTime;
    let date = startTime.split(/\s+/);
    let dateValue = date[0];
    let data_maxT = Number(maxT[i].elementValue[0].value);
    let data_minT = Number(minT[i].elementValue[0].value);
    if( !dateArry.includes(dateValue) ){
      //第一筆資料
      let data = { 
        'date':dateValue,
        'week':getWeekName(dateValue),
        'minT':data_minT,
        'maxT':data_maxT,
      }
      dateArry.push(dateValue)
      dataArry.push(data)
    }else{
      //第二筆資料
      //console.log(dateValue+'已在Arry')
      let data2 = { 
        'date':dateValue,
        'week':getWeekName(dateValue),
        'minT':data_minT,
        'maxT':data_maxT,
      }
      dataArry2.push(data2)
    }
    maxArry.push(Number(maxT[i].elementValue[0].value));
    minArry.push(Number(minT[i].elementValue[0].value));
  }

  let min = Math.min.apply(null, minArry);
  let max = Math.max.apply(null, maxArry);
  // console.log(min,max) 最大最小值
  //console.log(dataArry) //比較array1
  //console.log(dataArry2) //比較array2
  let rightTempArray = getRightTemp(dataArry,dataArry2);
  console.log(rightTempArray);
  rightTempArray.forEach((item,i) => renderSevenDaate(item,i,min,max));
}

function getRightTemp(array1,array2){
  for (let i = 0; i < array1.length; i++) {
      for( let j=0;  j < array2.length; j++){
          if(array1[i].date == array2[i].date){
              if(array1[i].minT > array2[j].minT){
                array1[i].minT = array2[j].minT
              }
              if(array1[i].maxT < array2[j].maxT){
                array1[i].maxT = array2[j].maxT
              }
          }
      }
  }
  return array1
}
function getWeekName(date){
  let now =new Date().getDate();
  let weekname=new Date(date);
  let mydate=weekname.getDate();
  let n = weekname.getDay();
  if (now === mydate){ n=8}
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
