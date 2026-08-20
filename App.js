import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "f904c5af4a42e5e2520d13c9a630eb17";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async (cityName) => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );

      setWeather(res.data);
    } catch (err) {
      setError("City not found ❌");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );

      setWeather(res.data);
    });
  };

  useEffect(() => {
    getLocationWeather();
  }, []);

  return (
    <div className="app">
      <div className="card">

        <h1>🌤 Weather App</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => getWeather(city)}>Search</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>

            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />

            <h1>{weather.main.temp}°C</h1>
            <p>{weather.weather[0].description}</p>

            <div className="details">
              <p>💧 {weather.main.humidity}%</p>
              <p>🌬 {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;