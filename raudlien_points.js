const fetch = require("node-fetch");
const raudlien = require("./raudlio.json");
const config = require("./config.json");

let sessionId = config.sessionId;

postPoint(raudlien.features, 1);

async function postPoint(features, i) {
  const position = await transformWkt(
    features[i].geometry.coordinates[0],
    features[i].geometry.coordinates[1]
  );
  const response = await fetch(
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
        '{"theme_uuid":"32732124-b248-4507-abef-c4daef56c11b","data":{"geom":null,"wkt_height":0,"geom_wkt":"' +
        position +
        '","media_files":0,"_editable":false,"_historical":false,"date_created":null,"date_modified":null,"created_by":null,"modified_by":null,"uuid":null,"poi_name":"' +
        features[i].properties.name +
        '","poi_description":"' +
        features[i].properties.desc +
        '","poi_category":"None","user_create_date":null,"user_modify_date":null,"id":null,"geom_modified":true}}',
      method: "POST",
    }
  );

  if ((response.status = 200)) {
    console.log("success on: " + features[i].properties.name);
  } else {
    console.log("error on: " + features[i].properties.name);
  }

  if (i < features.length - 1) {
    console.log("starting: " + (i + 1) + "/" + features.length);
    await postPoint(features, i + 1);
  } else {
    return 0;
  }
}

async function transformWkt(long, lat) {
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
        '{"wkt":"POINT(' +
        long +
        " " +
        lat +
        ')","fromEpsg":"4258","toEpsg":"32633"}',
      method: "POST",
    }
  );

  const data = await result.json();

  if (data != undefined) {
    // console.log(data.d.data[0].value);
    return data.d.data[0].value;
  }
}
