const URL = "http://localhost:8080/users";

const TOTAL_REQUESTS = 1000;
const CONCURRENCY = 50;

const counts = {};

async function worker(requestsPerWorker) {
  for (let i = 0; i < requestsPerWorker; i++) {
    try {
      const response = await fetch(URL, {
        headers: {
          Authorization: "Bearer user-token",
        },
      });

      const data = await response.json();

      const instance = data.instance;

      counts[instance] = (counts[instance] ?? 0) + 1;
    } catch (err) {
      console.error(err.message);
    }
  }
}

async function main() {
  console.log(`Running ${TOTAL_REQUESTS} requests...\n`);

  const start = Date.now();

  const perWorker = Math.floor(TOTAL_REQUESTS / CONCURRENCY);

  const workers = [];

  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker(perWorker));
  }

  await Promise.all(workers);

  const elapsed = Date.now() - start;

  console.log("\nDistribution:");
  console.table(counts);

  const total = Object.values(counts).reduce(
    (a, b) => a + b,
    0
  );

  console.log("Percentages:");

  for (const [instance, count] of Object.entries(counts)) {
    console.log(
      `${instance}: ${((count / total) * 100).toFixed(2)}%`
    );
  }

  console.log(`\nCompleted in ${elapsed} ms`);
}

main();