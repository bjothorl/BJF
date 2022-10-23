const fetch = require("node-fetch");
const fs = require("fs");
var parser = require("xml2json");
// const parser = require("gpx-parse");
const config = require("./config.json");

fetch("https://api.wehuntapp.com/v1/areas/4651853261570048/map/export", {
  headers: {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.8",
    authorization: "Bearer " + config.wehuntToken,
    "content-type": "application/json;charset=UTF-8",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    Referer: "https://app.wehuntapp.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
  body: '{"boundary":true,"subAreas":true,"forbiddenAreas":true,"markers":true}',
  method: "POST",
})
  .then(
    (res) =>
      new Promise((resolve, reject) => {
        const dest = fs.createWriteStream("./raudlio_download.gpx");
        res.body.pipe(dest);
        res.body.on("end", () => resolve());
        dest.on("error", reject);
      })
  )
  .then(() => {
    const gpx = fs.readFileSync("./raudlio_download.gpx");

    // using xml parser
    const json = parser.toJson(gpx);
    fs.writeFileSync("./raudlio_download.json", json);

    // using gpx parser:
    // parser.parseGpx(gpx, (err, data) => {
    //   fs.writeFileSync("./raudlio_download.json", JSON.stringify(data));
    // });
  });
