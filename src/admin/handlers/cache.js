import cache from "../../cache/index.js";


export function getCache(req, res) {

  const response = {
    entries: cache.size(),
  };

  res.statusCode = 200;
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.end(
    JSON.stringify(response, null, 2)
  );
}


export function clearCache(req, res) {

  cache.clear();

  res.statusCode = 200;
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.end(
    JSON.stringify({
      message: "Cache cleared",
    }, null, 2)
  );
}