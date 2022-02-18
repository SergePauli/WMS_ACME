const express = require("express")
const mRouter = require("./routes/main.route")
const cors = require("cors")
const config = require("config")
const app = express()
const WIHTE_LIST = config.get("origins")
const corsOptions = {
  origin: WIHTE_LIST,
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers",
    "X-Requested-With",
  ],
  enablePreflight: true,
}
app.use(cors(corsOptions))
app.options("*", cors(corsOptions))
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
