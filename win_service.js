// Требует установки модуля npm install -g node-windows
import { Service } from "node-windows"

// Create a new service object
var svc = new Service({
  name: "ACME",
  description: "REST-full cервис для работы с модулем ACME.",
  script: "C:\\WMS_ACME\\app.js",
})

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  svc.start()
})

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on("start", function () {
  console.log(svc.name + " started!\nVisit http://127.0.0.1:5050 to see it in action.")
})

// Install the script as a service.
svc.install()
