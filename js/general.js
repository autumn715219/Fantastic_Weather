const headline__area_areaTitle = document.querySelector(".headline__area");
const headline__temp_tempTitle = document.querySelector(".headline__temp");
const headline__condition_content = document.querySelector(".headline__condition");
const headline__subtemp_content = document.querySelector(".headline__subtemp");

const countryNumber = {
  "宜蘭縣": "F-D0047-003",
  "桃園市": "F-D0047-007",
  "新竹縣": "F-D0047-011",
  "苗栗縣": "F-D0047-015",
  "彰化縣": "F-D0047-019",
  "南投縣": "F-D0047-023",
  "雲林縣": "F-D0047-027",
  "嘉義縣": "F-D0047-031",
  "屏東縣": "F-D0047-035",
  "臺東縣": "F-D0047-039",
  "花蓮縣": "F-D0047-043",
  "澎湖縣": "F-D0047-047",
  "基隆市": "F-D0047-051",
  "新竹市": "F-D0047-055",
  "嘉義市": "F-D0047-059",
  "臺北市": "F-D0047-063",
  "高雄市": "F-D0047-067",
  "新北市": "F-D0047-071",
  "臺中市": "F-D0047-075",
  "臺南市": "F-D0047-079",
  "連江縣": "F-D0047-083",
  "金門縣": "F-D0047-087",
};

async function fetchWeatherApi() {
  let data = await fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${CWB_API_KEY}`
  );
  let response = await data.json();
  return response;
}

fetchWeatherApi().then(function (data) {
  let nowWeatherPhenomena = [];
  let nowMinTemperature = [];
  let nowMaxTemperature = [];

  for (let i = 0; i < data.records.location.length; i++) {
    let weatherPhenomena = [];
    let minTemperature = [];
    let maxTemperature = [];

    // WX，MinT，MaxT
    weatherPhenomena.push(data.records.location[i].weatherElement[0].time[0].parameter.parameterName);
    minTemperature.push(data.records.location[i].weatherElement[2].time[0].parameter.parameterName);
    maxTemperature.push(data.records.location[i].weatherElement[4].time[0].parameter.parameterName);

    nowWeatherPhenomena.push(weatherPhenomena);
    nowMinTemperature.push(minTemperature);
    nowMaxTemperature.push(maxTemperature);

    const intTaipeiMinTemperature = parseInt(nowMinTemperature[5]);
    const intTaipeiMaxTemperature = parseInt(nowMaxTemperature[5]);
    const totalIntTaipeiTemperature = intTaipeiMinTemperature + intTaipeiMaxTemperature;

    headline__area_areaTitle.textContent = `${data.records.location[5].locationName}`;
    headline__temp_tempTitle.textContent = `${Math.round(totalIntTaipeiTemperature / 2)}` + "°";
    headline__condition_content.textContent = `${nowWeatherPhenomena[5]}`;
    headline__subtemp_content.textContent = "最高" + `${nowMaxTemperature[5]}` + "°" + " " + "最低" + `${nowMinTemperature[5]}` + "°";
    
    const cityList = document.getElementById("country-list");
    function cityMenu(e) {
      let selectCityValue = e.target.value;
      if (selectCityValue === countryNumber[data.records.location[i].locationName]) {
        const intMinTemperature = parseInt(nowMinTemperature[i]);
        const intMaxTemperature = parseInt(nowMaxTemperature[i]);
        const totalIntTemperature = intMinTemperature + intMaxTemperature;
        headline__area_areaTitle.textContent = `${data.records.location[i].locationName}`;
        headline__temp_tempTitle.textContent = `${Math.round(totalIntTemperature / 2)}` + "°";
        headline__condition_content.textContent = `${nowWeatherPhenomena[i]}`;
        headline__subtemp_content.textContent = "最高" + `${nowMaxTemperature[i]}` + "°" + " " + "最低" + `${nowMinTemperature[i]}` + "°";
      }
    }
    cityList.addEventListener("change", cityMenu);
  }
});