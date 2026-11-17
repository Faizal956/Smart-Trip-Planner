import { NETWORK_EDGES } from '../data/graphData';
import { DESTINATIONS } from '../data/destinations';

/**
 * Builds an adjacency list from NETWORK_EDGES (undirected graph)
 */
export function buildAdjacencyList() {
  const adj = {};
  DESTINATIONS.forEach(dest => {
    adj[dest.id] = [];
  });

  NETWORK_EDGES.forEach(edge => {
    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];

    adj[edge.from].push({
      node: edge.to,
      weight: edge.weight,
      highway: edge.highway
    });

    adj[edge.to].push({
      node: edge.from,
      weight: edge.weight,
      highway: edge.highway
    });
  });

  return adj;
}

/**
 * Dijkstra's Shortest Path Algorithm
 * Returns shortest path, total distance, visited nodes, step-by-step trace table, and complexities.
 */
export function runDijkstra(startNodeId, targetNodeId) {
  const adj = buildAdjacencyList();
  const allNodes = Object.keys(adj);

  const distances = {};
  const previous = {};
  const unvisited = new Set(allNodes);
  const steps = []; // Step-by-step log for visualization
  let comparisons = 0;
  let relaxations = 0;

  // Step 1: Initialize distances
  allNodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startNodeId] = 0;

  steps.push({
    stepNumber: 0,
    currentNode: startNodeId,
    description: `Initialized all vertices with ∞ distance. Set source "${startNodeId}" distance = 0 km.`,
    tableSnapshot: { ...distances },
    visitedSnapshot: []
  });

  const visitedNodesList = [];

  while (unvisited.size > 0) {
    // Extract min distance node from unvisited set
    let currentNode = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      comparisons++;
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    }

    // If unreachable or all remaining nodes have infinity distance, break
    if (currentNode === null || minDistance === Infinity) {
      break;
    }

    unvisited.delete(currentNode);
    visitedNodesList.push(currentNode);

    const neighbors = adj[currentNode] || [];
    const relaxedInThisStep = [];

    // Relax all edges from currentNode
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor.node)) {
        const alt = distances[currentNode] + neighbor.weight;
        comparisons++;
        if (alt < distances[neighbor.node]) {
          relaxations++;
          const oldDist = distances[neighbor.node];
          distances[neighbor.node] = alt;
          previous[neighbor.node] = currentNode;
          relaxedInThisStep.push({
            neighbor: neighbor.node,
            oldDist: oldDist === Infinity ? '∞' : `${oldDist} km`,
            newDist: `${alt} km`,
            edgeWeight: neighbor.weight,
            highway: neighbor.highway
          });
        }
      }
    }

    steps.push({
      stepNumber: steps.length,
      currentNode,
      currentDist: minDistance,
      relaxedNeighbors: relaxedInThisStep,
      description: relaxedInThisStep.length > 0
        ? `Visited ${currentNode} (${minDistance} km). Relaxed ${relaxedInThisStep.length} neighbor(s): ${relaxedInThisStep.map(r => `${r.neighbor} (${r.oldDist} → ${r.newDist})`).join(', ')}.`
        : `Visited ${currentNode} (${minDistance} km). No shorter routes found for adjacent vertices.`,
      tableSnapshot: { ...distances },
      visitedSnapshot: [...visitedNodesList]
    });

    // If we've reached our destination, we can record but continue or stop
    if (currentNode === targetNodeId) {
      break;
    }
  }

  // Reconstruct path
  const path = [];
  let curr = targetNodeId;
  const pathDetails = [];

  if (distances[targetNodeId] !== Infinity) {
    while (curr) {
      path.unshift(curr);
      const prev = previous[curr];
      if (prev) {
        const edge = (adj[prev] || []).find(e => e.node === curr);
        pathDetails.unshift({
          from: prev,
          to: curr,
          distance: edge ? edge.weight : 0,
          highway: edge ? edge.highway : 'Direct route'
        });
      }
      curr = prev;
    }
  }

  return {
    success: distances[targetNodeId] !== Infinity,
    source: startNodeId,
    destination: targetNodeId,
    totalDistance: distances[targetNodeId],
    path,
    pathDetails,
    steps,
    metrics: {
      comparisons,
      relaxations,
      nodesVisitedCount: visitedNodesList.length,
      totalGraphNodes: allNodes.length,
      timeComplexity: "O((V + E) log V)",
      spaceComplexity: "O(V + E)"
    }
  };
}
