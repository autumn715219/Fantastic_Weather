const headline__area_areaTitle = document.querySelector(".headline__area");
const headline__temp_tempTitle = document.querySelector(".headline__temp");
const headline__condition_content = document.querySelector(".headline__condition");
const headline__subtemp_content = document.querySelector(".headline__subtemp");

const countyList = {
  0: "臺北市",
  1: "宜蘭縣",
  2: "桃園市",
  3: "新竹縣",
  4: "苗栗縣",
  5: "彰化縣",
  6: "南投縣",
  7: "雲林縣",
  8: "嘉義縣",
  9: "屏東縣",
  10: "臺東縣",
  11: "花蓮縣",
  12: "澎湖縣",
  13: "基隆市",
  14: "新竹市",
  15: "嘉義市",
  16: "高雄市",
  17: "新北市",
  18: "臺中市",
  19: "臺南市",
  20: "連江縣",
  21: "金門縣",
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

    const cityList = document.getElementById("city-list");
    const option = document.createElement("option");
    option.setAttribute("value", countyList[i]);
    option.appendChild(document.createTextNode(countyList[i]));
    cityList.appendChild(option);

    function cityMenu(e) {
      let selectCityValue = e.target.value;
      if (selectCityValue === data.records.location[i].locationName) {
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