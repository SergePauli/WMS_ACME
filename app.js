const express = require("express")
const mRouter = require("./routes/main.route")
const config = require("config")
const app = express()
app.use(express.json({ extended: true }))
app.use("/", mRouter) // задаем префиксы путей для запросов

const PORT = config.get("port") || 5005 // если не определен, то 5005
async function start() {
  // стартуем
  try {
    app.listen(PORT, () => console.log(`app started at port: ${PORT}...`))
  } catch (e) {
    console.log("server error:", e.message)
    process.exit(1)
  }
}
start()
