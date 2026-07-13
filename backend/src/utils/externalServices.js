const https = require("https");

const withTimeout = (promise, timeoutMs = 4000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Timeout")), timeoutMs);
  });

  return Promise.race([
    promise,
    timeoutPromise,
  ]).finally(() => clearTimeout(timeoutId));
};

const geocodeAddress = async (address) => {
  if (!address) {
    return { ok: false, reason: "Address missing" };
  }

  const encoded = encodeURIComponent(address);
  const options = {
    hostname: "nominatim.openstreetmap.org",
    path: `/search?q=${encoded}&format=json&limit=1`,
    method: "GET",
    headers: { "User-Agent": "SICPES/1.0" },
  };

  try {
    const response = await withTimeout(new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      });
      req.on("error", reject);
      req.end();
    }));

    const first = Array.isArray(response) ? response[0] : null;
    return first ? { ok: true, lat: first.lat, lon: first.lon } : { ok: false, reason: "No geocoding result" };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
};

const fetchExchangeRate = async (currency = "USD") => {
  const endpoint = `https://api.exchangerate.host/latest?base=MXN&symbols=${currency}`;

  try {
    const response = await withTimeout(fetch(endpoint).then((res) => res.json()));
    return response?.rates?.[currency] ? { ok: true, rate: response.rates[currency] } : { ok: false, reason: "No rate found" };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
};

module.exports = {
  geocodeAddress,
  fetchExchangeRate,
};
