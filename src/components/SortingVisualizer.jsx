import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowUpDown,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Zap,
  Info,
  Clock,
  Shuffle,
  BarChart2,
  CheckCircle2
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { getDistance } from '../data/graphData';
import { bubbleSort, selectionSort, mergeSort } from '../algorithms/sorting';

export default function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState('bubble'); // 'bubble' | 'selection' | 'merge'
  const [criterion, setCriterion] = useState('price'); // 'price' | 'distance' | 'popularity' | 'rating'
  const [order, setOrder] = useState('asc'); // 'asc' | 'desc'
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute sorting execution result
  const sortResult = useMemo(() => {
    const distanceFn = (c1, c2) => getDistance(c1, c2);
    if (algorithm === 'bubble') {
      return bubbleSort(DESTINATIONS, criterion, order, 'pune', distanceFn);
    } else if (algorithm === 'selection') {
      return selectionSort(DESTINATIONS, criterion, order, 'pune', distanceFn);
    } else {
      return mergeSort(DESTINATIONS, criterion, order, 'pune', distanceFn);
    }
  }, [algorithm, criterion, order]);

  const steps = sortResult.steps || [];
  const activeStep = steps[stepIndex] || steps[steps.length - 1] || {};
  const currentSnapshot = activeStep.snapshot || [];
  const activeIndices = activeStep.activeIndices || [];

  // Reset step index on algorithm or criterion change
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [algorithm, criterion, order]);

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  // Find max value in snapshot for bar scaling
  const maxVal = Math.max(...currentSnapshot.map(x => x.val || 1), 1);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold mb-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Algorithm Benchmarking & Step Visualizer</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sorting & Filtering Lab</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Compare Divide & Conquer (<span className="font-mono font-bold text-slate-800">Merge Sort</span>) against brute comparison algorithms (<span className="font-mono font-bold text-slate-800">Bubble Sort</span> & <span className="font-mono font-bold text-slate-800">Selection Sort</span>) with live state tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {sortResult.comparisons} Comparisons • {sortResult.swaps} Swaps
          </span>
        </div>
      </div>

      {/* Algorithm & Criterion Selectors */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Algorithm Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              Sorting Algorithm
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'bubble', label: 'Bubble' },
                { id: 'selection', label: 'Selection' },
                { id: 'merge', label: 'Merge' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setAlgorithm(item.id)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    algorithm === item.id
                      ? 'bg-white text-rose-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Criterion */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              Sorting Metric
            </label>
            <select
              value={criterion}
              onChange={(e) => setCriterion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
            >
              <option value="price">Price (₹ / day)</option>
              <option value="distance">Distance from Pune (km)</option>
              <option value="popularity">Popularity Score (1 - 100)</option>
              <option value="rating">Rating (Stars)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              Sort Order
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setOrder('asc')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  order === 'asc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Ascending (↑)
              </button>
              <button
                onClick={() => setOrder('desc')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  order === 'desc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Descending (↓)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Algorithm Complexity & Benchmarks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Best Case</p>
          <h4 className="text-lg font-mono font-black text-emerald-600 mt-1">
            {sortResult.timeComplexity.best}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Time complexity</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Average / Worst</p>
          <h4 className="text-lg font-mono font-black text-rose-600 mt-1">
            {sortResult.timeComplexity.worst}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">{sortResult.timeComplexity.average}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Auxiliary Space</p>
          <h4 className="text-lg font-mono font-black text-slate-900 mt-1">
            {sortResult.spaceComplexity}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Memory overhead</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Execution Time</p>
          <h4 className="text-lg font-mono font-black text-teal-600 mt-1">
            {sortResult.executionTimeMs} ms
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">DOM Performance API</p>
        </div>
      </div>

      {/* Visual Bar Chart & Stepper */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-rose-600" />
              <span>Step-by-Step Visualization (Step {stepIndex + 1} of {steps.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{activeStep.description}</p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition flex items-center space-x-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>
            <button
              onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}
              disabled={stepIndex === steps.length - 1}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setStepIndex(0);
                setIsPlaying(false);
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Reset to Step 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Visual Bars Display */}
        <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-4 px-2 bg-slate-900 rounded-2xl overflow-x-auto">
          {currentSnapshot.map((item, idx) => {
            const heightPercent = Math.max(15, Math.round((item.val / maxVal) * 100));
            const isActive = activeIndices.includes(idx);

            return (
              <div
                key={idx}
                className="flex-1 min-w-[50px] max-w-[85px] h-full flex flex-col justify-end items-center group relative"
              >
                {/* Metric Value Label on top */}
                <span className={`text-[10px] font-mono font-bold mb-1 transition-all ${
                  isActive ? 'text-rose-400 font-black scale-110' : 'text-slate-400'
                }`}>
                  {criterion === 'price' ? `₹${item.val}` : item.val}
                </span>

                {/* Animated Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-300 flex items-center justify-center ${
                    isActive
                      ? 'bg-rose-500 shadow-xl shadow-rose-500/70 ring-2 ring-white scale-105 animate-pulse'
                      : 'bg-teal-500 hover:bg-teal-400'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold text-white opacity-80 rotate-90 truncate">
                    {item.name.substring(0, 4)}
                  </span>
                </div>

                {/* City Name at bottom */}
                <span className="text-[10px] text-slate-300 mt-2 font-medium truncate w-full text-center">
                  {item.name}
                </span>
                <span className="text-[9px] font-mono text-slate-500">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sorted Results Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Final Sorted Destinations ({sortResult.algorithm})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sortResult.result.map((dest, rank) => (
            <div
              key={dest.id}
              className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Rank #{rank + 1}</span>
                  <span className="font-bold text-rose-600">
                    {criterion === 'price' && `₹${dest.sortVal}/day`}
                    {criterion === 'distance' && `${dest.sortVal} km`}
                    {criterion === 'popularity' && `${dest.sortVal} pts`}
                    {criterion === 'rating' && `⭐ ${dest.sortVal}`}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 text-sm">{dest.name}</h5>
                <p className="text-[11px] text-slate-400">{dest.state}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
