import React, { useState } from 'react';
import {
  Compass,
  BookmarkCheck,
  Calendar,
  Clock,
  Car,
  Coins,
  MapPin,
  CheckCircle2,
  Printer,
  Trash2,
  ArrowRight,
  Share2,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import InteractiveMap from './InteractiveMap';

export default function TripSummary({
  activeTrip,
  savedTrips = [],
  onSaveCurrentTrip,
  onLoadTrip,
  onDeleteTrip,
  setActiveTab
}) {
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Fallback demo trip if none currently active
  const trip = activeTrip || (savedTrips.length > 0 ? savedTrips[0] : {
    id: 'demo_trip',
    title: 'Maharashtra & Goa Golden Triangle Tour',
    startLocation: 'pune',
    destinations: ['mumbai', 'lonavala', 'mahabaleshwar', 'goa'],
    routeOrder: ['pune', 'lonavala', 'mumbai', 'mahabaleshwar', 'goa', 'pune'],
    totalDistance: 1145,
    distanceSaved: 285,
    percentSaved: 20,
    startDate: '2025-01-15',
    numDays: 5,
    travelers: 2,
    budget: 35000,
    costBreakdown: {
      stayCost: 21800,
      transitCost: 5150,
      attractionsCost: 5900,
      total: 32850,
      remainingBudget: 2150
    },
    selectedAttractions: [
      { id: '1', name: 'Shaniwar Wada (Pune)', cost: 150, popularityValue: 92, location: 'Pune' },
      { id: '2', name: 'Karla Buddhist Caves (Lonavala)', cost: 250, popularityValue: 88, location: 'Lonavala' },
      { id: '3', name: 'Gateway of India (Mumbai)', cost: 200, popularityValue: 98, location: 'Mumbai' },
      { id: '4', name: 'Arthur’s Seat (Mahabaleshwar)', cost: 150, popularityValue: 92, location: 'Mahabaleshwar' },
      { id: '5', name: 'Calangute Water Sports (Goa)', cost: 1800, popularityValue: 97, location: 'Goa' },
    ],
    dateCreated: 'Nov 17, 2026'
  });

  const handleSave = () => {
    if (onSaveCurrentTrip) {
      onSaveCurrentTrip(trip);
      setIsSavedFeedback(true);
      setTimeout(() => setIsSavedFeedback(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate day-by-day travel schedule
  const scheduleDays = [];
  const route = trip.routeOrder || [trip.startLocation, ...(trip.destinations || [])];
  const totalDays = trip.numDays || Math.max(3, route.length);

  for (let d = 1; d <= totalDays; d++) {
    const cityIdx = Math.min(d - 1, route.length - 1);
    const currentCityId = route[cityIdx];
    const currentDest = DESTINATIONS.find(dest => dest.id === currentCityId);
    const nextCityId = d < totalDays && cityIdx + 1 < route.length ? route[cityIdx + 1] : null;
    const nextDest = DESTINATIONS.find(dest => dest.id === nextCityId);

    scheduleDays.push({
      day: d,
      city: currentDest?.name || currentCityId?.toUpperCase() || 'Destination',
      state: currentDest?.state || 'India',
      isTransitDay: nextCityId !== null && nextCityId !== currentCityId,
      nextCity: nextDest?.name || null,
      description: currentDest?.tagline || 'Explore local landmarks and scenic sights.',
      attractions: (trip.selectedAttractions || []).filter(a => a.location?.toLowerCase().includes(currentCityId) || a.cityId === currentCityId)
    });
  }

  return (
    <div className="space-y-8 pb-16 print:p-0 print:space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:border-none print:shadow-none">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-2 print:hidden">
            <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Optimal DAA Travel Itinerary</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {trip.title || 'Multi-City Tour Itinerary'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generated with Travelling Salesman Problem (Held-Karp) & 0/1 Knapsack optimization.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Itinerary</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSavedFeedback}
            className={`inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow transition ${
              isSavedFeedback
                ? 'bg-emerald-600 text-white'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{isSavedFeedback ? 'Saved to LocalStorage!' : 'Save Trip'}</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:border-slate-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Distance</span>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {trip.totalDistance} <span className="text-xs font-semibold text-slate-400">km</span>
          </h4>
          <span className="text-[11px] text-teal-600 font-semibold mt-0.5 block">
            {trip.percentSaved ? `${trip.percentSaved}% TSP distance saved` : 'Optimized route'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:border-slate-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Budget</span>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            ₹{(trip.costBreakdown?.total || trip.budget || 0).toLocaleString('en-IN')}
          </h4>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            ₹{(trip.costBreakdown?.remainingBudget || 0).toLocaleString('en-IN')} surplus
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:border-slate-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Trip Schedule</span>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {trip.numDays || 4} Days
          </h4>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            {trip.travelers || 2} Travelers
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:border-slate-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sightseeing Spots</span>
          <h4 className="text-2xl font-black text-teal-600 mt-1">
            {(trip.selectedAttractions || []).length} Attractions
          </h4>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">0/1 Knapsack Max Value</span>
        </div>
      </div>

      {/* Route Order and Interactive Map */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 print:border-slate-300">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Optimized Visiting Sequence</h3>
          <p className="text-xs text-slate-500">Calculated by Held-Karp Dynamic Programming (Bitmasking)</p>
        </div>

        {/* Route Chain Pills */}
        <div className="flex flex-wrap items-center gap-2 py-2">
          {route.map((cityId, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="capitalize">{DESTINATIONS.find(d => d.id === cityId)?.name || cityId}</span>
              </div>
              {idx < route.length - 1 && (
                <span className="text-slate-400 font-bold text-xs">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Map */}
        <div className="print:hidden">
          <InteractiveMap
            destinationIds={trip.destinations || []}
            routeOrder={trip.routeOrder || []}
            height="360px"
          />
        </div>
      </div>

      {/* Day-by-Day Travel Schedule */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6 print:border-slate-300">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          <span>Day-by-Day Travel Schedule</span>
        </h3>

        <div className="space-y-4">
          {scheduleDays.map((dayItem) => (
            <div
              key={dayItem.day}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-extrabold text-xs">
                    Day {dayItem.day}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {dayItem.city}, {dayItem.state}
                  </h4>
                </div>

                {dayItem.isTransitDay && dayItem.nextCity && (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    <Car className="w-3.5 h-3.5" />
                    <span>Transit route to {dayItem.nextCity}</span>
                  </span>
                )}
              </div>

              <p className="text-slate-600">{dayItem.description}</p>

              {/* Day Attractions */}
              {dayItem.attractions && dayItem.attractions.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Planned Activities (Knapsack Selected):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dayItem.attractions.map((attr, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium text-[11px] flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{attr.name}</span>
                        <span className="text-slate-400 font-mono">({attr.cost === 0 ? 'Free' : `₹${attr.cost}`})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Financial Cost Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 print:border-slate-300">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Coins className="w-4 h-4 text-teal-600" />
          <span>Expenditure Allocation & Budget Utilization</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Accommodations & Stays</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">
              ₹{(trip.costBreakdown?.stayCost || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Based on destination daily rates</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Transit & Highway Fuel</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">
              ₹{(trip.costBreakdown?.transitCost || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Based on {trip.totalDistance} km travel</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Activities & Sightseeing</span>
            <span className="text-lg font-black text-slate-900 mt-1 block">
              ₹{(trip.costBreakdown?.attractionsCost || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-teal-600 font-semibold">Optimized via 0/1 Knapsack</span>
          </div>
        </div>
      </div>

      {/* Saved Trips History (from localStorage) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Saved Trips History</h3>
            <p className="text-xs text-slate-500">Persisted across sessions in browser localStorage</p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            {savedTrips.length} Saved
          </span>
        </div>

        {savedTrips.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No saved trips yet. Click "Save Trip" above to bookmark this itinerary.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedTrips.map(saved => (
              <div
                key={saved.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{saved.dateCreated || 'Recent'}</span>
                    <span className="font-bold text-teal-700">{saved.totalDistance} km</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{saved.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {(saved.routeOrder || saved.destinations || []).map(id => id.toUpperCase()).join(' → ')}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onLoadTrip && onLoadTrip(saved)}
                    className="font-bold text-teal-600 hover:text-teal-700 text-xs"
                  >
                    Load Itinerary
                  </button>
                  <button
                    onClick={() => onDeleteTrip && onDeleteTrip(saved.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
