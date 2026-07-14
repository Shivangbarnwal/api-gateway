import http from "node:http";

export async function testProxy() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 8001,
        path: "/",
        method: "GET",
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      }
    );

    req.on("error", reject);

    req.end();
  });
}