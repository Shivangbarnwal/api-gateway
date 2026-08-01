import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

function request(path, token = "user-token") {
    return new Promise((resolve, reject) => {
        const req = http.request(
            {
                hostname: "localhost",
                port: 8080,
                path,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            (res) => {
                let body = "";

                res.on("data", chunk => body += chunk);

                res.on("end", () => {
                    resolve({
                        status: res.statusCode,
                        body,
                    });
                });
            }
        );

        req.on("error", reject);
        req.end();
    });
}

test("successful request reaches backend", async () => {

    const response = await request("/users");

    assert.equal(response.status, 200);

    assert.match(
        response.body,
        /users/
    );
});