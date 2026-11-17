import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Star,
  Clock,
  Coins,
  Search,
  Filter,
  ArrowRight,
  X,
  Compass,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';

export default function DestinationExplorer({ setActiveTab, onStartTripFrom, initialSelectedDest = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeModalDest, setActiveModalDest] = useState(initialSelectedDest);

  // Close modal on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalDest(null);
      }
    };
    if (activeModalDest) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalDest]);

  // Filter destinations
  const filtered = DESTINATIONS.filter(dest => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
    const matchesTag = selectedTag === 'All' || dest.tags.includes(selectedTag);

    return matchesSearch && matchesRegion && matchesTag;
  });

  const regions = ['All', 'West', 'North', 'South'];
  const tags = ['All', 'Heritage', 'Nature', 'Adventure', 'Food', 'Hill Station', 'Beach', 'Relaxation'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Comprehensive Indian Travel Dataset</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Destination Explorer</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Explore 20 iconic Indian tourist hubs with real-world geographical coordinates, daily stay budgets, and detailed attraction lists used by our DAA algorithms.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          Showing {filtered.length} of {DESTINATIONS.length} Cities
        </span>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Pune, Goa, Mumbai, Manali..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Region Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Region:</span>
            {regions.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedRegion === reg
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Category:</span>
            {tags.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedTag === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(dest => (
          <div
            key={dest.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs card-hover-lift group flex flex-col justify-between"
          >
            {/* Image Header */}
            <div className="relative h-52 overflow-hidden cursor-pointer" onClick={() => setActiveModalDest(dest)}>
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-extrabold text-slate-900 flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{dest.rating}</span>
                <span className="text-[10px] text-slate-400 font-normal">({dest.reviewsCount})</span>
              </div>

              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white">
                {dest.state} • {dest.region}
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-xl font-extrabold tracking-tight">{dest.name}</h3>
                <p className="text-xs text-slate-200 line-clamp-1">{dest.tagline}</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {dest.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Est. Daily Stay</span>
                  <span className="font-extrabold text-slate-900">₹{dest.estimatedCostPerDay.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Ideal Duration</span>
                  <span className="font-extrabold text-slate-900">{dest.averageDurationDays} Days</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Popularity Score</span>
                  <span className="font-bold text-teal-600">{dest.popularity} / 100</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Attractions</span>
                  <span className="font-bold text-slate-700">{dest.attractions.length} Landmarks</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {dest.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => setActiveModalDest(dest)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition text-center"
                >
                  View Landmarks
                </button>
                <button
                  onClick={() => {
                    if (onStartTripFrom) onStartTripFrom(dest.id);
                    setActiveTab('planner');
                  }}
                  className="py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Destination Detail Modal rendered cleanly via Portal */}
      {activeModalDest && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in-up"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalDest(null);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-60 overflow-hidden">
              <img
                src={activeModalDest.image}
                alt={activeModalDest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveModalDest(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer z-10"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs bg-teal-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-md uppercase">
                  {activeModalDest.region} India
                </span>
                <h2 className="text-2xl font-black mt-1">{activeModalDest.name}, {activeModalDest.state}</h2>
                <p className="text-xs text-slate-200">{activeModalDest.tagline}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">About Destination</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{activeModalDest.description}</p>
              </div>

              {/* Best Time & Climate */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Best Season to Visit</span>
                  <span className="font-bold text-slate-900">{activeModalDest.bestTimeToVisit}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Average Daily Budget</span>
                  <span className="font-bold text-slate-900">₹{activeModalDest.estimatedCostPerDay.toLocaleString('en-IN')}/day</span>
                </div>
              </div>

              {/* Key Attractions List (Knapsack Inputs) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                  <span>Landmarks & Sightseeing Activities ({activeModalDest.attractions.length})</span>
                  <span className="text-[10px] text-teal-600 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    0/1 Knapsack Inputs
                  </span>
                </h4>

                <div className="space-y-2">
                  {activeModalDest.attractions.map(attr => (
                    <div
                      key={attr.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:border-teal-400 transition"
                    >
                      <div>
                        <h5 className="font-bold text-slate-900">{attr.name}</h5>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                            {attr.category}
                          </span>
                          <span>Duration: {attr.durationHours} hrs</span>
                          <span>Popularity Value: <strong className="text-teal-700">{attr.popularityValue} pts</strong></span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                        {attr.cost === 0 ? 'Free' : `₹${attr.cost.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    const destId = activeModalDest.id;
                    setActiveModalDest(null);
                    if (onStartTripFrom) onStartTripFrom(destId);
                    setActiveTab('planner');
                  }}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow transition text-center cursor-pointer"
                >
                  Plan Trip from {activeModalDest.name}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalDest(null)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
