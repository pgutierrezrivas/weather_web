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
        "arabia saudita": "saudi arabia",
        "australia": "australia",
        "bélgica": "belgium",
        "belgica": "belgium",
        "bolivia": "bolivia",
        "brasil": "brazil",
        "canadá": "canada",
        "canada": "canada",
        "china": "china",
        "colombia": "colombia",
        "corea del norte": "north korea",
        "costa rica": "costa rica",
        "cuba": "cuba",
        "ecuador": "ecuador",
        "egipto": "egypt",
        "el salvador": "el salvador",
        "españa": "spain",
        "estados unidos": "united states",
        "finlandia": "finland",
        "francia": "france",
        "gabón": "gabon",
        "gabon": "gabon",
        "granada": "grenada",
        "guatemala": "guatemala",
        "guinea": "guinea",
        "honduras": "honduras",
        "hong kong": "hong kong",
        "india": "india",
        "indonesia": "indonesia",
        "irak": "iraq",
        "iran": "iran",
        "irlanda": "ireland",
        "italia": "italy",
        "japón": "japan",
        "japon": "japan",
        "kenia": "kenya",
        "kosovo": "kosovo",
        "kuba": "cuba",
        "letonia": "latvia",
        "lituania": "lithuania",
        "luxemburgo": "luxembourg",
        "malasia": "malaysia",
        "malawi": "malawi",
        "marruecos": "morocco",
        "méxico": "mexico",
        "mexico": "mexico",
        "mónaco": "monaco",
        "monaco": "monaco",
        "mongolia": "mongolia",
        "nicaragua": "nicaragua",
        "nigeria": "nigeria",
        "noruega": "norway",
        "países bajos": "netherlands",
        "paises bajos": "netherlands",
        "panamá": "panama",
        "panama": "panama",
        "paraguay": "paraguay",
        "perú": "peru",
        "peru": "peru",
        "polonia": "poland",
        "portugal": "portugal",
        "puerto rico": "puerto rico",
        "reino unido": "united kingdom",
        "república dominicana": "dominican republic",
        "republica dominicana": "dominican republic",
        "república de corea": "republic of Korea",
        "republica de corea": "republic of Korea",
        "rusia": "russia",
        "senegal": "senegal",
        "singapur": "singapore",
        "sudáfrica": "south africa",
        "sudafrica": "south africa",
        "suecia": "sweden",
        "suiza": "switzerland",
        "tanzania": "tanzania",
        "tailandia": "thailand",
        "turquía": "turkey",
        "turquia": "turkey",
        "uganda": "uganda",
        "uruguay": "uruguay",
        "venezuela": "venezuela",
        "yemen": "yemen",
        "zambia": "zambia",
        "zimbabue": "zimbabwe"
        // añadir paises
    };
    return countryTranslation[countryName.toLowerCase()] || countryName; // si el pais está en el diccionario, devolver la traduccion y si no lo esta, devolver el nombre original
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