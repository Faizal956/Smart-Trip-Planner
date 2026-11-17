import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Coins,
  Sparkles,
  Check,
  ArrowRight,
  Route,
  Share2,
  Clock,
  Car,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { DESTINATIONS, ALL_PREFERENCES } from '../data/destinations';
import { solveTSP } from '../algorithms/tsp';
import { solveKnapsack } from '../algorithms/knapsack';
import InteractiveMap from './InteractiveMap';

export default function TripPlanner({
  setActiveTab,
  onTripGenerated,
  activeTrip
}) {
  const [startCity, setStartCity] = useState('pune');
  const [selectedDestinations, setSelectedDestinations] = useState(['mumbai', 'lonavala', 'mahabaleshwar']);
  const [startDate, setStartDate] = useState('2025-01-10');
  const [numDays, setNumDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(30000);
  const [preferences, setPreferences] = useState(['Heritage', 'Nature', 'Food']);
  const [returnToStart, setReturnToStart] = useState(true);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Toggle destination selection
  const toggleDestination = (id) => {
    if (id === startCity) return; // Cannot select start city as destination
    if (selectedDestinations.includes(id)) {
      setSelectedDestinations(selectedDestinations.filter(d => d !== id));
    } else {
      setSelectedDestinations([...selectedDestinations, id]);
    }
  };

  // Toggle preference tag
  const togglePreference = (pref) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  // Generate Optimized Trip Plan
  const handleGeneratePlan = () => {
    setValidationError('');

    if (selectedDestinations.length === 0) {
      setValidationError('Please select at least 1 destination to plan your trip.');
      return;
    }

    if (budget <= 5000) {
      setValidationError('Please specify a travel budget of at least ₹5,000.');
      return;
    }

    setIsOptimizing(true);

    setTimeout(() => {
      // Step 1: Run Multi-Destination TSP Route Optimizer
      // Complete set of cities = [startCity, ...selectedDestinations]
      const fullCitySet = [startCity, ...selectedDestinations.filter(d => d !== startCity)];
      const tspResult = solveTSP(fullCitySet, returnToStart);

      // Step 2: Collect attractions from all selected cities
      const allAttractions = [];
      fullCitySet.forEach(cityId => {
        const dest = DESTINATIONS.find(d => d.id === cityId);
        if (dest) {
          dest.attractions.forEach(attr => {
            allAttractions.push({
              ...attr,
              location: dest.name,
              cityId: dest.id
            });
          });
        }
      });

      // Step 3: Run 0/1 Knapsack on Attractions
      const attractionsBudget = Math.round(budget * 0.35);
      const knapsackResult = solveKnapsack(allAttractions, attractionsBudget, 50);

      // Step 4: Calculate total estimated trip cost
      let totalStayCost = 0;
      selectedDestinations.forEach(cityId => {
        const dest = DESTINATIONS.find(d => d.id === cityId);
        if (dest) {
          totalStayCost += (dest.estimatedCostPerDay * travelers);
        }
      });

      const totalTransitCost = Math.round(tspResult.optimizedDistance * 4.5);
      const totalAttractionsCost = knapsackResult.totalCost * travelers;
      const totalEstimatedCost = totalStayCost + totalTransitCost + totalAttractionsCost;

      // Build the complete Trip Plan object
      const newTrip = {
        id: `trip_${Date.now()}`,
        title: `${DESTINATIONS.find(d => d.id === startCity)?.name} Multi-City Tour`,
        startLocation: startCity,
        destinations: selectedDestinations,
        routeOrder: tspResult.optimizedOrder,
        originalRouteOrder: tspResult.originalOrder,
        totalDistance: tspResult.optimizedDistance,
        originalDistance: tspResult.originalDistance,
        distanceSaved: tspResult.distanceSaved,
        percentSaved: tspResult.percentSaved,
        startDate,
        numDays,
        travelers,
        budget,
        preferences,
        returnToStart,
        costBreakdown: {
          stayCost: totalStayCost,
          transitCost: totalTransitCost,
          attractionsCost: totalAttractionsCost,
          total: totalEstimatedCost,
          remainingBudget: Math.max(0, budget - totalEstimatedCost)
        },
        selectedAttractions: knapsackResult.selectedItems,
        rejectedAttractions: knapsackResult.rejectedItems,
        knapsackResult,
        tspResult,
        dateCreated: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };

      setOptimizationResult(newTrip);
      setIsOptimizing(false);

      if (onTripGenerated) {
        onTripGenerated(newTrip);
      }
    }, 450);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>DAA Multi-Algorithm Pipeline</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trip Configuration & Optimizer</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Configure your origin, candidate destinations, dates, and spending threshold. The optimizer executes TSP via DP bitmasking and 0/1 Knapsack to maximize attractions within your budget.
            </p>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isOptimizing}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-75 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition transform hover:-translate-y-0.5 shrink-0"
          >
            {isOptimizing ? (
              <>
                <Compass className="w-4 h-4 animate-spin text-teal-200" />
                <span>Running DAA Optimizers...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Optimized Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Main Grid: Inputs on Left, Interactive Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Config Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Starting Location & Dates */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>1. Origin & Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Starting City (Origin)
                </label>
                <select
                  value={startCity}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setStartCity(newStart);
                    // Remove from selected destinations if present
                    setSelectedDestinations(selectedDestinations.filter(d => d !== newStart));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                >
                  {DESTINATIONS.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Number of Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Total Trip Duration (Days)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="21"
                    value={numDays}
                    onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Number of Travelers
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Destinations Multi-Select */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-teal-600" />
                <span>2. Select Destinations to Visit ({selectedDestinations.length} selected)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Target for TSP Optimization</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DESTINATIONS.map(dest => {
                const isStart = dest.id === startCity;
                const isSelected = selectedDestinations.includes(dest.id);

                return (
                  <button
                    key={dest.id}
                    type="button"
                    disabled={isStart}
                    onClick={() => toggleDestination(dest.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isStart
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-teal-50 border-teal-500/50 text-teal-900 shadow-xs ring-1 ring-teal-500/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <p className="text-xs font-bold truncate">
                        {dest.name} {isStart && '(Start)'}
                      </p>
                      <p className="text-[10px] text-slate-400">{dest.state}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Return to origin toggle */}
            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-700">
              <input
                type="checkbox"
                id="returnToStart"
                checked={returnToStart}
                onChange={(e) => setReturnToStart(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <label htmlFor="returnToStart" className="cursor-pointer font-medium select-none">
                Return to starting city <span className="font-bold text-teal-700">({DESTINATIONS.find(d => d.id === startCity)?.name})</span> at end of tour (Closed TSP Loop)
              </label>
            </div>
          </div>

          {/* Budget & Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Coins className="w-4 h-4 text-teal-600" />
              <span>3. Total Budget & Preferences</span>
            </h3>

            {/* Budget Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Total Travel Budget
                </label>
                <span className="text-base font-extrabold text-teal-600">
                  ₹{budget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="2500"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹10,000</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Travel Preferences */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Travel Styles & Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_PREFERENCES.map(pref => {
                  const isChecked = preferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isChecked
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Map & Results Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Geographic Route Preview</h3>
                <p className="text-xs text-slate-500">Live Indian roadmap visualization</p>
              </div>
              <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                Leaflet OSM
              </span>
            </div>

            <InteractiveMap
              destinationIds={[startCity, ...selectedDestinations]}
              routeOrder={optimizationResult ? optimizationResult.routeOrder : [startCity, ...selectedDestinations]}
              height="340px"
            />

            <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
              <span>Origin: <strong className="text-slate-800">{DESTINATIONS.find(d => d.id === startCity)?.name}</strong></span>
              <span>Waypoints: <strong className="text-slate-800">{selectedDestinations.length} Stops</strong></span>
            </div>
          </div>

          {/* Quick Optimization Results Card */}
          {optimizationResult ? (
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-teal-700/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DAA Plan Generated!</span>
                </span>
                <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30 font-bold">
                  {optimizationResult.percentSaved}% Distance Saved
                </span>
              </div>

              <div>
                <h4 className="text-lg font-extrabold">{optimizationResult.title}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Optimal TSP Sequence: {optimizationResult.routeOrder.map(id => id.toUpperCase()).join(' → ')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <p className="text-[10px] text-teal-200 uppercase font-semibold">Total Distance</p>
                  <p className="text-xl font-black text-white">{optimizationResult.totalDistance} km</p>
                  <p className="text-[10px] text-emerald-300 mt-0.5">Saved {optimizationResult.distanceSaved} km vs original</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <p className="text-[10px] text-teal-200 uppercase font-semibold">Attractions Chosen</p>
                  <p className="text-xl font-black text-white">{optimizationResult.selectedAttractions.length} spots</p>
                  <p className="text-[10px] text-teal-200 mt-0.5">0/1 Knapsack optimal</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('summary')}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  <span>View Complete Travel Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Ready to Optimize</h4>
              <p className="text-xs text-slate-500">
                Click "Generate Optimized Plan" above to execute Dijkstra, TSP Dynamic Programming, and 0/1 Knapsack on your custom configuration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
