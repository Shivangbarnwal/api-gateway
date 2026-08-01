import http from "node:http";

export function request({
    path,
    method = "GET",
    token = "user-token",
    body = null,
}) {
    return new Promise((resolve, reject) => {

        const req = http.request(
            {
                hostname: "localhost",
                port: 8080,
                path,
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
            (res) => {

                let response = "";

                res.on("data", chunk => {
                    response += chunk;
                });

                res.on("end", () => {

                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: response,
                    });

                });

            }
        );

        req.on("error", reject);

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();

    });
}