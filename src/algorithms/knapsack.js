/**
 * 0/1 Knapsack Dynamic Programming Optimizer
 *
 * Maximizes total popularity/experience value within a fixed financial budget.
 *
 * @param {Array<{id: string, name: string, cost: number, popularityValue: number, category?: string, location?: string}>} items
 * @param {number} budget - Maximum allowable expenditure
 * @param {number} step - Discretization step in Rupees (e.g. 50 or 100 for crisp visual DP matrix)
 */
export function solveKnapsack(items, budget, step = 50) {
  if (!items || items.length === 0 || budget <= 0) {
    return {
      selectedItems: [],
      rejectedItems: items || [],
      totalCost: 0,
      totalValue: 0,
      remainingBudget: budget,
      dpTable: [],
      steps: ["No attractions or zero budget provided."],
      metrics: {
        timeComplexity: "O(n · W)",
        spaceComplexity: "O(n · W)",
        subproblemsSolved: 0
      }
    };
  }

  // Filter out any invalid items
  const validItems = items.filter(it => it.cost >= 0 && it.popularityValue >= 0);
  const n = validItems.length;

  // Scale budget to discrete steps to prevent memory explosion and enable beautiful UI matrix
  const effectiveStep = Math.max(10, step);
  const W = Math.floor(budget / effectiveStep);

  // DP table: (n + 1) rows, (W + 1) columns
  // dp[i][w] = maximum popularity value achievable using subset of first i items with budget w * effectiveStep
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  let subproblemsSolved = 0;

  // Fill DP Table
  for (let i = 1; i <= n; i++) {
    const item = validItems[i - 1];
    const itemWeightUnits = Math.ceil(item.cost / effectiveStep);
    const itemVal = item.popularityValue;

    for (let w = 0; w <= W; w++) {
      subproblemsSolved++;
      // Option 1: Exclude item i - 1
      dp[i][w] = dp[i - 1][w];

      // Option 2: Include item i - 1 if it fits in budget w
      if (itemWeightUnits <= w) {
        const withItem = dp[i - 1][w - itemWeightUnits] + itemVal;
        if (withItem > dp[i][w]) {
          dp[i][w] = withItem;
        }
      }
    }
  }

  // Traceback to find selected items
  const selectedItems = [];
  const selectedIds = new Set();
  let currW = W;

  for (let i = n; i > 0; i--) {
    // If value differs from the cell directly above, item i-1 was included
    if (dp[i][currW] !== dp[i - 1][currW]) {
      const item = validItems[i - 1];
      selectedItems.push(item);
      selectedIds.add(item.id);
      const itemWeightUnits = Math.ceil(item.cost / effectiveStep);
      currW -= itemWeightUnits;
    }
  }

  selectedItems.reverse();

  // Rejected items
  const rejectedItems = validItems.filter(item => !selectedIds.has(item.id));

  const totalCost = selectedItems.reduce((sum, item) => sum + item.cost, 0);
  const totalValue = selectedItems.reduce((sum, item) => sum + item.popularityValue, 0);
  const remainingBudget = Math.max(0, budget - totalCost);

  // Generate visual DP table representation (sample columns if W is large)
  // We'll provide column headers and rows for rendering the table in the UI
  const columnInterval = Math.max(1, Math.ceil(W / 12));
  const tableColumns = [];
  for (let w = 0; w <= W; w += columnInterval) {
    tableColumns.push({ unit: w, costRs: w * effectiveStep });
  }
  if (!tableColumns.find(col => col.unit === W)) {
    tableColumns.push({ unit: W, costRs: W * effectiveStep });
  }

  const tableRows = [];
  for (let i = 0; i <= n; i++) {
    const itemName = i === 0 ? "0 (Base)" : `${validItems[i - 1].name} (₹${validItems[i - 1].cost}, val: ${validItems[i - 1].popularityValue})`;
    const rowValues = tableColumns.map(col => dp[i][col.unit]);
    tableRows.push({
      itemIndex: i,
      itemName,
      isIncluded: i > 0 && selectedIds.has(validItems[i - 1].id),
      values: rowValues
    });
  }

  // Explanation steps
  const steps = [
    `Discretized budget ₹${budget} into ${W} units with resolution step ₹${effectiveStep}.`,
    `Allocated Dynamic Programming matrix of dimensions (${n + 1}) items × (${W + 1}) budget sub-capacities.`,
    `Bellman recurrence applied: dp[i][w] = max(dp[i-1][w], dp[i-1][w - cost_i] + val_i).`,
    `Processed ${subproblemsSolved} subproblems with optimal substructure.`,
    `Selected ${selectedItems.length} top-value attractions: ${selectedItems.map(s => s.name).join(', ') || 'None'}.`,
    `Budget utilized: ₹${totalCost.toLocaleString('en-IN')} of ₹${budget.toLocaleString('en-IN')} (Remaining: ₹${remainingBudget.toLocaleString('en-IN')}).`,
    `Achieved cumulative experience value: ${totalValue} points.`
  ];

  return {
    success: true,
    budget,
    step: effectiveStep,
    selectedItems,
    rejectedItems,
    totalCost,
    totalValue,
    remainingBudget,
    budgetUtilizationPercent: budget > 0 ? Math.round((totalCost / budget) * 100) : 0,
    tableColumns,
    tableRows,
    steps,
    metrics: {
      timeComplexity: "O(n · W)",
      spaceComplexity: "O(n · W)",
      itemsConsidered: n,
      subproblemsSolved,
      dpMatrixDimensions: `${n + 1} × ${W + 1}`
    }
  };
}
