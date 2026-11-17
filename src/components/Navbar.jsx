import React from 'react';
import { Compass, Sparkles, PlusCircle, Search, Activity, BookOpen } from 'lucide-react';

const PAGE_META = {
  dashboard: {
    title: 'Smart Dashboard',
    subtitle: 'Overview of planned trips, active algorithms, and top Indian destinations.'
  },
  planner: {
    title: 'Intelligent Trip Planner',
    subtitle: 'Select cities, dates, budget and generate an optimal multi-stop itinerary.'
  },
  dijkstra: {
    title: 'Dijkstra Shortest Path Finder',
    subtitle: 'Calculate minimum road distances and vertex relaxations across Indian National Highways.'
  },
  tsp: {
    title: 'Multi-Destination Route Optimizer (TSP)',
    subtitle: 'Solve the Travelling Salesman Problem with Dynamic Programming and Bitmasking (Held-Karp).'
  },
  knapsack: {
    title: 'Smart Budget Optimizer (0/1 Knapsack)',
    subtitle: 'Maximize experience points within strict budget limits using dynamic programming.'
  },
  greedy: {
    title: 'Greedy Destination Recommendation',
    subtitle: 'Step-by-step heuristic optimization balancing cost, popularity, and user preferences.'
  },
  sorting: {
    title: 'Sorting & Filtering Lab',
    subtitle: 'Benchmark and visualize Bubble Sort, Selection Sort, and Merge Sort on travel metrics.'
  },
  explorer: {
    title: 'Destination Explorer',
    subtitle: 'Browse 20 iconic Indian destinations with attraction breakdown and real-time costs.'
  },
  lab: {
    title: 'DAA Algorithm Lab',
    subtitle: 'Theoretical foundations, recurrence formulas, and computational complexities.'
  },
  summary: {
    title: 'Trip Summary & Itinerary',
    subtitle: 'Complete day-by-day travel schedule, budget breakdown, and saved trips history.'
  }
};

export default function Navbar({ activeTab, setActiveTab, savedTripsCount = 0 }) {
  const currentMeta = PAGE_META[activeTab] || PAGE_META.dashboard;

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-8 flex items-center justify-between shadow-xs">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <span>{currentMeta.title}</span>
          {activeTab !== 'dashboard' && (
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              DAA Mode
            </span>
          )}
        </h2>
        <p className="text-xs text-slate-500 font-normal">{currentMeta.subtitle}</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Saved Trips counter pill */}
        <button
          onClick={() => setActiveTab('summary')}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition border border-slate-200"
        >
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Saved Trips: {savedTripsCount}</span>
        </button>

        {/* Primary CTA: New Trip */}
        <button
          onClick={() => setActiveTab('planner')}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Trip</span>
        </button>
      </div>
    </header>
  );
}
