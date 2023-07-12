import API_KEY from "./API.js";
const week = ['SUN', 'MON', 'TUE', 'WED', 'THE', 'FRI', 'SAT'];
const year = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const currentWeatherData = (lat, lon, name) => {
    const URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(URL).then(res => res.json()).then(res => {

        document.querySelector('.wetherInfoArea .wetherHeighlight .data .cityName').innerText = name;
        document.querySelector('.wetherInfoArea .wetherHeighlight .data .temperature').innerHTML = `${(res?.main?.temp - 273.15).toFixed(0)}<span>°</span>`;
        document.querySelector('.wetherInfoArea .wetherHeighlight .data .temMinMax').innerText = `Temp: ${(res?.main?.temp_min - 273.15).toFixed(0)} / ${(res?.main?.temp_max - 273.15).toFixed(0)}`;
        document.querySelector('.wetherInfoArea .wetherHeighlight .data .wind').innerText = `Wind Speed: ${res?.wind?.speed} m/s`;

        document.querySelector('.wetherInfoArea .wetherHeighlight .wetherIcon img').src = `https://openweathermap.org/img/wn/${res?.weather[0].icon}@2x.png`;
        document.querySelector('.wetherInfoArea .wetherHeighlight .wetherIcon .discription').innerText = `${res?.weather[0].description}`;
    })
}

const threeHourleyData = (lat, lon, name) => {

    const getDay = (dateStr) => {
        const dt = new Date(dateStr);
        let ans = `${week[dt.getDay()]}, ${dt.getDate()} ${year[dt.getMonth()]}`;
        return ans;
    }

    const URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(URL).then(res => res.json()).then(res => {

        res = res.list.filter((wt => {
            return wt.dt_txt.split(' ')[1] === '00:00:00';
        }));

        document.querySelector('.multidaysDataContainer .multidaysData').innerHTML = '';

        res.forEach(element => {
            const container = document.querySelector('.multidaysDataContainer .multidaysData');
            const html = `<span class="time">${getDay(element.dt_txt)}</span>
                        <span class="description">${element.weather[0].description}</span>
                        <img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="">
                        <span class="temperature">Temp: ${(element?.main?.temp_min - 273.15).toFixed(0)} / ${(element?.main?.temp_max - 273.15).toFixed(0)}</span>`;
            let dayData = document.createElement('div');
            dayData.classList.add('dayData');
            dayData.innerHTML = html;
            container.appendChild(dayData);
        });
    });
}



const cityInput = document.querySelector('.citiesArea input');
const searchBtn = document.querySelector('.citiesArea .searchBtn');

searchBtn.addEventListener('click', (e) => {
    const city = cityInput.value.trim();

    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${API_KEY}`;

    fetch(URL).then(res => res.json()).then(res => {
        if (!res.length) {
            alert(`Details not found of your Entered City ${city}`);
        } else {
            currentWeatherData(res[0].lat, res[0].lon, res[0].name);
            threeHourleyData(res[0].lat, res[0].lon, res[0].name);
        }
    });
});

const locationBtn = document.querySelector('.citiesArea .getLocationBtn');
locationBtn.addEventListener('click', (e) => {

    navigator.geolocation.getCurrentPosition((sucess) => {

        currentWeatherData(sucess.coords.latitude, sucess.coords.longitude, 'Location');
        threeHourleyData(sucess.coords.latitude, sucess.coords.longitude, 'Location');

    }, (err) => {
        alert('can not find your location');
    });
});
