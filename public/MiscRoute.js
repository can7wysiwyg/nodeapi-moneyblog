const MiscRoute = require('express').Router()
const weather_key = process.env.WEATHER_API_KEY


MiscRoute.get('/misc/weather', async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ msg: "City is required" });

    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${weather_key}&q=${city}&aqi=no`
    );

    const data = await response.json();

    res.json({ data });
  } catch (error) {
    console.log("Weather fetch error:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});




module.exports = MiscRoute