import { getDistance } from '../data/graphData';
import { DESTINATIONS } from '../data/destinations';

/**
 * Solves the Travelling Salesman Problem using Dynamic Programming with Bitmasking (Held-Karp).
 *
 * @param {string[]} destinationIds - Array of destination IDs to visit (e.g. ['pune', 'goa', 'mumbai', 'lonavala'])
 * @param {boolean} returnToStart - Whether the trip returns to starting destination
 */
export function solveTSP(destinationIds, returnToStart = true) {
  const n = destinationIds.length;

  if (n <= 1) {
    return {
      success: true,
      optimizedOrder: destinationIds,
      optimizedDistance: 0,
      originalOrder: destinationIds,
      originalDistance: 0,
      distanceSaved: 0,
      percentSaved: 0,
      steps: ["Single destination selected. No route optimization needed."],
      dpTableSize: 1,
      metrics: {
        timeComplexity: "O(n² · 2ⁿ)",
        spaceComplexity: "O(n · 2ⁿ)",
        statesComputed: 1
      }
    };
  }

  // 1. Build distance matrix for the selected subset
  const distMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        distMatrix[i][j] = getDistance(destinationIds[i], destinationIds[j]);
      }
    }
  }

  // 2. Compute Original Route Distance (Order as selected by user)
  let originalDistance = 0;
  for (let i = 0; i < n - 1; i++) {
    originalDistance += distMatrix[i][i + 1];
  }
  if (returnToStart) {
    originalDistance += distMatrix[n - 1][0];
  }

  // 3. Dynamic Programming with Bitmasking
  // mask: integer where bit k represents whether city k is visited
  // dp[mask][i]: minimum distance to visit set of cities in `mask`, ending at city `i`
  const numStates = 1 << n;
  const dp = Array.from({ length: numStates }, () => Array(n).fill(Infinity));
  const parent = Array.from({ length: numStates }, () => Array(n).fill(-1));

  // Base case: Starting at city 0 (mask = 1)
  dp[1][0] = 0;

  let statesComputed = 0;
  const executionLogs = [];

  for (let mask = 1; mask < numStates; mask++) {
    // Only consider states where starting city (bit 0) is visited
    if ((mask & 1) === 0) continue;

    for (let u = 0; u < n; u++) {
      if ((mask & (1 << u)) === 0) continue; // City u must be in mask
      if (dp[mask][u] === Infinity) continue;

      // Try extending route to next unvisited city v
      for (let v = 0; v < n; v++) {
        if ((mask & (1 << v)) === 0) { // City v not yet visited
          const nextMask = mask | (1 << v);
          const newDist = dp[mask][u] + distMatrix[u][v];
          statesComputed++;

          if (newDist < dp[nextMask][v]) {
            dp[nextMask][v] = newDist;
            parent[nextMask][v] = u;
          }
        }
      }
    }
  }

  // 4. Find the optimal final node
  const fullMask = (1 << n) - 1;
  let minCost = Infinity;
  let lastNode = -1;

  if (returnToStart) {
    for (let i = 1; i < n; i++) {
      const totalCost = dp[fullMask][i] + distMatrix[i][0];
      if (totalCost < minCost) {
        minCost = totalCost;
        lastNode = i;
      }
    }
  } else {
    for (let i = 0; i < n; i++) {
      if (dp[fullMask][i] < minCost) {
        minCost = dp[fullMask][i];
        lastNode = i;
      }
    }
  }

  // 5. Path Reconstruction using parent pointers
  const pathIndices = [];
  let currMask = fullMask;
  let currNode = lastNode;

  while (currNode !== -1 && currNode !== undefined) {
    pathIndices.unshift(currNode);
    const prevNode = parent[currMask][currNode];
    currMask = currMask ^ (1 << currNode);
    currNode = prevNode;
  }

  // Ensure start node 0 is in front
  if (pathIndices.length === 0 || pathIndices[0] !== 0) {
    if (!pathIndices.includes(0)) {
      pathIndices.unshift(0);
    }
  }

  const optimizedOrder = pathIndices.map(idx => destinationIds[idx]);
  if (returnToStart) {
    optimizedOrder.push(destinationIds[0]);
  }

  const originalOrder = [...destinationIds];
  if (returnToStart) {
    originalOrder.push(destinationIds[0]);
  }

  const distanceSaved = Math.max(0, originalDistance - minCost);
  const percentSaved = originalDistance > 0 ? Math.round((distanceSaved / originalDistance) * 100) : 0;

  // Approximate fuel and driving hours saved
  // Standard car mileage = 15 km/liter, fuel = Rs 104/L, avg speed = 55 km/h
  const fuelSavedLiters = (distanceSaved / 15).toFixed(1);
  const moneySavedRs = Math.round((distanceSaved / 15) * 104);
  const hoursSaved = (distanceSaved / 55).toFixed(1);

  // Generate readable steps
  const steps = [
    `Total cities to optimize: ${n} (${destinationIds.join(" → ")})`,
    `Number of bitmask subsets explored: 2^${n} = ${numStates} states.`,
    `DP Transition: dp(mask | {v}, v) = min(dp(mask, u) + dist(u, v)) for all u in mask.`,
    `Evaluated ${statesComputed} state transitions in O(n² · 2ⁿ) time complexity.`,
    `Original Route Distance: ${originalDistance} km`,
    `Optimized Route Distance: ${minCost} km`,
    `Net Distance Reduction: ${distanceSaved} km (${percentSaved}% optimization achieved).`
  ];

  return {
    success: true,
    destinationIds,
    returnToStart,
    originalOrder,
    originalDistance,
    optimizedOrder,
    optimizedDistance: minCost,
    distanceSaved,
    percentSaved,
    fuelSavedLiters,
    moneySavedRs,
    hoursSaved,
    steps,
    dpTableSize: `${numStates} × ${n}`,
    metrics: {
      timeComplexity: "O(n² · 2ⁿ)",
      spaceComplexity: "O(n · 2ⁿ)",
      statesComputed,
      bruteForcePermutations: factorial(n - 1)
    }
  };
}

function factorial(num) {
  let res = 1;
  for (let i = 2; i <= num; i++) res *= i;
  return res;
}
