
document.addEventListener('DOMContentLoaded', function (event) {

    const apiKey = "pbpurv76zodadlhmfvqbxrx50s2nn3km0y18f962";
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    const errorMessage = document.getElementById('error-message');

    const weatherButton = document.getElementById('get-weather');
    weatherButton.addEventListener('click', getWeather);

    function getWeather() {

        const city = cityInput.value.trim();

        if (city === '') { // si no se ingresa ninguna ciudad en el input
            errorMessage.textContent = 'Por favor ingresa el nombre de una ciudad.';
            weatherInfo.style.display = 'none';
            return;
        }

        // Limpiar campos previos
        errorMessage.textContent = '';
        weatherInfo.style.display = 'none';

        
        fetch(`https://www.meteosource.com/api/v1/free/point?place_id=${city}&sections=current&language=en&units=auto&key=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ciudad no encontrada');
                }
                return response.json();
            })
            .then(data => {

                
                const iconCode = data.current.icon_num;  // numero del icono del clima
                const summary = data.current.summary;   // descripcion original
                
                function getSummaryTranslation(iconCode, summary) { // funcion traduccion descripcion de clima

                    const summaryTranslation = {
                        1 : "No disponible",
                        2 : "Soleado",
                        3 : "Mayormente soleado", 
                        4 : "Parcialmente soleado",
                        5 : "Mayormente nublado ",
                        6 : "Nublado",
                        7 : "Totalmente nublado",
                        8 : "Nublado con nubes bajas",
                        9 : "Niebla",
                        10 : "Lluvia ligera",
                        11 : "Lluvia",
                        12 : "Posible lluvia",
                        13 : "Chubascos de lluvia",
                        14 : "Tormenta", 
                        15 : "Tormentas locales",
                        16 : "Nieve ligera", 
                        17 : "Nieve", 
                        18 : "Posible nieve",
                        19 : "Chubascos de nieve", 
                        20 : "Lluvia y nieve", 
                        21 : "Posible lluvia y nieve",
                        22 : "Lluvia y nieve", 
                        23 : "Lluvia helada", 
                        24 : "Posible lluvia helada",
                        25 : "Granizo", 
                        26 : "Despejado (noche)", 
                        27 : "Mayormente despejado (noche)",
                        28 : "Parcialmente despejado (noche)", 
                        29 : "Mayormente nublado (noche)", 
                        30 : "Nublado (noche)",
                        31 : "Nublado con nubes bajas (noche)", 
                        32 : "Chubascos de lluvia (noche)", 
                        33 : "Tormentas locales (noche)",
                        34 : "Chubascos de nieve (noche)", 
                        35 : "Lluvia y nieve (noche)", 
                        36 : "Posible lluvia helada (noche)"
                    };

                    return summaryTranslation[iconCode] || summary;
                }

                // Mostrar la sección de clima
                weatherInfo.style.display = 'block';

                // Mostrar el ícono del clima
                const weatherIcon = document.getElementById('weather-icon');
                weatherIcon.innerHTML = `<img src="https://www.meteosource.com/static/img/ico/weather/${iconCode}.svg" alt="${data.current.summary}">`;
                
                // Mostrar la información del clima
                const temperature = document.getElementById('temperature'); // mostrar la temperatura
                temperature.textContent = `${Math.round(data.current.temperature)}°C`;
                
                const description = document.getElementById('description'); // mostrar la descripcion traducida
                description.textContent = `${getSummaryTranslation(iconCode, summary)}`;
                
                const cloudCover = document.getElementById('cloud-cover'); // mostrar la nubosidad
                cloudCover.textContent = `Nubosidad: ${data.current.cloud_cover}%`;
                
                const precipitation = document.getElementById('precipitation'); // mostrar precipitaciones
                precipitation.textContent = `Precipitaciones: ${data.current.precipitation.total} mm/h`;
                
                const windSpeed = document.getElementById('wind-speed'); // mostrar la velocidad del viento
                windSpeed.textContent = `Viento: ${data.current.wind.speed} m/s`;

            })
            .catch(error => {
                errorMessage.textContent = 'Error: ' + error.message;
                weatherInfo.style.display = 'none';
            });
    }

});