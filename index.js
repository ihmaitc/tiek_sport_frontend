const axios = require("axios");
const fs = require("fs");
const latn = require("./latn/latnToCyril");

async function fetchUrl() {
  const res = await axios.get("https://opensheet.elk.sh/1XOI_hiwB8n9Wy-PZKwGvFUpKKPQSgYCaqpEgBbszsNk/imp");
  const data = res.data.map((obj) => Object.values(obj));
  var keys = data.map((row) => row[0]);
  var locales = res.data.map((obj) => Object.keys(obj))[0].slice(1);

  var localeData = {};
  locales.forEach((locale) => {
    localeData[locale] = {};
  });
  localeData = {
    ...localeData,
    ["uz_cyrl"]: {}
  };

  function setNestedProperty(obj, path, value, type) {
    var keys = path.split(/[\.\[\]]/).filter((key) => key);
    while (keys.length > 1) {
      var key = keys.shift();
      if (!obj[key]) {
        obj[key] = isNaN(keys[1]) ? {} : [];
      }
      obj = obj[key];
    }
    if (type === "cyrl") {
      obj[keys[0]] = latn.processString(value);
    } else {
      obj[keys[0]] = value;
    }
  }

  for (var i = 0; i < locales.length; i++) {
    var locale = locales[i];
    for (var j = 0; j < data.length; j++) {
      var key = keys[j];
      if (key) {
        var translation = data[j][i + 1];
        if (locale === "oz") {
          setNestedProperty(localeData["uz_cyrl"], key, parseValue(translation), "cyrl");
        }
        setNestedProperty(localeData[locale], key, parseValue(translation));
      }
    }
  }

  Object.entries(localeData).forEach(([key, value]) => {
    const way = key === "oz" ? "uz_latn" : key;
    fs.writeFile(`./src/app/config/i18n/locales/${way}.json`, JSON.stringify(value, null, 2), (err) => {});
  });

  return JSON.stringify(localeData, null, 2);
}

function parseValue(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

fetchUrl();
