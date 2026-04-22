export async function fetchCurrentWeather(city = 'Evesham,GB') {
  const isRender = window.location.hostname.includes('onrender.com');

  if (isRender) {
    // Direct OpenWeather call for Render
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    return await res.json();
  } else {
    // Netlify function for Netlify
    const res = await fetch(`/.netlify/functions/getWeather?city=${encodeURIComponent(city)}`);
    return await res.json();
  }
}
