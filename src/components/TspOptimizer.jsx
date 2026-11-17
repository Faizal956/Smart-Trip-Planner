import React, { useState, useMemo } from 'react';
import {
  Share2,
  Check,
  TrendingDown,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Info,
  Car,
  Fuel,
  Clock,
  RotateCcw
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { solveTSP } from '../algorithms/tsp';
import InteractiveMap from './InteractiveMap';

export default function TspOptimizer() {
  const [selectedCities, setSelectedCities] = useState([
    'pune',
    'mumbai',
    'lonavala',
    'goa',
    'mahabaleshwar'
  ]);
  const [returnToStart, setReturnToStart] = useState(true);

  // Run Held-Karp TSP Algorithm
  const tspResult = useMemo(() => {
    return solveTSP(selectedCities, returnToStart);
  }, [selectedCities, returnToStart]);

  const toggleCity = (cityId) => {
    if (selectedCities.includes(cityId)) {
      if (selectedCities.length <= 2) {
        alert("At least 2 destinations are required for route optimization.");
        return;
      }
      setSelectedCities(selectedCities.filter(c => c !== cityId));
    } else {
      if (selectedCities.length >= 8) {
        alert("For optimal browser performance, TSP Bitmasking is limited to 8 cities in the interactive demo (2^8 = 256 subsets).");
        return;
      }
      setSelectedCities([...selectedCities, cityId]);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-2">
            <Share2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Dynamic Programming with Bitmasking (Held-Karp)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Multi-Destination Route Optimizer</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Solves the NP-Hard Travelling Salesman Problem (TSP) in <span className="font-mono font-bold text-slate-800">O(n² · 2ⁿ)</span> time complexity, evaluating bitmask subsets to minimize overall transit distance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Waypoints</span>
            <span className="text-lg font-black text-teal-600">{selectedCities.length} Destinations</span>
          </div>
        </div>
      </div>

      {/* Dataset & Simplification Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Dataset & Model Note:</strong> This application utilizes a realistic pairwise highway road distance matrix (connecting NH 48, NH 44, NH 66, and expressways) for demonstration. The Held-Karp algorithm finds the mathematically exact global minimum tour for the chosen distance matrix.
        </div>
      </div>

      {/* City Selector Pills */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Select Tour Destinations (Choose 3 to 8 Cities)
          </label>
          <span className="text-xs text-slate-400 font-medium">
            Origin: <strong className="text-slate-700 capitalize">{selectedCities[0]}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {DESTINATIONS.map(d => {
            const isSelected = selectedCities.includes(d.id);
            const isOrigin = selectedCities[0] === d.id;
            return (
              <button
                key={d.id}
                onClick={() => toggleCity(d.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{d.name}</span>
                {isOrigin && <span className="text-[9px] bg-teal-800 text-white px-1.5 py-0.5 rounded">Origin</span>}
                {isSelected && !isOrigin && <Check className="w-3.5 h-3.5 text-teal-200" />}
              </button>
            );
          })}
        </div>

        {/* Round Trip Loop Toggle */}
        <div className="pt-2 flex items-center space-x-3 text-xs text-slate-700">
          <input
            type="checkbox"
            id="tspReturn"
            checked={returnToStart}
            onChange={(e) => setReturnToStart(e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
          />
          <label htmlFor="tspReturn" className="cursor-pointer font-medium select-none">
            Return to starting city <span className="font-bold text-teal-700 capitalize">({selectedCities[0]})</span> to close the loop
          </label>
        </div>
      </div>

      {/* Side-by-Side Comparison: Original vs Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Unoptimized Order */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 card-hover-lift">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Baseline Route</span>
              <h3 className="text-base font-bold text-slate-800">Original User Selection</h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono font-bold">
              Unoptimized
            </span>
          </div>

          <div className="text-3xl font-black text-slate-700">
            {tspResult.originalDistance} <span className="text-sm font-semibold text-slate-400">km</span>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Visiting Sequence:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {tspResult.originalOrder.map((cityId, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                    {DESTINATIONS.find(d => d.id === cityId)?.name || cityId}
                  </span>
                  {idx < tspResult.originalOrder.length - 1 && (
                    <span className="text-slate-400 text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* TSP DP Optimized Order */}
        <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-teal-700/50 shadow-xl space-y-4 card-hover-lift">
          <div className="flex items-center justify-between border-b border-teal-800/60 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Held-Karp Optimized</span>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>TSP Optimal Sequence</span>
                <Sparkles className="w-4 h-4 text-teal-400" />
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold">
              {tspResult.percentSaved}% Saved
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <div className="text-3xl font-black text-white">
              {tspResult.optimizedDistance} <span className="text-sm font-semibold text-teal-300">km</span>
            </div>
            {tspResult.distanceSaved > 0 && (
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ↓ {tspResult.distanceSaved} km shorter
              </span>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase text-teal-300 block">Optimized Visiting Sequence:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {tspResult.optimizedOrder.map((cityId, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-200 border border-teal-500/30 text-xs font-bold capitalize">
                    {DESTINATIONS.find(d => d.id === cityId)?.name || cityId}
                  </span>
                  {idx < tspResult.optimizedOrder.length - 1 && (
                    <span className="text-teal-400 text-xs font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Savings Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4 card-hover-lift">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Fuel Conserved</p>
            <h4 className="text-xl font-bold text-slate-900 mt-0.5">
              ~{tspResult.fuelSavedLiters} Liters
            </h4>
            <p className="text-[11px] text-emerald-600 font-medium">
              Save approx ₹{tspResult.moneySavedRs?.toLocaleString('en-IN')} in petrol
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4 card-hover-lift">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Drive Time Saved</p>
            <h4 className="text-xl font-bold text-slate-900 mt-0.5">
              ~{tspResult.hoursSaved} Hours
            </h4>
            <p className="text-[11px] text-blue-600 font-medium">Assuming 55 km/h highway speed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4 card-hover-lift">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">States Explored</p>
            <h4 className="text-xl font-bold text-slate-900 mt-0.5">
              {tspResult.metrics.statesComputed} Subproblems
            </h4>
            <p className="text-[11px] text-purple-600 font-medium">
              vs {tspResult.metrics.bruteForcePermutations?.toLocaleString()} brute force permutations
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map of the Optimized Tour */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Optimized Tour Geography</h3>
            <p className="text-xs text-slate-500">Numbering reflects the optimal visiting order</p>
          </div>
          <span className="text-xs font-mono text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            DP Bitmask Tour
          </span>
        </div>

        <InteractiveMap
          destinationIds={selectedCities}
          routeOrder={tspResult.optimizedOrder}
          height="380px"
        />
      </div>

      {/* Algorithm Step-by-Step & Dynamic Programming Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-teal-600" />
          <span>Held-Karp Dynamic Programming Execution Trace</span>
        </h3>

        <div className="space-y-2">
          {tspResult.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex items-center space-x-3"
            >
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-2 font-mono">
          <p className="text-teal-400 font-bold font-sans">Formal Recurrence Relation:</p>
          <p>dp(mask, v) = min &#123; dp(mask \ &#123;v&#125;, u) + dist(u, v) &#125; for all u ∈ mask, u ≠ v</p>
          <p className="text-slate-400 text-[11px] font-sans pt-1">
            Where mask is a bitmask of visited nodes. Brute-force would take O(n!) = O({selectedCities.length}!) = {tspResult.metrics.bruteForcePermutations?.toLocaleString()} operations. Dynamic programming with bitmasking reduces this to O(n² · 2ⁿ).
          </p>
        </div>
      </div>
    </div>
  );
}
