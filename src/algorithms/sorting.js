/**
 * Sorting Algorithms for Destinations & Travel Metrics
 *
 * Implements:
 * 1. Bubble Sort (O(n²))
 * 2. Selection Sort (O(n²))
 * 3. Merge Sort (O(n log n))
 *
 * Each provides detailed step-by-step recording, comparison counts, and swap counts.
 */

// Helper to extract numeric value from destination for given criterion
export function getMetricValue(dest, criterion, referenceCityId = "pune", distanceLookup = null) {
  switch (criterion) {
    case "price":
      return dest.estimatedCostPerDay;
    case "popularity":
      return dest.popularity;
    case "rating":
      return dest.rating;
    case "distance":
      if (distanceLookup && typeof distanceLookup === 'function') {
        return distanceLookup(referenceCityId, dest.id);
      }
      return dest.distanceFromStart || 0;
    default:
      return dest.popularity;
  }
}

/**
 * Bubble Sort with detailed step recording
 */
export function bubbleSort(items, criterion, order = "asc", referenceCityId = "pune", distanceLookup = null) {
  const startTime = performance.now();
  const arr = items.map(item => ({
    ...item,
    sortVal: getMetricValue(item, criterion, referenceCityId, distanceLookup)
  }));

  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const steps = [];

  // Initial state snapshot
  steps.push({
    pass: 0,
    type: "init",
    description: `Initial unsorted array of ${n} destinations.`,
    activeIndices: [],
    snapshot: arr.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const valA = arr[j].sortVal;
      const valB = arr[j + 1].sortVal;

      const shouldSwap = order === "asc" ? valA > valB : valA < valB;

      if (shouldSwap) {
        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swappedInPass = true;

        steps.push({
          pass: i + 1,
          type: "swap",
          description: `Compared index ${j} (${arr[j+1].name}: ${valA}) and ${j+1} (${arr[j].name}: ${valB}) -> Swapped.`,
          activeIndices: [j, j + 1],
          snapshot: arr.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
        });
      }
    }

    if (!swappedInPass) {
      steps.push({
        pass: i + 1,
        type: "optimized_break",
        description: `Pass ${i + 1}: No swaps occurred. Array is already fully sorted.`,
        activeIndices: [],
        snapshot: arr.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
      });
      break;
    }
  }

  const endTime = performance.now();

  return {
    algorithm: "Bubble Sort",
    criterion,
    order,
    result: arr,
    comparisons,
    swaps,
    steps,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    timeComplexity: {
      best: "Ω(n)",
      average: "θ(n²)",
      worst: "O(n²)"
    },
    spaceComplexity: "O(1) Auxiliary Space"
  };
}

/**
 * Selection Sort with detailed step recording
 */
export function selectionSort(items, criterion, order = "asc", referenceCityId = "pune", distanceLookup = null) {
  const startTime = performance.now();
  const arr = items.map(item => ({
    ...item,
    sortVal: getMetricValue(item, criterion, referenceCityId, distanceLookup)
  }));

  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const steps = [];

  steps.push({
    pass: 0,
    type: "init",
    description: `Initial unsorted array of ${n} destinations.`,
    activeIndices: [],
    snapshot: arr.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
  });

  for (let i = 0; i < n - 1; i++) {
    let targetIdx = i;

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const isBetter = order === "asc"
        ? arr[j].sortVal < arr[targetIdx].sortVal
        : arr[j].sortVal > arr[targetIdx].sortVal;

      if (isBetter) {
        targetIdx = j;
      }
    }

    if (targetIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;
      swaps++;

      steps.push({
        pass: i + 1,
        type: "swap",
        description: `Pass ${i + 1}: Found extreme element "${arr[i].name}" (${arr[i].sortVal}) at index ${targetIdx}. Swapped with index ${i}.`,
        activeIndices: [i, targetIdx],
        snapshot: arr.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
      });
    } else {
      steps.push({
        pass: i + 1,
        type: "no_swap",
        description: `Pass ${i + 1}: Element "${arr[i].name}" at index ${i} is already in correct sorted position.`,
        activeIndices: [i],
        snapshot: arr.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
      });
    }
  }

  const endTime = performance.now();

  return {
    algorithm: "Selection Sort",
    criterion,
    order,
    result: arr,
    comparisons,
    swaps,
    steps,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    timeComplexity: {
      best: "Ω(n²)",
      average: "θ(n²)",
      worst: "O(n²)"
    },
    spaceComplexity: "O(1) Auxiliary Space"
  };
}

/**
 * Merge Sort with detailed step recording
 */
export function mergeSort(items, criterion, order = "asc", referenceCityId = "pune", distanceLookup = null) {
  const startTime = performance.now();
  const arr = items.map(item => ({
    ...item,
    sortVal: getMetricValue(item, criterion, referenceCityId, distanceLookup)
  }));

  let comparisons = 0;
  let arrayWrites = 0;
  const steps = [];

  steps.push({
    step: 0,
    type: "init",
    description: `Divide-and-Conquer: Initial array with ${arr.length} elements.`,
    activeIndices: [],
    snapshot: arr.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
  });

  function merge(leftArr, rightArr, startIndex) {
    const merged = [];
    let i = 0, j = 0;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      const takeLeft = order === "asc"
        ? leftArr[i].sortVal <= rightArr[j].sortVal
        : leftArr[i].sortVal >= rightArr[j].sortVal;

      if (takeLeft) {
        merged.push(leftArr[i]);
        i++;
      } else {
        merged.push(rightArr[j]);
        j++;
      }
      arrayWrites++;
    }

    while (i < leftArr.length) {
      merged.push(leftArr[i]);
      i++;
      arrayWrites++;
    }
    while (j < rightArr.length) {
      merged.push(rightArr[j]);
      j++;
      arrayWrites++;
    }

    return merged;
  }

  function sort(subArr, startIndex) {
    if (subArr.length <= 1) return subArr;

    const mid = Math.floor(subArr.length / 2);
    const leftPart = sort(subArr.slice(0, mid), startIndex);
    const rightPart = sort(subArr.slice(mid), startIndex + mid);

    const mergedPart = merge(leftPart, rightPart, startIndex);

    steps.push({
      step: steps.length,
      type: "merge",
      description: `Merged subarrays [${leftPart.map(x => x.name).join(', ')}] and [${rightPart.map(x => x.name).join(', ')}].`,
      activeIndices: Array.from({ length: mergedPart.length }, (_, k) => startIndex + k),
      snapshot: mergedPart.map(x => ({ id: x.id, name: x.name, val: x.sortVal }))
    });

    return mergedPart;
  }

  const sortedResult = sort(arr, 0);
  const endTime = performance.now();

  return {
    algorithm: "Merge Sort",
    criterion,
    order,
    result: sortedResult,
    comparisons,
    swaps: arrayWrites, // Array writes in merge
    steps,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    timeComplexity: {
      best: "Ω(n log n)",
      average: "θ(n log n)",
      worst: "O(n log n)"
    },
    spaceComplexity: "O(n) Auxiliary Space"
  };
}
