import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  Route,
  Share2,
  Coins,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  HelpCircle,
  Code2,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Calculator
} from 'lucide-react';

const ALGO_TABS = [
  { id: 'dijkstra', name: "Dijkstra's Shortest Path", category: 'Graph Theory', icon: Route },
  { id: 'tsp', name: 'Travelling Salesman (TSP)', category: 'Dynamic Programming + Bitmask', icon: Share2 },
  { id: 'knapsack', name: '0/1 Knapsack Budget', category: 'Dynamic Programming', icon: Coins },
  { id: 'greedy', name: 'Greedy Recommender', category: 'Greedy Heuristic', icon: Sparkles },
  { id: 'sorting', name: 'Sorting Benchmark', category: 'Divide & Conquer vs Brute', icon: ArrowUpDown },
];

const ALGORITHM_DETAILS = {
  dijkstra: {
    title: "Dijkstra's Algorithm (Single-Source Shortest Path)",
    problemStatement: "Given a weighted graph G = (V, E) with non-negative edge weights w(u, v) >= 0 and a source vertex s, determine the shortest path from s to all other vertices.",
    strategy: "Greedy Strategy with Min-Priority Queue. At each step, extract the vertex with the minimum tentative distance, finalize its shortest distance, and relax all outgoing adjacent edges.",
    recurrence: "dist[v] = min(dist[v], dist[u] + weight(u, v))",
    pseudocode: `function Dijkstra(Graph, source):
  dist = array of size V filled with ∞
  prev = array of size V filled with null
  dist[source] = 0
  Q = MinPriorityQueue containing all vertices V

  while Q is not empty:
    u = Q.extractMin()
    for each neighbor v of u:
      alt = dist[u] + weight(u, v)
      if alt < dist[v]:
        dist[v] = alt
        prev[v] = u
        Q.decreaseKey(v, alt)
  return dist, prev`,
    timeComplexity: {
      best: "O((V + E) log V)",
      average: "O((V + E) log V)",
      worst: "O(V²) with array, O((V + E) log V) with Min-Heap",
      note: "Using Fibonacci Heap achieves O(E + V log V)"
    },
    spaceComplexity: "O(V + E) for adjacency list + distances and predecessor arrays.",
    vivaQuestions: [
      {
        q: "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
        a: "Dijkstra operates greedily on the assumption that once a vertex is extracted from the priority queue (visited), its shortest path is permanently finalized. A negative edge encountered later could reduce the distance to an already-finalized vertex, which Dijkstra never revisits. For negative edges, Bellman-Ford O(V·E) must be used."
      },
      {
        q: "What is the edge relaxation step in Dijkstra?",
        a: "Edge relaxation checks if traversing through the currently examined vertex 'u' to reach neighbor 'v' yields a shorter distance than the previously known shortest distance to 'v'. If dist[u] + w(u, v) < dist[v], then dist[v] is updated."
      },
      {
        q: "How does our Smart Trip Planner use Dijkstra?",
        a: "We represent Indian tourist cities as vertices and National Highway transit corridors (NH48, NH44, NH66, expressways) as weighted edges with actual kilometer distances, calculating point-to-point shortest highway routes."
      }
    ]
  },
  tsp: {
    title: "Travelling Salesman Problem (Held-Karp DP with Bitmasking)",
    problemStatement: "Given a list of cities and the distances between each pair of cities, find the shortest possible route that visits each city exactly once and returns to the origin city.",
    strategy: "Dynamic Programming with Bitmasking (Held-Karp). Instead of evaluating all (n - 1)! permutations via brute force, we solve subproblems: dp(mask, u) representing the minimum distance to visit the subset of cities in 'mask' ending at city 'u'.",
    recurrence: "dp(mask, v) = min_{u ∈ mask, u ≠ v} { dp(mask \\ {v}, u) + dist(u, v) }",
    pseudocode: `function HeldKarpTSP(cities, distMatrix):
  n = cities.length
  dp = 2D array of size [2^n][n] filled with ∞
  dp[1][0] = 0 // start at city 0 with mask 00...001

  for mask from 1 to (2^n - 1):
    if city 0 not in mask: continue
    for u in cities:
      if u not in mask: continue
      for v in cities:
        if v in mask: continue
        nextMask = mask | (1 << v)
        dp[nextMask][v] = min(dp[nextMask][v], dp[mask][u] + distMatrix[u][v])

  return min_{i=1..n-1} (dp[(2^n)-1][i] + distMatrix[i][0])`,
    timeComplexity: {
      best: "O(n² · 2ⁿ)",
      average: "O(n² · 2ⁿ)",
      worst: "O(n² · 2ⁿ)",
      note: "Exponential reduction compared to Brute Force O(n!)"
    },
    spaceComplexity: "O(n · 2ⁿ) table to store memoized subproblem distances and parent pointers.",
    vivaQuestions: [
      {
        q: "Why is TSP considered NP-Hard?",
        a: "TSP decision version is in NP and any problem in NP can be reduced to it (Hamiltonian Cycle problem reduces directly to TSP). No known polynomial-time algorithm exists to solve it exactly for general graphs."
      },
      {
        q: "How does Bitmasking represent subsets?",
        a: "An integer bitmask uses the binary representation where the k-th bit is 1 if city k is visited, and 0 if unvisited. For n cities, 2^n unique integers from 0 to 2^n - 1 represent all possible subsets, allowing O(1) bitwise operations (mask | (1 << v))."
      },
      {
        q: "What is the practical limit of Held-Karp?",
        a: "Around n = 20 to 22 cities. For n = 8 cities in our planner, 2^8 = 256 subsets and 256 * 8 = 2,048 states, running in under 2 milliseconds!"
      }
    ]
  },
  knapsack: {
    title: "0/1 Knapsack Problem (Dynamic Programming)",
    problemStatement: "Given a budget capacity W and n attractions, each with cost w_i and popularity value v_i, select a subset of attractions such that total cost does not exceed W and total popularity value is maximized. Each attraction can either be taken (1) or left (0).",
    strategy: "Dynamic Programming. Construct an (n + 1) × (W + 1) matrix where subproblem dp[i][w] represents optimal value considering first i items with capacity w.",
    recurrence: "dp[i][w] = max( dp[i - 1][w], dp[i - 1][w - cost[i]] + value[i] )",
    pseudocode: `function Knapsack01(items, budget):
  n = items.length
  dp = 2D array of size [n + 1][budget + 1] filled with 0

  for i from 1 to n:
    for w from 0 to budget:
      dp[i][w] = dp[i - 1][w] // Exclude item
      if items[i - 1].cost <= w:
        withItem = dp[i - 1][w - items[i - 1].cost] + items[i - 1].value
        dp[i][w] = max(dp[i][w], withItem) // Include item

  // Traceback to identify selected items
  selected = []
  currW = budget
  for i from n down to 1:
    if dp[i][currW] != dp[i - 1][currW]:
      selected.add(items[i - 1])
      currW -= items[i - 1].cost
  return dp[n][budget], selected`,
    timeComplexity: {
      best: "O(n · W)",
      average: "O(n · W)",
      worst: "O(n · W)",
      note: "Pseudo-polynomial time complexity (polynomial in numeric value W, exponential in input length)"
    },
    spaceComplexity: "O(n · W) for full 2D table, or O(W) if only returning maximum value using 1D state array.",
    vivaQuestions: [
      {
        q: "What is the difference between 0/1 Knapsack and Fractional Knapsack?",
        a: "In 0/1 Knapsack, items are discrete (you either visit the attraction completely or not at all). It requires Dynamic Programming O(n·W). In Fractional Knapsack, items can be split (e.g. grains, gold dust), and it can be solved greedily in O(n log n) by sorting by value-to-weight ratio."
      },
      {
        q: "Why is 0/1 Knapsack called 'Pseudo-polynomial'?",
        a: "Because its running time is proportional to W, which is the numeric magnitude of the capacity, not the number of bits required to represent W (which is log W). If W is proportional to 2^k, the time is exponential in the input size."
      },
      {
        q: "How does our planner optimize the DP table memory?",
        a: "We discretize travel budget in discrete steps of ₹50 or ₹100, which keeps matrix dimensions manageable (~80 columns) while providing exact results."
      }
    ]
  },
  greedy: {
    title: "Greedy Destination Recommendation Algorithm",
    problemStatement: "Given a pool of travel destinations, available budget, user preferences, and a starting location, select an optimal set of destinations that fits the budget and maximizes overall user satisfaction.",
    strategy: "Greedy Heuristic based on Benefit-to-Cost Ratio. Computes a composite benefit score (popularity, user rating, preference tag affinity) divided by estimated total package cost (lodging + transit). Sorts descending and picks iteratively until budget is exhausted.",
    recurrence: "Ratio_i = (w_pop · Pop_i + w_rate · Rate_i · 20 + w_pref · Match_i) / TotalCost_i",
    pseudocode: `function GreedyRecommendation(destinations, budget, startCity, prefs):
  for each dest in destinations:
    benefit = calculateBenefit(dest, prefs)
    cost = dest.stayCost + distance(startCity, dest) * transitRate
    dest.ratio = benefit / cost

  sort destinations by ratio descending // O(n log n)

  accepted = []
  remainingBudget = budget
  for each dest in sortedDestinations: // O(n)
    if dest.cost <= remainingBudget:
      accepted.add(dest)
      remainingBudget -= dest.cost

  return accepted`,
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      note: "Dominated by sorting candidate destinations"
    },
    spaceComplexity: "O(n) auxiliary memory to store candidate records and decision logs.",
    vivaQuestions: [
      {
        q: "What are the two key properties required for a Greedy algorithm to yield an optimal solution?",
        a: "1. Greedy Choice Property: A global optimum can be reached by choosing a local optimum. 2. Optimal Substructure: An optimal solution to the problem contains optimal solutions to subproblems."
      },
      {
        q: "Does Greedy always find the absolute global maximum for budget allocation?",
        a: "No. Greedy by ratio can leave unused capacity that could have accommodated another combination with higher total value (the classic limitation of Greedy on 0/1 Knapsack). However, Greedy runs in O(n log n) vs DP's O(n·W), making it ideal for instant responsive recommendation systems."
      }
    ]
  },
  sorting: {
    title: "Sorting Algorithms Comparison (Bubble, Selection, Merge)",
    problemStatement: "Sort an array of n destination objects based on user-chosen criteria: Price (₹/day), Distance from origin (km), Popularity (1-100), or Rating (Stars).",
    strategy: "Comparison of Brute Force quadratic algorithms (Bubble Sort & Selection Sort) with Divide & Conquer logarithmic algorithm (Merge Sort).",
    recurrence: "Merge Sort Recurrence: T(n) = 2T(n/2) + θ(n) => By Master Theorem: T(n) = θ(n log n)",
    pseudocode: `// Merge Sort Divide and Conquer
function MergeSort(arr):
  if length(arr) <= 1: return arr
  mid = length(arr) / 2
  left = MergeSort(arr[0..mid])
  right = MergeSort(arr[mid..end])
  return Merge(left, right)

function Merge(L, R):
  result = []
  while L is not empty and R is not empty:
    if L[0] <= R[0]: result.append(L.popFirst())
    else: result.append(R.popFirst())
  return result + remaining L + remaining R`,
    timeComplexity: {
      best: "Bubble: Ω(n), Selection: Ω(n²), Merge: Ω(n log n)",
      average: "Bubble: θ(n²), Selection: θ(n²), Merge: θ(n log n)",
      worst: "Bubble: O(n²), Selection: O(n²), Merge: O(n log n)",
      note: "Merge Sort guarantees O(n log n) even in worst case"
    },
    spaceComplexity: "Bubble: O(1), Selection: O(1), Merge: O(n) auxiliary space.",
    vivaQuestions: [
      {
        q: "Why is Merge Sort stable while Selection Sort is unstable?",
        a: "Merge Sort preserves the relative order of duplicate elements because when two elements are equal (L[i] == R[j]), we choose from the left array first. Selection Sort swaps distant elements across the array, potentially placing an identical element behind another."
      },
      {
        q: "How does Bubble Sort achieve Ω(n) best-case time complexity?",
        a: "By maintaining a 'swapped' boolean flag during each pass. If an entire pass completes with zero swaps, the algorithm concludes that the array is already sorted and terminates early in O(n) time."
      },
      {
        q: "Can Merge Sort be solved in-place without O(n) extra memory?",
        a: "Standard array Merge Sort requires O(n) auxiliary buffer for merging. In-place merge exists but increases time complexity to O(n²). For linked lists, however, Merge Sort can be merged in O(1) extra space by relinking pointers."
      }
    ]
  }
};

export default function AlgorithmLab({ setActiveTab }) {
  const [activeAlgo, setActiveAlgo] = useState('dijkstra');
  const details = ALGORITHM_DETAILS[activeAlgo];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Academic Algorithm Specification & Theory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DAA Algorithm Lab</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            In-depth theoretical analysis, mathematical recurrence formulations, computational complexity breakdown, and standard pseudocode for algorithms implemented in Smart Trip Planner.
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeAlgo)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition"
        >
          <span>Open Interactive Visualizer</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Algorithm Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ALGO_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeAlgo === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAlgo(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.id.toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">{tab.name}</h4>
                <p className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                  {tab.category}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Algorithm Detail Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-teal-600 uppercase">Algorithm Specification</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{details.title}</h2>
        </div>

        {/* Problem Statement & Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Formal Problem Statement</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{details.problemStatement}</p>
          </div>

          <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>Algorithmic Design Paradigm</span>
            </h4>
            <p className="text-xs text-teal-900 leading-relaxed">{details.strategy}</p>
          </div>
        </div>

        {/* Complexity Summary Cards */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>Time & Space Complexity Analysis</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Case</span>
              <span className="text-sm font-mono font-bold text-emerald-600">{details.timeComplexity.best}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Case</span>
              <span className="text-sm font-mono font-bold text-slate-800">{details.timeComplexity.average}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Worst Case</span>
              <span className="text-sm font-mono font-bold text-rose-600">{details.timeComplexity.worst}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Auxiliary Space</span>
              <span className="text-sm font-mono font-bold text-slate-800">{details.spaceComplexity}</span>
            </div>
          </div>
          {details.timeComplexity.note && (
            <p className="text-[11px] text-slate-500 mt-2 font-medium">Note: {details.timeComplexity.note}</p>
          )}
        </div>

        {/* Mathematical Recurrence & Pseudocode */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block mb-1 font-sans font-bold">Recurrence Relation / Mathematical Formula:</span>
            <code className="text-sm font-bold">{details.recurrence}</code>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-teal-600" />
              <span>Standard Academic Pseudocode</span>
            </h4>
            <div className="bg-slate-950 text-slate-300 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              <pre>{details.pseudocode}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
