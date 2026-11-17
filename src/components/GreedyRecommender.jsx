import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  Coins,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sliders,
  Info,
  Star,
  Compass,
  Check,
  TrendingUp,
  Layers
} from 'lucide-react';
import { DESTINATIONS, ALL_PREFERENCES } from '../data/destinations';
import { runGreedyRecommendation } from '../algorithms/greedy';

export default function GreedyRecommender() {
  const [startCity, setStartCity] = useState('pune');
  const [budget, setBudget] = useState(35000);
  const [preferences, setPreferences] = useState(['Heritage', 'Nature', 'Food']);
  const [weights, setWeights] = useState({
    popularity: 0.35,
    rating: 0.25,
    preference: 0.40
  });

  const togglePreference = (pref) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  // Run Greedy Algorithm
  const greedyResult = useMemo(() => {
    return runGreedyRecommendation({
      startLocationId: startCity,
      totalBudget: budget,
      preferences,
      weights
    });
  }, [startCity, budget, preferences, weights]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Greedy Heuristic Recommendation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Greedy Destination Recommender</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Employs a Greedy selection strategy that prioritizes destinations by their Benefit-to-Cost ratio (Popularity, Rating, and Preference match divided by total transit + lodging expenditure).
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Accepted by Greedy Heuristic</span>
          <span className="text-xl font-black text-purple-700">
            {greedyResult.acceptedDestinations.length} Destinations
          </span>
        </div>
      </div>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Origin & Budget (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span>User Constraints</span>
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Starting Location (Origin)</label>
            <select
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-purple-500"
            >
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600">Total Available Budget</label>
              <span className="text-sm font-black text-purple-700">₹{budget.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="80000"
              step="2500"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹10,000</span>
              <span>₹45,000</span>
              <span>₹80,000</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Budget Spent:</span>
              <span className="text-purple-700 font-bold">
                ₹{greedyResult.totalSpent.toLocaleString('en-IN')} ({greedyResult.budgetUtilizationPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, greedyResult.budgetUtilizationPercent)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Remaining: ₹{greedyResult.remainingBudget.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Travel Style Preferences (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>Preferences & Heuristic Weight Tuning</span>
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-2">
              Select Your Travel Interests (Matches Boost Preference Affinity)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_PREFERENCES.map(pref => {
                const isSelected = preferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Popularity Weight</span>
              <span className="text-xs font-bold text-slate-800">35% ({weights.popularity})</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Rating Weight</span>
              <span className="text-xs font-bold text-slate-800">25% ({weights.rating})</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Preference Match Weight</span>
              <span className="text-xs font-bold text-purple-700">40% ({weights.preference})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Destinations Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Accepted Destinations ({greedyResult.acceptedDestinations.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {greedyResult.acceptedDestinations.map((dest, idx) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900">
                  #{idx + 1} Greedy Pick
                </div>
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  Score: {dest.greedyRatio}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-lg font-bold">{dest.name}</h4>
                  <p className="text-[11px] text-slate-200 line-clamp-1">{dest.tagline}</p>
                </div>
              </div>

              <div className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance from Origin:</span>
                  <span className="font-bold text-slate-800">{dest.distanceFromStart} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stay Duration ({dest.averageDurationDays} days):</span>
                  <span className="font-bold text-slate-800">₹{dest.stayCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Transit Cost:</span>
                  <span className="font-bold text-slate-800">₹{dest.transitCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                  <span className="text-slate-900">Total Package Cost:</span>
                  <span className="text-purple-700">₹{dest.totalEstCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {dest.matchingTags?.map(tag => (
                    <span key={tag} className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 font-semibold">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Greedy Decision Trace Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Step-by-Step Greedy Selection Trace</span>
          </h3>
          <p className="text-xs text-slate-500">
            Shows how candidate destinations are evaluated in order of descending Greedy Ratio until budget is exhausted.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-3">Step</th>
                <th className="p-3">Candidate City</th>
                <th className="p-3">Greedy Ratio</th>
                <th className="p-3">Total Cost</th>
                <th className="p-3">Decision</th>
                <th className="p-3">Reasoning</th>
                <th className="p-3 text-right">Remaining Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {greedyResult.decisionLog.map((log) => (
                <tr
                  key={log.step}
                  className={log.decision === 'ACCEPTED' ? 'bg-emerald-50/40' : 'bg-rose-50/20 text-slate-500'}
                >
                  <td className="p-3 font-mono font-bold text-slate-700">#{log.step}</td>
                  <td className="p-3 font-bold text-slate-900">{log.destinationName}</td>
                  <td className="p-3 font-mono font-bold text-purple-700">{log.greedyRatio}</td>
                  <td className="p-3 font-mono font-semibold text-slate-800">
                    ₹{log.cost.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    {log.decision === 'ACCEPTED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>ACCEPTED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] inline-flex items-center space-x-1">
                        <XCircle className="w-3 h-3" />
                        <span>REJECTED</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-[11px] max-w-xs">{log.reason}</td>
                  <td className="p-3 font-mono font-bold text-right text-slate-900">
                    ₹{log.remainingBudgetAfter.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Theoretical Greedy Explanation */}
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-purple-800">
            <Info className="w-4 h-4 text-purple-600 shrink-0" />
            <span>DAA Principle: Greedy Choice Property & Matroid Theory</span>
          </div>
          <p className="text-[11px] leading-relaxed text-purple-900/90">
            The greedy approach makes locally optimal choices at each stage (sorting by benefit-to-cost ratio in O(n log n) time and picking items greedily in O(n) time). Unlike Dynamic Programming which explores all subproblems, Greedy never reconsiders previous choices, making it exceptionally fast for instant user recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
