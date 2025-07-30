import { useState } from 'react'
import './App.css'
const App = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  const fetchWeather = async () => {
    if (!city) return

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )

      if (!res.ok) {
        throw new Error('城市找不到')
      }

      const data = await res.json()
      setWeather(data)
      setError(null)
    } catch (err) {
      setWeather(null)
      setError(err.message)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🌦️ 天气查询</h1>
      <input
        type="text"
        placeholder="请输入城市名（例如 Taipei）"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather} style={{ marginLeft: '10px' }}>
        查询天气
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h2>{weather.name}</h2>
          <p>🌡️ 温度：{weather.main.temp}°C</p>
          <p>☁️ 天气：{weather.weather[0].description}</p>
          <p>💧 湿度：{weather.main.humidity}%</p>
        </div>
      )}
    </div>
  )
}

export default App