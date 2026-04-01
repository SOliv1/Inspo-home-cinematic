import React, { useEffect, useState } from "react";
import "./App.css";
import { WeatherPanel } from "./features/weather/WeatherPanel";
import silverLogo from './assets/logo-silver.png';
import warmLogo from './assets/logo-warm.png';
import {
  getSeason,
  getSeasonalOrb,
  getSeasonalAccent,
  getSeasonalGreeting,
} from './utils/season';

import { seasonalQuotes } from './utils/season';
import { getTagline } from "./utils/tagline/taglineEngine";


function App() {
  // 1. STATE
  const [greetingMode, setGreetingMode] = useState("whimsical");
  const [entries, setEntries] = useState([]);
  const [journalText, setJournalText] = useState("");

  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);


  // Load saved tasks on mount
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    const savedCompleted = localStorage.getItem("completedTasks");

    if (saved) setTasks(JSON.parse(saved));
    if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted));
  }, []);

  // Save active tasks whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save completed tasks whenever they change
  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Load saved journal text on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save journal text whenever it changes
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  // 2. TIME
  const hour = new Date().getHours();

  // 3. GREETING SETS
  const greetingSets = {
    whimsical: {
      sunrise: "A soft sunrise for you, Sara",
      day: "Hope the day feels kind to you, Sara",
      sunset: "The light is softening for you, Sara",
      night: "A quiet night for you, Sara",
      lateNight: "Winding down, Sara?",
      earlyMorning: "Early morning calm, Sara"
    },
    minimal: {
      sunrise: "Good Morning, Sara",
      day: "Hello, Sara",
      sunset: "Good Evening, Sara",
      night: "Good night, Sara",
      lateNight: "Still awake, Sara",
      earlyMorning: "Up early, Sara"
    },
    poetic: {
      sunrise: "The light arrives softly for you, Sara",
      day: "The day opens its hands to you, Sara",
      sunset: "The sky is folding into gold for you, Sara",
      night: "The quiet gathers around you, Sara",
      lateNight: "The late hours drift gently with you, Sara",
      earlyMorning: "The world is hushed and waiting, Sara"
    }
  };

  // EVERGREEN QUOTE
  const evergreenQuote =
  "There's a quiet wisdom inside you. Listen, and follow where it leads.";

  // 4. MOODS
  const moods = {
    night: { class: "greeting-night", icon: () => "🌌" },
    lateNight: { class: "greeting-latenight", icon: () => "✨" },
    earlyMorning: { class: "greeting-earlymorning", icon: () => "⭐" },
    sunrise: { class: "greeting-sunrise", icon: () => "🌅" },
    day: { class: "greeting-day", icon: () => "☀️" },
    sunset: { class: "greeting-sunset", icon: () => "🌇" }
  };

  // 5. MOOD LOGIC
  let moodKey;
  if (hour >= 2 && hour < 5) moodKey = "earlyMorning";
  else if (hour >= 5 && hour < 12) moodKey = "sunrise";
  else if (hour >= 12 && hour < 17) moodKey = "day";
  else if (hour >= 17 && hour < 22) moodKey = "sunset";
  else if (hour >= 22 && hour < 23) moodKey = "night";
  else moodKey = "lateNight";
  const mood = moods[moodKey];
    if (!mood) {
  console.warn("Invalid moodKey:", moodKey);
  };

  // --- Logo Seasonal Date
function getSeason() {
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  if (month === 11 || month <= 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
}
  // --- Logo Seasonal Time of Day
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) return 'night';
  if (hour >= 6 && hour < 10) return 'dawn';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}
  // -------------------------------

  // 6. GREETING MACHINE
  const greeting = greetingSets[greetingMode][moodKey];
  const greetingClass = mood.class;
  const greetingIcon = mood.icon(hour);


  // --- SEASON LOGIC ---
function getSeasonFromMonth() {
  const month = new Date().getMonth();
    if (month === 11 || month <= 1) return "winter";
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    return "autumn";
  }

  const [seasonKey, setSeasonKey] = useState(getSeasonFromMonth() || "spring");
  const quote =
  (seasonalQuotes && seasonalQuotes[seasonKey]) ||
  (seasonalQuotes && seasonalQuotes.winter) ||
  "Default fallback quote";
  const [manualSeason, setManualSeason] = useState(false);


  const moonPhase = Math.floor((new Date().getDate() % 29) / 7);

  useEffect(() => {
    if (!manualSeason) {
      setSeasonKey(getSeasonFromMonth() || "spring");
    }
  }, [manualSeason]);


  useEffect(() => {
    const shell = document.querySelector(".app-shell");
    shell.classList.add("fade-transition");
    const timeout = setTimeout(
      () => shell.classList.remove("fade-transition"),
      800
    );
    return () => clearTimeout(timeout);
  }, [seasonKey]);



  useEffect(() => {
  function handleScroll() {
    const whisper = document.querySelector(".seasonal-whisper");
    if (!whisper) return;

    const offset = window.scrollY * 0.05; // gentle parallax
    whisper.style.transform = `translateY(${offset}px)`;
  }

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [])


  // SCROLL FADE EFFECT
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-on-scroll");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
          else entry.target.classList.remove("visible");
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- Seasonal & Time Helpers ---
  const currentSeason = getSeason(); // e.g., 'winter', 'spring', etc.
  const currentTime = getTimeOfDay(); // e.g., 'night', 'morning', etc.
  const logoSrc =
  currentSeason === 'winter' || currentTime === 'night' || currentTime === 'dawn'
    ? silverLogo
    : warmLogo;

  // --- Seasonal Taglines ---
  const [tagline, setTagline] = useState("Welcome to your Seasonal Glow");

  useEffect(() => {
    setTagline(getTagline(moodKey));
  }, [moodKey]);


  // --- Rotate tagline every 45 seconds ---
  useEffect(() => {
  const interval = setInterval(() => {
    setTagline(getTagline(moodKey));
  }, 45000);

  return () => clearInterval(interval);
  }, [moodKey]);


  // --- Shimmer animation ---
  useEffect(() => {
  const el = document.querySelector('.cinematic-tagline');
  if (!el) return;

  el.classList.add('shimmer');
  const timeout = setTimeout(() => el.classList.remove('shimmer'), 1400);

  return () => clearTimeout(timeout);
  }, [tagline]);


  //--- Pulse animation ---
  useEffect(() => {
  const el = document.querySelector('.cinematic-tagline');
  if (!el) return;

  el.classList.add('glow-pulse');
  const timeout = setTimeout(() => el.classList.remove('glow-pulse'), 1600);

  return () => clearTimeout(timeout);
  }, [moodKey]);

  //--- Season Changes ---
  useEffect(() => {
  const el = document.querySelector('.cinematic-tagline');
  if (!el) return;

  el.classList.add('glow-seasonal');
  }, [seasonKey]);




  // --- JSX ---

  return (
  <>
    <div id="top"></div>
    <div
      className={`app-container
        mood-silhouette
        ${moodKey || ""}
        ${seasonKey || ""}
        moon-${moonPhase || ""}`
      }
    >


      {/* NIGHT SKY */}
      <div className="night-sky">
        <div className="twinkle-star" style={{ top: "12%", left: "15%" }}></div>
        <div className="twinkle-star" style={{ top: "18%", left: "55%" }}></div>
        <div className="twinkle-star" style={{ top: "22%", left: "75%" }}></div>
        <div className="twinkle-star" style={{ top: "8%", left: "35%" }}></div>
        <div className="twinkle-star" style={{ top: "5%", left: "60%" }}></div>
        <div className="twinkle-star" style={{ top: "25%", left: "10%" }}></div>
        <div className="twinkle-star" style={{ top: "8%", left: "35%" }}></div>
         {/* ⭐ Twinkling stars & Shooting Star */}
        <div className="shooting-star"></div>
      </div>

      <div className="sky-fade"></div>
      <div className="sky-fade-sides"></div>

      {/* APP BODY */}
      <div className={`app-body ${greetingClass}`}>

        {/* APP SHELL */}
        <div className={`app-shell ${seasonKey} ${moodKey}`}>

          {/* SEASON CONTROLS */}
          <div className="season-controls">
            <div className="season-buttons">
              <button
                className={`winter ${seasonKey === "winter" ? "active" : ""}`}
                onClick={() => { setManualSeason(true); setSeasonKey("winter"); }}
              >
                ❄️ Winter
              </button>
              <button
                className={`spring ${seasonKey === "spring" ? "active" : ""}`}
                onClick={() => { setManualSeason(true); setSeasonKey("spring"); }}
              >
                🌸 Spring
              </button>
              <button
                className={`summer ${seasonKey === "summer" ? "active" : ""}`}
                onClick={() => { setManualSeason(true); setSeasonKey("summer"); }}
              >
                ☀️ Summer
              </button>
              <button
                className={`autumn ${seasonKey === "autumn" ? "active" : ""}`}
                onClick={() => { setManualSeason(true); setSeasonKey("autumn"); }}
              >
                🍁 Autumn
              </button>
            </div>

            <div className="season-mode">
              <label>
                <input
                  type="checkbox"
                  checked={manualSeason}
                  onChange={() => setManualSeason(!manualSeason)}
                />
                Manual Season
              </label>

              {!manualSeason && (
                <button
                  className="auto-button"
                  onClick={() => setSeasonKey(getSeasonFromMonth())}
                >
                  Auto
                </button>
              )}
            </div>
          </div>

          {/* FROST OVERLAYS */}
          <div className="frost-overlay"></div>
          <div className="frost-overlay"></div>

          {/* APP CONTENT */}
          <div className="app-content">

            {/* MAIN GRID */}
            <main className="main-grid">

              {/* LEFT COLUMN */}
              <div className="left-column">
                <header className="app-header">
                  <div className="orb-wrapper">
                    {/* ORB */}
                    <img
                      src={logoSrc}
                      className={`top-logo ${logoSrc === silverLogo ? "silver" : "warm"}`}
                      alt="Glowing Mountain Logo Orb"
                    />
                    {/* TAGLINE */}
                    <div className="cinematic-tagline">{tagline}</div>


                  </div>
                  {/* MENU */}
                  <nav className="mini-menu">
                    <div id="top"></div>
                    <a href="#todos">To‑Dos</a>
                    <a href="#thoughts">Thoughts</a>
                    <a href="#weather">Weather</a>
                    <a href="#time">Time</a>
                    <a href="#footer">Footer</a>
                  </nav>

                  {/* GREETING */}
                  <div className={greetingClass}>
                    <p className="dynamic-greeting">
                      <span className="greeting-icon">{greetingIcon}</span>
                      {greeting}
                    </p>

                        {/*  EVERGREEN-QUOTE */}
                    <p
                      key={`evergreen-${seasonKey || ""}-${moodKey || ""}`}
                      className={`evergreen-quote shimmer ${seasonKey || ""} ${moodKey || ""} moon-${moonPhase || ""}`}
                    >
                      {evergreenQuote}
                    </p>

                    {/* NIGHT TIME ONLY OPTION
                    <p
                      key={`evergreen-${seasonKey}-${moodKey}`}
                      className={`evergreen-quote ${isNight ? "shimmer" : ""} ${seasonKey} ${moodKey} moon-${moonPhase}`}
                    >
                      {evergreenQuote}
                    </p> */}

                    <p key={seasonKey} className={`seasonal-whisper ${seasonKey}`}>
                      {quote}
                    </p>

                    <div className="greeting-mode-toggle" data-mode={greetingMode}>
                      <button
                        className={greetingMode === "whimsical" ? "active" : ""}
                        onClick={() => setGreetingMode("whimsical")}
                      >
                        Whimsical
                      </button>

                      <button
                        className={greetingMode === "minimal" ? "active" : ""}
                        onClick={() => setGreetingMode("minimal")}
                      >
                        Minimal
                      </button>

                      <button
                        className={greetingMode === "poetic" ? "active" : ""}
                        onClick={() => setGreetingMode("poetic")}
                      >
                        Poetic
                      </button>
                    </div>
                  </div>

                  <h1 className="app-title">Daily Checklist</h1>
                </header>

                {/* NEW TASK BAR */}
                <div id="todos"></div>
                <div className={`new-task-bar ${moodKey}`}>
                  <input
                    type="text"
                    placeholder="Add a new task…"
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                  />

                  <button
                    onClick={() => {
                      if (newTask.trim()) {
                        setTasks([...tasks, { text: newTask, completed: false }]);
                        setNewTask("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* ACTIVE TASKS */}
                <div className="task-list">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`task-gem gem-${moodKey} ${task.completed ? "completed" : ""}`}
                    >
                      <div className="gem-core">
                        <div className="gem-glow"></div>
                        <div className="gem-body"></div>
                      </div>

                      <span
                        className="gem-check"
                        onClick={() => {
                          const updated = [...tasks];
                          updated[index].completed = true;
                          setTasks(updated);

                          setTimeout(() => {
                            setCompletedTasks([...completedTasks, task.text]);
                            setTasks(tasks.filter((_, i) => i !== index));
                          }, 500);
                        }}
                      >
                        ✓
                      </span>

                      <span className="task-text">{task.text}</span>

                      <button
                        className="delete-task"
                        onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* COMPLETED TASKS */}
                <div className="completed-list">
                  {completedTasks.map((task, index) => (
                    <div key={index} className="completed-item">
                      {task}
                    </div>
                  ))}
                </div>

                {/* JOURNAL INPUT */}
                <div id="thoughts"></div>
                <div className={`journal-input-wrapper ${moodKey}`}>
                  <input
                    className="journal-input"
                    type="text"
                    placeholder="Write a little thought…"
                    value={journalText}
                    onChange={e => setJournalText(e.target.value)}
                  />

                  <button
                    className="add-button"
                    onClick={() => {
                      if (journalText.trim()) {
                        setEntries([...entries, journalText]);
                        setJournalText("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* JOURNAL ENTRIES */}
                <section className="journal-entries">
                  {entries.length === 0 && (
                    <div className={`journal-empty ${moodKey}`}>
                      Nothing here yet… Write a little thought above.
                    </div>
                  )}

                  {entries.map((entry, index) => (
                    <div key={index} className={`journal-entry ${moodKey}`}>
                      <span className="journal-text">{entry}</span>

                      <button
                        className={`clear-journal ${moodKey}`}
                        onClick={() => {
                          setEntries([]);
                          localStorage.removeItem("journalEntries");
                        }}
                      >
                        Clear all entries
                      </button>

                      <button
                        className="delete-entry"
                        onClick={() => {
                          const updated = entries.filter((_, i) => i !== index);
                          setEntries(updated);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </section>

                <a href="#top" className="back-to-top">Back to top ↑</a>
                <div className="section-divider"></div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="right-column">
                <div id="time"></div>
                <div id="weather"></div>
                <WeatherPanel />
              </div>

            </main>
            {/* END MAIN GRID */}

            {/* FOOTER */}
            <footer className="QuotesFooter">
              <a href="#top" className="back-to-top">Back to top ↑</a>

              <a
                href="https://699c6d8509f37a00082221e8--inspo-home-cinamatic.netlify.app/"
                className={`preview-link ember-glow-calm ${seasonKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                🌌 Galaxy Stars Version
              </a>

              <div className="section-divider"></div>

              <div id="footer">
                <p className="inspo-quote fade_on_scroll">
                  "The only way to do great work is to love what you do." ~ Steve Jobs ~
                </p>
              </div>

              <div className="siteFooter">
                <p>Made with care by Sara for KUK @ 2026</p>
              </div>

              <div className="section-divider"></div>

              <div className="social-icons">
                <div className="social-links">
                  <a href="https://instagram.com/so.co13" target="_blank" rel="noopener noreferrer" className="social-icon instagram">Instagram</a>
                  <a href="https://facebook.com/sara.J.oliver.7" target="_blank" rel="noopener noreferrer" className="social-icon facebook">Facebook</a>
                </div>
              </div>

            </footer>

          </div>
          {/* END APP CONTENT */}

        </div>
        {/* END APP SHELL */}

      </div>
      {/* END APP BODY */}

    </div>
    {/* END APP CONTAINER */}

  </>
)

}


export default App