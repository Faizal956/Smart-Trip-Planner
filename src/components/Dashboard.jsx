import React, { useState } from 'react';
import {
  Compass,
  PlusCircle,
  Search,
  Route,
  Share2,
  Coins,
  Sparkles,
  ArrowUpDown,
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Layers,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';

export default function Dashboard({
  setActiveTab,
  savedTrips = [],
  onSelectTrip,
  onDeleteTrip,
  onViewDestination
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered destinations for quick search
  const filteredDestinations = DESTINATIONS.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Compute aggregate stats
  const totalDestinationsCount = DESTINATIONS.length;
  const popularDestinations = [...DESTINATIONS].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const totalSavedBudget = savedTrips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalPlacesVisitedInTrips = savedTrips.reduce((sum, t) => sum + (t.destinations ? t.destinations.length : 0), 0);

  const algorithmFeatures = [
    {
      id: 'dijkstra',
      title: "Dijkstra's Shortest Path",
      subtitle: "Graph Theory & Network Traversal",
      description: "Find minimum distance transit between Indian cities with step-by-step vertex relaxations.",
      icon: Route,
      complexity: "O((V + E) log V)",
      color: "from-blue-500 to-indigo-600",
      accent: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      id: 'tsp',
      title: "Multi-Destination TSP",
      subtitle: "Dynamic Programming + Bitmasking",
      description: "Optimize the visiting sequence of multiple tourist destinations to minimize total travel distance.",
      icon: Share2,
      complexity: "O(n² · 2ⁿ)",
      color: "from-teal-500 to-emerald-600",
      accent: "text-teal-600 bg-teal-50 border-teal-200"
    },
    {
      id: 'knapsack',
      title: "0/1 Knapsack Budget Optimizer",
      subtitle: "Dynamic Programming Optimization",
      description: "Maximize attraction popularity and experience value without exceeding travel spending limits.",
      icon: Coins,
      complexity: "O(n · W)",
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-600 bg-amber-50 border-amber-200"
    },
    {
      id: 'greedy',
      title: "Greedy Recommendation Engine",
      subtitle: "Greedy Heuristic Selection",
      description: "Recommend optimal destinations based on cost-benefit ratios, popularity, and user affinities.",
      icon: Sparkles,
      complexity: "O(n log n)",
      color: "from-purple-500 to-violet-600",
      accent: "text-purple-600 bg-purple-50 border-purple-200"
    },
    {
      id: 'sorting',
      title: "Sorting & Benchmark Visualizer",
      subtitle: "Bubble, Selection & Merge Sort",
      description: "Sort tourist spots by pricing, rating, and distance with live comparison and swap tracking.",
      icon: ArrowUpDown,
      complexity: "O(n²) to O(n log n)",
      color: "from-rose-500 to-pink-600",
      accent: "text-rose-600 bg-rose-50 border-rose-200"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-navy-900 to-slate-950 text-white p-8 md:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
        <div className="absolute bottom-0 right-1/4 -mb-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-float-reverse"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>DAA Algorithmic Engine Enabled</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Plan Smart. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">Travel Better.</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Welcome to <span className="text-white font-semibold">Smart Trip Planner</span> — a high-performance travel optimization platform powered by Design and Analysis of Algorithms (DAA). Solve shortest path with Dijkstra, minimize route tours with TSP Bitmasking, and maximize attractions with 0/1 Knapsack.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('planner')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Trip</span>
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition"
            >
              <span>Explore DAA Algorithm Lab</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics / Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-lift">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Planned Trips</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{savedTrips.length} Trips</h3>
            <p className="text-xs text-teal-600 font-medium mt-1 flex items-center space-x-1">
              <span>Saved in local storage</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-lift">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Planned Budget</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalSavedBudget > 0 ? totalSavedBudget.toLocaleString('en-IN') : '25,000'}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Managed via 0/1 Knapsack</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-lift">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Destinations Loaded</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalDestinationsCount} Cities</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">{totalPlacesVisitedInTrips} planned in itineraries</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between card-hover-lift">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active DAA Algorithms</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">5 Core Engines</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full functional logic</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Search Destinations Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Pune, Goa, Mumbai, Manali, Jaipur..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="font-semibold text-slate-700">Quick Filters:</span>
          {["Heritage", "Hill Station", "Beach", "Nature"].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Access to Core DAA Algorithms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">DAA Algorithmic Engines</h2>
            <p className="text-xs text-slate-500">Directly execute, inspect, and benchmark theoretical algorithms</p>
          </div>
          <button
            onClick={() => setActiveTab('lab')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
          >
            <span>Open Algorithm Lab</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {algorithmFeatures.map(algo => {
            const Icon = algo.icon;
            return (
              <div
                key={algo.id}
                onClick={() => setActiveTab(algo.id)}
                className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-500/50 card-hover-lift cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${algo.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {algo.complexity}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                    {algo.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 mt-0.5">{algo.subtitle}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{algo.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-teal-600">
                  <span>Launch Algorithm</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Destinations Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Popular Indian Destinations</h2>
            <p className="text-xs text-slate-500">Sample tourist hubs loaded with true coordinates and attractions</p>
          </div>
          <button
            onClick={() => setActiveTab('explorer')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
          >
            <span>View All Destinations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(searchTerm ? filteredDestinations : popularDestinations).slice(0, 4).map(dest => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{dest.rating}</span>
                </div>
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-semibold text-white">
                  {dest.state}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-lg font-bold leading-tight drop-shadow-sm">{dest.name}</h4>
                  <p className="text-[11px] text-slate-200 line-clamp-1">{dest.tagline}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Avg. Daily Budget</span>
                  <span className="font-bold text-slate-900">₹{dest.estimatedCostPerDay.toLocaleString('en-IN')}/day</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Recommended Stay</span>
                  <span className="font-medium text-slate-700">{dest.averageDurationDays} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Key Attractions</span>
                  <span className="font-medium text-teal-600">{dest.attractions.length} spots</span>
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="flex-1 py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs rounded-lg transition text-center"
                  >
                    Add to Trip
                  </button>
                  <button
                    onClick={() => {
                      if (onViewDestination) onViewDestination(dest);
                      else setActiveTab('explorer');
                    }}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trips Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Saved Trips</h2>
            <p className="text-xs text-slate-500">Stored in your browser's persistent localStorage</p>
          </div>
          <button
            onClick={() => setActiveTab('planner')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
          >
            <span>Plan New Route</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedTrips.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No trips planned yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start by selecting your origin, destinations, and budget in the Trip Planner to generate an optimized itinerary.
            </p>
            <button
              onClick={() => setActiveTab('planner')}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch Trip Planner</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTrips.map(trip => (
              <div
                key={trip.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-500/40 hover:shadow-sm transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono">{trip.dateCreated || 'Recent'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                      {trip.optimizedRoute ? 'TSP Optimized' : 'Standard'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition">
                    {trip.title || `${trip.startLocation?.toUpperCase()} Tour`}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    Route: {(trip.optimizedRoute || trip.destinations || []).map(id => id.toUpperCase()).join(' → ')}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Total Distance</span>
                      <span className="font-bold text-slate-800">{trip.totalDistance || 0} km</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Budget</span>
                      <span className="font-bold text-slate-800">₹{(trip.budget || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onSelectTrip) onSelectTrip(trip);
                      setActiveTab('summary');
                    }}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {onDeleteTrip && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTrip(trip.id);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded transition"
                      title="Delete trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
