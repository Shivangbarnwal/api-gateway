import { RoundRobin } from "./algorithms/roundRobin.js";
import { LeastConnections } from "./algorithms/leastConnections.js";
import { RandomStrategy } from "./algorithms/random.js";

export function createStrategy(name) {
  switch (name) {
    case "roundRobin":
      return new RoundRobin();

    case "leastConnections":
      return new LeastConnections();

    case "random":
      return new RandomStrategy();

    default:
      throw new Error(
        `Unknown load balancing strategy: ${name}`
      );
  }
}