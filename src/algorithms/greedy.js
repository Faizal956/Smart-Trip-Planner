import { DESTINATIONS } from '../data/destinations';
import { getDistance } from '../data/graphData';

/**
 * Greedy Algorithm for Destination Recommendation
 *
 * Implements a Greedy heuristic based on Benefit-to-Cost Ratio:
 * Benefit = (wPop * Popularity) + (wRate * Rating * 20) + (wPref * PreferenceAffinity)
 * Cost = (Estimated Daily Cost * Days) + (Transit Distance * CostFactor)
 * Greedy Ratio = Benefit / Cost
 *
 * Greedily selects highest-ratio destinations until budget is exhausted.
 */
export function runGreedyRecommendation({
  startLocationId = "pune",
  totalBudget = 25000,
  preferences = ["Heritage", "Nature"],
  weights = { popularity: 0.35, rating: 0.25, preference: 0.40 }
}) {
  const candidates = DESTINATIONS.map(dest => {
    const distance = getDistance(startLocationId, dest.id);

    // Calculate preference match count
    const matchingTags = dest.tags.filter(tag => preferences.includes(tag));
    const preferenceAffinity = preferences.length > 0
      ? (matchingTags.length / preferences.length) * 100
      : 50;

    // Benefit components
    const popScore = dest.popularity; // 0 - 100
    const ratingScore = dest.rating * 20; // 0 - 100
    const prefScore = preferenceAffinity; // 0 - 100

    const benefitScore = (
      weights.popularity * popScore +
      weights.rating * ratingScore +
      weights.preference * prefScore
    );

    // Cost estimation for standard stay + transit
    const stayCost = dest.estimatedCostPerDay * dest.averageDurationDays;
    const transitCost = Math.round(distance * 3.5); // Approx transit cost by road/train
    const totalEstCost = stayCost + transitCost;

    // Greedy Ratio (Benefit per 1,000 INR of investment)
    const greedyRatio = totalEstCost > 0 ? (benefitScore / totalEstCost) * 1000 : 0;

    return {
      ...dest,
      distanceFromStart: distance,
      matchingTags,
      preferenceAffinity: Math.round(preferenceAffinity),
      benefitScore: Math.round(benefitScore * 10) / 10,
      stayCost,
      transitCost,
      totalEstCost,
      greedyRatio: Math.round(greedyRatio * 100) / 100
    };
  });

  // Step 1: Sort candidates in descending order of Greedy Ratio (O(n log n))
  const sortedCandidates = [...candidates].sort((a, b) => b.greedyRatio - a.greedyRatio);

  // Step 2: Greedy selection loop (O(n))
  let remainingBudget = totalBudget;
  const acceptedDestinations = [];
  const rejectedDestinations = [];
  const decisionLog = [];

  sortedCandidates.forEach((candidate, index) => {
    const isAffordable = candidate.totalEstCost <= remainingBudget;

    if (isAffordable) {
      remainingBudget -= candidate.totalEstCost;
      acceptedDestinations.push(candidate);
      decisionLog.push({
        step: index + 1,
        destinationId: candidate.id,
        destinationName: candidate.name,
        greedyRatio: candidate.greedyRatio,
        cost: candidate.totalEstCost,
        benefit: candidate.benefitScore,
        decision: "ACCEPTED",
        reason: `Highest available ratio (${candidate.greedyRatio}). Fits in remaining budget (₹${(remainingBudget + candidate.totalEstCost).toLocaleString('en-IN')} → ₹${remainingBudget.toLocaleString('en-IN')}).`,
        remainingBudgetAfter: remainingBudget
      });
    } else {
      rejectedDestinations.push(candidate);
      decisionLog.push({
        step: index + 1,
        destinationId: candidate.id,
        destinationName: candidate.name,
        greedyRatio: candidate.greedyRatio,
        cost: candidate.totalEstCost,
        benefit: candidate.benefitScore,
        decision: "REJECTED",
        reason: `Insufficient budget. Requires ₹${candidate.totalEstCost.toLocaleString('en-IN')}, but only ₹${remainingBudget.toLocaleString('en-IN')} remains.`,
        remainingBudgetAfter: remainingBudget
      });
    }
  });

  const totalSpent = totalBudget - remainingBudget;

  return {
    startLocationId,
    totalBudget,
    preferences,
    totalSpent,
    remainingBudget,
    budgetUtilizationPercent: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
    acceptedDestinations,
    rejectedDestinations,
    sortedCandidates,
    decisionLog,
    metrics: {
      timeComplexity: "O(n log n) [Dominated by Sorting]",
      spaceComplexity: "O(n)",
      totalCandidatesEvaluated: candidates.length,
      acceptedCount: acceptedDestinations.length,
      rejectedCount: rejectedDestinations.length
    }
  };
}
