
const countryIds={
  "宜蘭縣":"F-D0047-001",
  "桃園市":"F-D0047-005",
  "新竹縣":"F-D0047-009",
  "苗栗縣":"F-D0047-013",
  "彰化縣":"F-D0047-017",
  "南投縣":"F-D0047-021",
  "雲林縣":"F-D0047-025",
  "嘉義縣":"F-D0047-029",
  "屏東縣":"F-D0047-033",
  "臺東縣":"F-D0047-037",
  "花蓮縣":"F-D0047-041",
  "澎湖縣":"F-D0047-045",
  "基隆市":"F-D0047-049",
  "新竹市":"F-D0047-053",
  "嘉義市":"F-D0047-057",
  "臺北市":"F-D0047-061",
  "高雄市":"F-D0047-049",
  "新北市":"F-D0047-069",
  "臺中市":"F-D0047-073",
  "臺南市":"F-D0047-077",
  "連江縣":"F-D0047-081",
  "金門縣":"F-D0047-085",
}

//把資料塞入下拉選單
let collegeSelect=document.getElementById("country-list");
let inner="";
for (var key in countryIds) {
  //console.log("key " + key + " has value " + countryIds[key]);
  inner+='<option value='+ countryIds[key] +'>'+key+'</option>';
}
collegeSelect.innerHTML=inner;


collegeSelect.addEventListener('change', fetchData(this.value));
function fetchData(countryIds) {
  fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-093?Authorization='+CWB_API_KEY+'&locationId='+countryIds)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          'Looks like there was a problem. Status Code: ' + response.status
        );
        return;
      }
      response.json().then(function (data) {
        console.log(countryIds);
        console.log(data);
        //document.getElementById('w3review').value = data;
      });
    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

// //向網站發送請求
// fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-093?Authorization='+CWB_API_KEY+'&locationId=F-D0047-005')

//   //將回應的資料取出
//   .then(function (response) {
//       return response.json();
//   })

//   //使用得到的資料
//   .then(function (data) {
//       console.log(data)
//       讀到資料(將JSON格式轉換成JS可使用的object)
//       let location = data["records"]["location"];

//       //將資料放入norm這個陣列重新排列組合出norm新的陣列
//       location.forEach(function (location) {
//         locations[locations.indexOf(location["locationName"])] = {
//               locationName: location["locationName"],
//               weather: location["weatherElement"][0]["time"][1]["parameter"]["parameterName"],
//               minT: location["weatherElement"][2]["time"][1]["parameter"]["parameterName"],
//               maxT: location["weatherElement"][4]["time"][1]["parameter"]["parameterName"],
//               pop: location["weatherElement"][1]["time"][1]["parameter"]["parameterName"]
//           }
//       });
      
//       讀取norm陣列的物件並判斷weather的值後放入網頁中
//       ShowWeather(0);
//   })

//   //讀取norm陣列的物件並判斷weather的值後放入網頁中的函式
// function ShowWeather(from, to){
//   let container=document.querySelector("#locations");

//   container.innerHTML = ''
//   norm.slice(from, to).forEach(function (norm) {

//       var className ;
//       if(norm["weather"] ==='晴時多雲'){
//           className = 'mostly-clear'
//       }
//       else if(norm["weather"] ==='陰天'){
//           className = 'cloudy'
//       }
//       else if(norm["weather"] ==='多雲' || norm["weather"] ==='多雲時陰'){
//           className = 'partly-cloudy'
//       }
//       else if(norm["weather"].match('雨')){
//           className = 'rainy'
//       }
//       else if(norm["weather"] ==='晴天'){
//           className = 'claear'
//       }
//       else{
//           className = 'mostly-clear'
//       }
      
//       container.innerHTML +=
//       `<div class="card ${className}">
//       <h2 class="h2">${norm["locationName"]}</h2>
//       <div>明日天氣：${norm["weather"]}</div>
//       <div>明日温度：${norm["minT"]}&degC ～ ${norm["maxT"]}&degC</div>
//       <div>降雨機率：${norm["pop"]}%</div>
//       <div>`
//   });  
// };