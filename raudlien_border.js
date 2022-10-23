const fetch = require("node-fetch");
const raudlien = require("./raudlio.json");
const config = require("./config.json");

let sessionId = config.kartVerketSessionId;

postLineString(raudlien.features[0]);

async function postLineString(feature) {
  const lineString = await transformWkt(feature.geometry.coordinates);
  if (lineString != undefined) {
    postLine(lineString);
  }
}

async function postLine(lineString) {
  const response = fetch(
    "https://norgeskart.avinet.no/WebServices/client/DataView.asmx/Save",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json; charset=UTF-8",
        gm_lang_code: "en",
        gm_session_id: sessionId,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-adaptive-gui": "9f63bcd4-f3a4-44dc-961b-701570f89e46",
        "x-adaptive-srid": "32633",
        "x-requested-with": "XMLHttpRequest",
        cookie: "lng=en",
        Referer: "https://norgeskart.avinet.no/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body:
        '{"theme_uuid":"61da34e7-6c68-4841-9248-389a07a7861d","data":{"geom":null,"auto_length":null,"geom_wkt":"' +
        lineString +
        '","media_files":0,"_editable":false,"_historical":false,"date_created":null,"date_modified":null,"created_by":null,"modified_by":null,"uuid":null,"route_name":"Raulien border","route_description":null,"user_create_date":null,"user_modify_date":null,"id":null,"geom_modified":true}}',
      method: "POST",
    }
  );

  if ((response.status = 200)) {
    console.log("success on border!");
  } else {
    console.log("error on border!");
  }
}

async function transformWkt(coordinates) {
  let str = "";
  let i = 0;

  coordinates.forEach((coord) => {
    if (i != 0) str = str + ",";
    str = str + coord[0] + " " + coord[1];
    i++;
  });

  const result = await fetch(
    "https://norgeskart.avinet.no/WebServices/generic/SpatialOperations.asmx/TransformWkt",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json; charset=UTF-8",
        gm_lang_code: "en",
        gm_session_id: sessionId,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-adaptive-gui": "9f63bcd4-f3a4-44dc-961b-701570f89e46",
        "x-adaptive-srid": "32633",
        "x-requested-with": "XMLHttpRequest",
        cookie: "lng=en",
        Referer: "https://norgeskart.avinet.no/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body:
        '{"wkt":"LINESTRING(' + str + ')","fromEpsg":"4258","toEpsg":"32633"}',
      method: "POST",
    }
  );

  const data = await result.json();

  if (data != undefined) {
    // console.log(data.d.data[0].value);
    return data.d.data[0].value;
  }
}
