import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  WiCloudy,
  WiDaySunny,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm
} from "react-icons/wi";
import config from "../config";
import { blendColors } from "../../utils/blendColors";
import { tickTime, loadWeather } from "../weather/weatherSlice";
import "./WeatherCard.css";

function WeatherCard({ tempC, condition, icon, moodKey }) {
  const normalizedCondition = (condition || "").toLowerCase();

  const getTempColor = () => {
    if (normalizedCondition.includes("sun")) return "#FFB84C";
    if (normalizedCondition.includes("cloud")) return "#6EC6FF";
    if (normalizedCondition.includes("rain")) return "#4DA8DA";
    if (normalizedCondition.includes("snow")) return "#AEE1F9";
    if (normalizedCondition.includes("fog")) return "#AFC4D6";
    if (normalizedCondition.includes("thunderstorm")) return "#A8B4FF";
    if (normalizedCondition.includes("mist")) return "#B0C4DE";
    return "#FFD1DC";
  };

  return (
    <div className={`weather-card fade-scale ${moodKey}`}>
      <div className="weather-icon-wrapper">{icon}</div>

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

export function WeatherPanel() {
  const dispatch = useDispatch();
  const { city, tempC, tempF, condition, detail, date, time, status } =
    useSelector((state) => state.weather);

  const [testWeather, setTestWeather] = useState(null);
  const [testTimeOfDay, setTestTimeOfDay] = useState(null);

  const formattedTime = time;
  const formattedDate = date;

  let timeOfDay;
  if (testTimeOfDay) {
    timeOfDay = testTimeOfDay;
  } else {
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 2) timeOfDay = "late night";
    else if (hour >= 2 && hour < 5) timeOfDay = "early morning";
    else if (hour >= 5 && hour < 9) timeOfDay = "sunrise";
    else if (hour >= 9 && hour < 17) timeOfDay = "day";
    else if (hour >= 17 && hour < 20) timeOfDay = "sunset";
    else timeOfDay = "night";
  }

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

  const iconColorMap = {
    "early morning": "#D7C7FF",
    sunrise: "#FFB38A",
    day: "#6EC6FF",
    sunset: "#FF8FA3",
    night: "#C8D6FF",
    "late night": "#C8D6FF"
  };

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
        <p>Loading weather...</p>
      </section>
    );
  }

  const displayedCondition = testWeather || condition;
  const cleanedDetail =
    typeof detail === "string"
      ? detail.replace(/Â/g, "").replace(/â€¢/g, "•").trim()
      : "";
  const feelsLikeLine =
    cleanedDetail.length > 0
      ? `${cleanedDetail} • ${displayedCondition}`
      : displayedCondition;

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
      timeTint || "#FFFFFF",
      config.BLEND_RATIO
    );

    const blendedIconMap = {
      Clear: <WiDaySunny size={64} color={finalColor} />,
      Clouds: <WiCloudy size={64} color={finalColor} />,
      Rain: <WiRain size={64} color={finalColor} />,
      Snow: <WiSnow size={64} color={finalColor} />,
      Mist: <WiFog size={64} color={finalColor} />,
      Fog: <WiFog size={64} color={finalColor} />,
      Thunderstorm: <WiThunderstorm size={64} color={finalColor} />
    };

    blendedIcon =
      blendedIconMap[displayedCondition] || (
        <WiCloudy size={64} color={finalColor} />
      );
  }

  return (
    <section
      className={`weather-panel ${displayedCondition.toLowerCase()} ${timeOfDay}`}
      aria-label="Today's weather"
    >
      {window.location.hostname === "localhost" && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "rgba(255,255,255,0.85)",
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 9999
          }}
        >
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
              <option value="early morning">Early Morning</option>
              <option value="sunrise">Sunrise</option>
              <option value="day">Day</option>
              <option value="sunset">Sunset</option>
              <option value="night">Night</option>
              <option value="late night">Late Night</option>
            </select>
          </div>
        </div>
      )}

      <div className="weather-location-row">
        <span className="weather-city">{city}</span>
        <div className="weather-datetime">
          <div className="weather-time">{formattedTime}</div>
          <div className="weather-date">{formattedDate}</div>
        </div>
      </div>

      <div className="weather-main-row">
        <div className={`weather-temp-block ${displayedCondition.toLowerCase()}`}>
          <span className={`weather-temp weather-temp-${timeOfDay}`}>
            {tempC}°C • {tempF}°F
          </span>
          <span className="weather-feelslike">{feelsLikeLine}</span>
        </div>

        <div className="time-of-day-icon">
          {timeOfDay === "early morning" && <span>Dawn</span>}
          {timeOfDay === "sunrise" && <span>Rise</span>}
          {timeOfDay === "day" && <span>Day</span>}
          {timeOfDay === "sunset" && <span>Dusk</span>}
          {timeOfDay === "night" && <span>Night</span>}
          {timeOfDay === "late night" && <span>Late</span>}
        </div>

        {config.TEST_WEATHER_ICON_BLEND && (
          <div style={{ marginBottom: "12px" }}>{blendedIcon}</div>
        )}

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

export default WeatherPanel;
