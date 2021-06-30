const submitBtn = document.getElementById('submitBtn');
const cityname = document.getElementById('cityname')
const city_name = document.getElementById('city_name');
const temp_status = document.getElementById('temp_status');
const temp = document.getElementById('tempval');
const datahide = document.querySelector('.middle_layer');
const day = document.getElementById('day');
const today_date = document.getElementById('today_date');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');


const getInfo = async (event) => {
    event.preventDefault();
    let cityVal = cityname.value;
    if (cityVal === ' ') {
        city_name.innerText = `please write the city name before search`
        datahide.classList.add('data_hide');
        humidity.classList.add('data_hide');
        pressure.classList.add('data_hide');
        visibility.classList.add('data_hide');
    } else {
        try {
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=a817891760a86255eb0f2b2b61006bbc`
            const response = await fetch(url);
            // console.log(response);
            const data = await response.json();
            const arrData = [data];
            city_name.innerText = `${arrData[0].name},${arrData[0].sys.country}`;
            temp.innerText = arrData[0].main.temp;
            humidity.innerText = `${arrData[0].main.humidity}%`
            pressure.innerText = `${arrData[0].main.pressure} hPa`
            visibility.innerText = `${arrData[0].visibility} m`
            const tempMood = `${arrData[0].weather[0].main}`;
            // console.log(arrData[0].main.temp);
            if (tempMood == "Clear") {
                temp_status.innerHTML = "<i class='fas fa-sun' style='color:#eccc68;'></i>"
            } else if (tempMood == "Clouds") {
                temp_status.innerHTML = "<i class='fas fa-cloud' style='color:#f1f2f6;'></i>"
            } else if (tempMood == "Rain") {
                temp_status.innerHTML = "<i class='fas fa-cloud-rain' style='color:#a4b0be;'></i>"
            } else {
                temp_status.innerHTML = "<i class='fas fa-sun' style='color:#eccc68;'></i>"
            }
            datahide.classList.remove('data_hide');
            humidity.classList.remove('data_hide');
            pressure.classList.remove('data_hide');
            visibility.classList.remove('data_hide');
        } catch {
            city_name.innerText = `please write the city name properly`;
            datahide.classList.add('data_hide');
            humidity.classList.add('data_hide');
            pressure.classList.add('data_hide');
            visibility.classList.add('data_hide');
        }
    }
}
submitBtn.addEventListener('click', getInfo);
const time = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Friday", "Satarday"];
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    const d = date.getDay();
    const da = date.getDate();
    const m = date.getMonth();
    day.innerText = days[d];
    today_date.innerText = `${da} ${mon[m]}`;
}
time();