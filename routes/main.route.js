const express = require("express")
const fs = require("fs")
const { spawn } = require("child_process")
const cors = require("cors")
const config = require("config")
const { nanoid } = require("nanoid")
const router = express.Router()
const WIHTE_LIST = config.get("origins")

//разрешаем доступ к POST только для запросов
//с frontend-серверов
const corsOptions = {
  origin: function (origin, callback) {
    if (WIHTE_LIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}

// define the home page route
router.get("/", cors(corsOptions), function (req, res) {
  res.send("<h1>ACME API microservice  home page</h1> <br/> ")
})

// define ACME reuest route
router.post("/useACME", cors(corsOptions), async (req, res) => {
  // вызываем с преобработкой
  console.log("request runed")
  try {
    const { data_AIN } = req.body
    if (!data_AIN) {
      console.log("empty AIN")
      res.status(500).json({ message: "empty AIN" })
      return
    }
    const PATH_ACME_EXE = config.get("PATH_ACME_EXE")
    const PATH_ACME_BASE = config.get("PATH_ACME_BASE")
    const FILENAME = nanoid(7)
    // nanoid() //генерим имя файла
    fs.writeFile(PATH_ACME_BASE + FILENAME + ".AIN", data_AIN, "utf8", (err) => {
      // пишем входной файл
      if (err) throw err
      console.log(".AIN-file successfully created")
      // запускаем ACME
      const bat = spawn("cmd.exe", ["/c", PATH_ACME_EXE, PATH_ACME_BASE + FILENAME + ".AIN"])
      // выводим ошибки запуска
      bat.stderr.on("data", (data) => {
        console.error(data.toString())
      })
      bat.on("exit", (code) => {
        // читаем файл выходной .TIN-файл
        if (code === 0) {
          fs.readFile(PATH_ACME_BASE + FILENAME + ".TIN", "utf8", (err, data_TIN) => {
            if (err) throw err
            //чистим каталог от временных файлов
            const bat2 = spawn("cmd.exe", ["/c", "del /Q", PATH_ACME_BASE + FILENAME + ".*"])
            bat2.stderr.on("data2", (data2) => {
              console.error(data2.toString())
            })
            res.json({ data_TIN: data_TIN })
          })
        } else res.status(500).json({ message: `err in useACME: exit code is ${code}` })
      })
    })
  } catch (e) {
    console.log("err in useACME", e.message)
    res.status(500).json({ message: "err in useACME:" + e.message })
  }
})
module.exports = router
