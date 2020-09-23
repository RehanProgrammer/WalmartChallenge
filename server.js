const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

let rawdata = fs.readFileSync("config.json");
let config = JSON.parse(rawdata);

function updateConfigChecker(obj) {
  let changed = false;
  for (let key of Object.keys(obj)) {
    if (key in config) {
      if (key == "port" || key == "host") {
        continue;
      } else {
        config[key] = obj[key];
        const jsonString = JSON.stringify(config);
        fs.writeFile("./config.json", jsonString, (err) => {
          if (err) {
            console.log("Error writing file", err);
          } else {
            console.log("Successfully wrote file");
          }
        });
        changed = true;
      }
    }
  }
  return changed;
}

app.listen(config.port, config.host, () => {
  console.log(
    `server running on port: ${config.port} and on server: ${config.host}`
  );
});

app.get("/config", (req, res) => {
  res.status(200).send(config);
});

app.put("/config", (req, res) => {
  let body = req.body;

  if (!updateConfigChecker(body)) {
    res.status(400).send("error: nothing changed");
  } else res.send(config);
});
 