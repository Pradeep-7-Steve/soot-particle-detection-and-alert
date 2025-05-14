import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
  apiKey: "your API Id here",
  authDomain: firebaseapp domain name",
  projectId: "Ur projecct id here",
  storageBucket: "Enter urs",
  messagingSenderId: "Enter urs ",
  appId: "----------------"
};

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);  //initialize app

var database = firebase.database(); //reference to db
var airquality = database.ref("airquality");
var co2Ref = database.ref("carbon");
var iaq;
    
function updateProgressBars(iaq, co2) {
        // Update IAQ progress bar width (assuming IAQ range from 0 to 100)
    var iaqProgressBar = document.querySelector('.air-quality .prog');
    iaqProgressBar.style.width = iaq + '%';

    var co2ProgressBar = document.querySelector('.carbon .prog'); //carbon progress bar
        co2ProgressBar.style.width = ((co2 * 100) / 1000) + '%';
}

airquality.on('value', function(getdataiaq){
    iaq = getdataiaq.val();
    document.getElementById('air').innerHTML = iaq + "%";        //update air quality
    document.getElementById("airTooltip").innerHTML = iaq + "%";        //update tooltip
    updateProgressBars(iaq, null);
    console.log('Retrieved data: ', iaq);
    
})

co2Ref.on('value', function(getdataco2){
    var co2 = getdataco2.val();
    document.getElementById('carbon').innerHTML = co2 + "ppm";
    document.getElementById("co2toolTip").innerHTML = co2 + "ppm"; 
    updateProgressBars(null, co2);
})


//Time
var currentDate = new Date();

var hours = currentDate.getHours().toString().padStart(2, '0');
var minutes = currentDate.getMinutes().toString().padStart(2, '0');
var seconds = currentDate.getSeconds().toString().padStart(2, '0');

var currentTime = hours + ':' + minutes + ':' + seconds;

var newRow = document.createElement("tr");

var timeCell = document.createElement("td");
var co2Cell = document.createElement("td");
var temperatureCell = document.createElement("td");
var statusCell = document.createElement("td");
var detailsCell = document.createElement("td");

timeCell.textContent = currentTime;
//co2Cell.textContent = document.getElementById("carbon").textContent;
temperatureCell.textContent = document.getElementById("temperature").textContent;
detailsCell.textContent = "Details";

airquality.on('value', function(getdataiaq){
    var iaq = getdataiaq.val();
    if(iaq < 50){
        statusCell.textContent = "Worse"; 
    }else{
        statusCell.textContent =  "Good";

    }
})

co2Ref.on('value', function(getdataco2){
    var co2 = getdataco2.val();
    co2Cell.textContent = co2 + "ppm";
})


newRow.appendChild(timeCell);
newRow.appendChild(co2Cell);
newRow.appendChild(temperatureCell);
newRow.appendChild(statusCell);
newRow.appendChild(detailsCell);

var tableBody = document.getElementById("table");
tableBody.insertBefore(newRow, tableBody.firstChild);

if (tableBody.rows.length > 3) {
    tableBody.lastElementChild.remove();
}

let toastBox = document.getElementById("toastBox");

airquality.on('value', function(getdataiaq){
    var iaq = getdataiaq.val();
    if(iaq < 50){
        let toast = document.createElement("div");
        toast.classList.add("toast");
        toast.innerHTML = "<span class='material-symbols-outlined'>warning</span>Excess CO2 Alert!"
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 5000)
    }
})
