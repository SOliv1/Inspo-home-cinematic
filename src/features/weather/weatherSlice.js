import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentWeather } from '../../api';

// UK-style date in GMT
function formatDate(now = new Date()) {
  return now.toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatTime(now = new Date()) {
  return now.toLocaleTimeString("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Thunk: load real weather from OpenWeather
export const loadWeather = createAsyncThunk(
  'weather/loadWeather',
  async (city = 'Evesham,GB') => {
    const data = await fetchCurrentWeather(city);

    const tempC = Math.round(data.main.temp);
    const tempF = Math.round((tempC * 9) / 5 + 32);
    const condition = data.weather?.[0]?.description || 'unknown';
    const cityName = `${data.name}, ${data.sys?.country || ''}`.trim();

    return {
      city: cityName,
      tempC,
      tempF,
      condition,
      detail: `Feels like ${Math.round(
        data.main.feels_like
      )} °C • Humidity ${data.main.humidity}%`,
      // ⭐ NEW: include the icon code from the API
      icon: data.weather?.[0]?.icon || "01d",
    };

  }

);

const now = new Date();

const initialState = {
  // basic placeholders until API loads
  city: 'Loading weather…',
  tempC: 0,
  tempF: 32,
  condition: 'unknown',
  detail: '',
  date: formatDate(now),
  time: formatTime(now),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

  icon: "01d", // default to clear day icon
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    tickTime(state) {
      const now = new Date();
      state.time = formatTime(now);
      state.date = formatDate(now);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWeather.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.city = action.payload.city;
        state.tempC = action.payload.tempC;
        state.tempF = action.payload.tempF;
        state.condition = action.payload.condition;
        state.detail = action.payload.detail;

        // ⭐ NEW: store the icon code in Redux
        state.icon = action.payload.icon;
      })
      .addCase(loadWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load weather';
      });
  },
});
export const { tickTime } = weatherSlice.actions;
export default weatherSlice.reducer;
