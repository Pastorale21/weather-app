import { useState } from 'react'
import './App.css'

const App = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState(null)

  const fetchWeather = async () => {
    if (!city) return

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=zh_tw`
      )
      if (!weatherRes.ok) throw new Error('当前天气城市找不到')
      const weatherData = await weatherRes.json()
      setWeather(weatherData)

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=zh_tw`
      )
      if (!forecastRes.ok) throw new Error('预报城市找不到')
      const forecastData = await forecastRes.json()

      const dailyForecasts = forecastData.list.filter(item =>
        item.dt_txt.includes('12:00:00')
      ).slice(0, 3)

      setForecast(dailyForecasts)
      setError(null)
    } catch (err) {
      setWeather(null)
      setForecast([])
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1>🌦️ 天气查询</h1>
      <input
        type="text"
        placeholder="请输入城市名（例如 Taipei）"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>查询天气</button>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-now">
          <h2>{weather.name}</h2>
          <p>🌡️ 温度：{weather.main.temp}°C</p>
          <p>☁️ 天气：{weather.weather[0].description}</p>
          <p>💧 湿度：{weather.main.humidity}%</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <div className="forecast-title">📅 三天天气预报</div>
          <div className="forecast-grid">
            {forecast.map((item, idx) => (
              <div key={idx} className="forecast-card">
                <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="icon"
                />
                <p>{item.weather[0].description}</p>
                <p>{item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App