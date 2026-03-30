/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import config from "../config";
import { blendColors } from "../../utils/blendColors";
import React from "react";
import "./WeatherCard.css";

import { tickTime, loadWeather } from "../weather/weatherSlice";
import {
  WiDaySunny,
  WiCloudy,
  WiSnow,
  WiRain,
  WiThunderstorm,
  WiFog
} from "react-icons/wi";

import "./WeatherCard.css";


// -------------------------
// WeatherCard
// -------------------------

export default function WeatherCard({ tempC, condition, icon, moodKey }) {

  const getTempColor = () => {
    if (condition.includes("sun")) return "#FFB84C";
    if (condition.includes("cloud")) return "#6EC6FF";
    if (condition.includes("rain")) return "#4DA8DA";
    if (condition.includes("snow")) return "#AEE1F9";
    if (condition.includes("fog")) return "#AFC4D6";
    if (condition.includes("Thunderstorm")) return "#A8B4FF";
    if (condition.includes("mist")) return "#B0C4DE";
    return "#FFD1DC";
  };

  return (
    <div className={`weather-card fade-scale ${moodKey}`}>
      <div className="weather-icon-wrapper">
        {icon}
      </div>

      <div
        className="temperature"
        style={{
          color: getTempColor(),
          textShadow: `0 0 12px ${getTempColor()}55`
        }}
      >
        {tempC}°C
      </div>

      <div className="condition">{condition}</div>
    </div>
  );
}

// -------------------------
// WeatherPanel
// -------------------------
export function WeatherPanel() {
  const dispatch = useDispatch();

  const {
    city,
    tempC,
    tempF,
    condition,
    detail,
    date,
    time,
    status,
  } = useSelector((state) => state.weather);

  // Format time + date for display
  const formattedTime = time;
  const formattedDate = date;



  // 🌦️ Developer-only weather test state
  const [testWeather, setTestWeather] = useState(null);
  const [testTimeOfDay, setTestTimeOfDay] = useState(null);
  const [testGreeting, setTestGreeting] = useState(null);

  // Time of day logic
  const hour = new Date().getHours();



// -------------------------
// TIME OF DAY → timeOfDay
// -------------------------

let timeOfDay;

if (testTimeOfDay) {
  timeOfDay = testTimeOfDay;   // manual override
} else {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 2) timeOfDay = "late night";
  else if (hour >= 2 && hour < 5) timeOfDay = "early morning";
  else if (hour >= 5 && hour < 9) timeOfDay = "sunrise";
  else if (hour >= 9 && hour < 17) timeOfDay = "day";
  else if (hour >= 17 && hour < 20) timeOfDay = "sunset";
  else timeOfDay = "night";
}


// -------------------------
// timeOfDay → moodKey
// -------------------------

let moodKey = "";

switch (timeOfDay) {
  case "early morning":
    moodKey = "earlymorning";
    break;
  case "sunrise":
    moodKey = "sunrise";
    break;
  case "day":
    moodKey = "day";
    break;
  case "sunset":
    moodKey = "evening";
    break;
  case "night":
    moodKey = "night";
    break;
  case "late night":
    moodKey = "latenight";
    break;
  default:
    moodKey = "day";
}


// -------------------------
// timeOfDay → iconColorMap
// -------------------------

const iconColorMap = {
  "early morning": "#D7C7FF",
  sunrise: "#FFB38A",
  day: "#6EC6FF",
  sunset: "#FF8FA3",
  night: "#C8D6FF",
  "late night": "#C8D6FF"
};


function getGreetingFromTime(timeOfDay) {
  switch (timeOfDay) {
    case "earlymorning":
      return "Good Early Morning";
    case "sunrise":
      return "Good Morning";
    case "day":
      return "Good Afternoon";
    case "sunset":
      return "Good Evening";
    case "night":
      return "Good Night";
    default:
      return "Hello";
  }
}


  // WEATHER + TIME ICON DECISION
  useEffect(() => {
    dispatch(tickTime());
    dispatch(loadWeather());

    const id = setInterval(() => {
      dispatch(tickTime());
    }, 60000);

    return () => clearInterval(id);
  }, [dispatch]);

  if (status === "loading") {
    return (
      <section className="weather-panel" aria-label="Today's weather">
        <p>Loading weather…</p>
      </section>
    );
  }

  // 🌦️ Apply test override

  const displayedCondition = testWeather || condition;

  // 🌈🌦️ INSERTED HERE — WEATHER + TIME BLENDED ICON (Option 2)
  let blendedIcon = null;
  if (config.TEST_WEATHER_ICON_BLEND) {
    const weatherColorMap = {
      Clear: "#FFD27F",
      Clouds: "#AFCBFF",
      Rain: "#4DA8DA",
      Snow: "#AEE1F9",
      Mist: "#B0C4DE",
      Fog: "#AFC4D6",
      Thunderstorm: "#A8B4FF"
    };
      const weatherBaseColor = weatherColorMap[displayedCondition] || "#FFFFFF";
      const timeTint = iconColorMap[timeOfDay];
      const finalColor = blendColors(
        weatherBaseColor,
        timeTint ||"#FFFFFF" ,
        config.BLEND_RATIO);

      const blendedIconMap = {
        Clear: <WiDaySunny size={64} color={finalColor} />,
        Clouds: <WiCloudy size={64} color={finalColor} />,
        Rain: <WiRain size={64} color={finalColor} />,
        Snow: <WiSnow size={64} color={finalColor} />,
        Mist: <WiFog size={64} color={finalColor} />,
        Fog: <WiFog size={64} color={finalColor} />,
        Thunderstorm: <WiThunderstorm size={64} color={finalColor} />,
      };

      blendedIcon = blendedIconMap[displayedCondition] || (
        <WiCloudy size={64} color={finalColor} />
);


    }
    // 🌈🌦️ END INSERTED BLOCK

  return (
    <section
      className={`weather-panel ${displayedCondition.toLowerCase()} ${timeOfDay}`}
      aria-label="Today's weather"
    >

      {/* 🌦️ Developer-only weather test panel */}
      {window.location.hostname === "localhost" && (
        <div style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "rgba(255,255,255,0.85)",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          zIndex: 9999
        }}>
          <label style={{ marginRight: "8px" }}>Weather test:</label>
          <select
            value={testWeather || ""}
            onChange={(e) => setTestWeather(e.target.value)}
          >
            <option value="">Real API</option>
            <option value="Clear">Clear</option>
            <option value="Clouds">Clouds</option>
            <option value="Rain">Rain</option>
            <option value="Snow">Snow</option>
            <option value="Thunderstorm">Thunderstorm</option>
            <option value="Mist">Mist</option>
            <option value="Fog">Fog</option>
          </select>
          <div style={{ marginTop: "6px" }}>
            <label style={{ marginRight: "8px" }}>Time test:</label>
            <select
              value={testTimeOfDay || ""}
              onChange={(e) => setTestTimeOfDay(e.target.value || null)}
            >
              <option value="">Real Clock</option>
              <option value="6">Early Morning</option>
              <option value="sunrise">Sunrise</option>
              <option value="day">Day</option>
              <option value="sunset">Sunset</option>
              <option value="night">Night</option>
              <option value="23">Late Night</option>
            </select>
          </div>

        </div>
      )}

      {/* Weather UI */}
      <div className="weather-location-row">
        <span className="weather-city">{city}</span>
        <div className="weather-datetime">
        <div className="weather-time">{formattedTime}</div>
        <div className="weather-date">{formattedDate}</div>
      </div>

      </div>

{ /* Display the main weather condition, and if the detail is different, show it in a smaller font below. For example, if the condition is "Rain" and the detail is "Feels like 10 °C • Humidity 80%", it will show "Rain" prominently and the detail text below it. This allows users to quickly grasp the main weather condition while still having access to additional information at a glance. */}
      <div className="weather-condition">
        {displayedCondition}

        {detail !== condition && (
          <div className="separator">
            <span className="weather-detail">{detail}</span>
          </div>
        )}
      </div>

        {/* The main row of the weather panel, which includes the temperature block, time of day icon, and the WeatherCard component. The temperature block's background color changes based on the weather condition and time of day, while the WeatherCard displays the current temperature and condition with an appropriate icon. This layout provides a visually appealing and informative overview of the current weather at a glance. */}
      <div className="weather-main-row">
        <div className={`weather-temp-block ${displayedCondition.toLowerCase()}`}>
          <span className={`weather-temp weather-temp-${timeOfDay}`}>
            {tempC}°C • {tempF}°F
          </span>

          <span className="weather-feelslike">
            Feels like {detail.feelsLikeC}°C • Humidity {detail.humidity}%
          </span>
        </div>


        <div className="time-of-day-icon">
          {timeOfDay === "early morning" && <span>🌄</span>}
          {timeOfDay === "sunrise" && <span>🌅</span>}
          {timeOfDay === "day" && <span>☀️</span>}
          {timeOfDay === "sunset" && <span>🌇</span>}
          {timeOfDay === "night" && <span>🌙</span>}
        </div>



        {/* 🌈 TEST MODE: blended weather icon */}
        {config.TEST_WEATHER_ICON_BLEND && (
        <div style={{ marginBottom: "12px" }}>
          {blendedIcon}
        </div>
      )}

        {/* 🌤️ WeatherCard now receives the REAL icon URL */}
        <div className="weather-meta-block">
          <WeatherCard
            tempC={tempC}
            condition={displayedCondition}
            icon={blendedIcon}
            moodKey={moodKey}

          />
        </div>
      </div>
    </section>
  );
}
