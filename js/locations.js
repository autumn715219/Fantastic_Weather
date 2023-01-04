/* 鄉鎮市API */
const countryIds={
  "宜蘭縣":"F-D0047-003",
  "桃園市":"F-D0047-007",
  "新竹縣":"F-D0047-011",
  "苗栗縣":"F-D0047-015",
  "彰化縣":"F-D0047-019",
  "南投縣":"F-D0047-023",
  "雲林縣":"F-D0047-027",
  "嘉義縣":"F-D0047-031",
  "屏東縣":"F-D0047-035",
  "臺東縣":"F-D0047-039",
  "花蓮縣":"F-D0047-043",
  "澎湖縣":"F-D0047-047",
  "基隆市":"F-D0047-051",
  "新竹市":"F-D0047-055",
  "嘉義市":"F-D0047-059",
  "臺北市":"F-D0047-063",
  "高雄市":"F-D0047-067",
  "新北市":"F-D0047-071",
  "臺中市":"F-D0047-075",
  "臺南市":"F-D0047-079",
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
      //console.log(countryIds);
      //console.log(data.records.locations[0].location);
    }
  }    
  catch (err) {
    console.log({ "error": err });
  }

}

//組出內容
const loactionsWrp = document.querySelector("#loactions");

const renderContent = (item,i) => {
  console.log( i + item.locationName)
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
                  </div>`
  
  loactionsWrp.insertAdjacentHTML("beforeend",htmlStr);
  
};