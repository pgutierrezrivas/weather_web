document.addEventListener('DOMContentLoaded', function (event) {

    const apiKey = "pbpurv76zodadlhmfvqbxrx50s2nn3km0y18f962";
    const cityInput = document.getElementById('city-input');
    const countryInput = document.getElementById('country-input');
    const weatherInfo = document.getElementById('weather-info');
    const errorMessage = document.getElementById('error-message');

    const weatherButton = document.getElementById('get-weather');
    weatherButton.addEventListener('click', getWeather);

    function getWeather() {

        const city = cityInput.value.trim().toLowerCase();
        const country = countryInput.value.trim().toLowerCase();

        if (city === '' || country === '') { // si no se ingresa ciudad o pais
            errorMessage.textContent = 'Por favor ingresa el nombre de una ciudad y un país.';
            weatherInfo.style.display = 'none';
            return;
        }

        // Limpiar campos previos
        errorMessage.textContent = '';
        weatherInfo.style.display = 'none';
        
        // Realizar la búsqueda de la ciudad con el nombre de la ciudad
        fetch(`https://www.meteosource.com/api/v1/free/find_places?text=${city}&key=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ciudad no encontrada');
                }
                return response.json();
            })
            .then(data => {
                // Verificar si se obtuvieron resultados
                if (data.length === 0) {
                    throw new Error('No se encontraron resultados para esa ciudad.');
                }

                const countryInEnglish = translateCountry(country); // traducir el nombre del pais del español al ingles

                // filtrar por pais y asegurar que encontramos la ciudad correcta
                const place = data.find(item => item.country.toLowerCase() === countryInEnglish.toLowerCase());
                if (!place) {
                    throw new Error(`No se encontró ${city} en ${country}.`);
                }
                const placeId = place.place_id;

                // usar el place_id para obtener los datos del clima
                return fetch(`https://www.meteosource.com/api/v1/free/point?place_id=${placeId}&sections=current&language=en&units=auto&key=${apiKey}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los datos del clima.');
                }
                return response.json();
            })
            .then(data => {
                // Extraer la información del clima
                const iconCode = data.current.icon_num;  // numero del icono del clima
                const summary = data.current.summary;   // descripcion original

                // Mostrar la sección de clima
                weatherInfo.style.display = 'block';

                // Mostrar el ícono del clima
                const weatherIcon = document.getElementById('weather-icon');
                weatherIcon.innerHTML = `<img src="https://www.meteosource.com/static/img/ico/weather/${iconCode}.svg" alt="${summary}">`;

                // Mostrar la información del clima
                const temperature = document.getElementById('temperature'); // mostrar la temperatura
                temperature.textContent = `${Math.round(data.current.temperature)}°C`;

                const description = document.getElementById('description'); // mostrar la descripción traducida
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

// funcion para traducir el pais introducido por el usuario
function translateCountry(countryName) {
    const countryTranslation = {
        "alemania": "germany",
        "argentina": "argentina",
        "australia": "australia",
        "belgica": "belgica",
        "bélgica": "belgica",
        "brasil": "brazil",
        "canada": "canada",
        "cánada": "canada",
        "china": "china",
        "corea del sur": "south korea",
        "colombia": "colombia",
        "chile": "chile",
        "estados unidos": "united states",
        "españa": "spain",
        "egipto": "egypt",
        "francia": "france",
        "finlandia": "finlandia",
        "gales": "wales",
        "grecia": "greece",
        "hungría": "hungary",
        "hungria": "hungria",
        "italia": "italy",
        "irlanda": "ireland",
        "israel": "israel",
        "india": "india",
        "japon": "japan",
        "japón": "japan",
        "mexico": "mexico",
        "méxico": "mexico",
        "países bajos": "netherlands",
        "peru": "peru",
        "perú": "peru",
        "reino unido": "united kingdom",
        "rusia": "russia",
        "sudafrica": "south africa",
        "sudáfrica": "south africa",
        // añadir paises
    };
    return countryTranslation[countryName] || countryName; // si el pais está en el diccionario, devolver la traduccion y si no lo esta, devolver el nombre original
}

// funcion para traducir la descripcion del clima
function getSummaryTranslation(iconNumber, summary) {
    const summaryTranslation = {
        1: "No disponible",
        2: "Soleado",
        3: "Mayormente soleado",
        4: "Parcialmente soleado",
        5: "Mayormente nublado",
        6: "Nublado",
        7: "Totalmente nublado",
        8: "Nublado con nubes bajas",
        9: "Niebla",
        10: "Lluvia ligera",
        11: "Lluvia",
        12: "Posible lluvia",
        13: "Chubascos de lluvia",
        14: "Tormenta",
        15: "Tormentas locales",
        16: "Nieve ligera",
        17: "Nieve",
        18: "Posible nieve",
        19: "Chubascos de nieve",
        20: "Lluvia y nieve",
        21: "Posible lluvia y nieve",
        22: "Lluvia y nieve",
        23: "Lluvia helada",
        24: "Posible lluvia helada",
        25: "Granizo",
        26: "Despejado (noche)",
        27: "Mayormente despejado (noche)",
        28: "Parcialmente despejado (noche)",
        29: "Mayormente nublado (noche)",
        30: "Nublado (noche)",
        31: "Nublado con nubes bajas (noche)",
        32: "Chubascos de lluvia (noche)",
        33: "Tormentas locales (noche)",
        34: "Chubascos de nieve (noche)",
        35: "Lluvia y nieve (noche)",
        36: "Posible lluvia helada (noche)"
    };
    return summaryTranslation[iconNumber] || summary;
}