import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TripPlanner from './components/TripPlanner';
import DijkstraFinder from './components/DijkstraFinder';
import TspOptimizer from './components/TspOptimizer';
import BudgetKnapsack from './components/BudgetKnapsack';
import GreedyRecommender from './components/GreedyRecommender';
import SortingVisualizer from './components/SortingVisualizer';
import DestinationExplorer from './components/DestinationExplorer';
import AlgorithmLab from './components/AlgorithmLab';
import TripSummary from './components/TripSummary';

const DEFAULT_SAMPLE_TRIP = {
  id: 'trip_default_sample',
  title: 'Maharashtra Heritage & Konkan Coast Tour',
  startLocation: 'pune',
  destinations: ['mumbai', 'lonavala', 'mahabaleshwar', 'goa'],
  routeOrder: ['pune', 'lonavala', 'mumbai', 'mahabaleshwar', 'goa', 'pune'],
  originalRouteOrder: ['pune', 'mumbai', 'lonavala', 'goa', 'mahabaleshwar', 'pune'],
  totalDistance: 1145,
  originalDistance: 1430,
  distanceSaved: 285,
  percentSaved: 20,
  startDate: '2025-01-20',
  numDays: 5,
  travelers: 2,
  budget: 40000,
  costBreakdown: {
    stayCost: 24200,
    transitCost: 5150,
    attractionsCost: 6200,
    total: 35550,
    remainingBudget: 4450
  },
  selectedAttractions: [
    { id: 'p1', name: 'Shaniwar Wada Palace', cost: 150, popularityValue: 92, location: 'Pune' },
    { id: 'l1', name: 'Tiger’s Leap Scenic Trek', cost: 100, popularityValue: 91, location: 'Lonavala' },
    { id: 'm1', name: 'Gateway of India & Colaba', cost: 200, popularityValue: 98, location: 'Mumbai' },
    { id: 'mb3', name: 'Mapro Garden Strawberry Tasting', cost: 600, popularityValue: 95, location: 'Mahabaleshwar' },
    { id: 'g1', name: 'Calangute Water Sports Safari', cost: 1800, popularityValue: 97, location: 'Goa' },
  ],
  dateCreated: 'Nov 17, 2026'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [selectedExplorerDest, setSelectedExplorerDest] = useState(null);

  // Load saved trips from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('smart_trip_planner_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedTrips(parsed);
          setActiveTrip(parsed[0]);
          return;
        }
      }
      // Initialize with default sample trip
      setSavedTrips([DEFAULT_SAMPLE_TRIP]);
      setActiveTrip(DEFAULT_SAMPLE_TRIP);
      localStorage.setItem('smart_trip_planner_trips', JSON.stringify([DEFAULT_SAMPLE_TRIP]));
    } catch (e) {
      console.error('Failed to load trips from localStorage:', e);
      setSavedTrips([DEFAULT_SAMPLE_TRIP]);
      setActiveTrip(DEFAULT_SAMPLE_TRIP);
    }
  }, []);

  // Save trip to localStorage
  const handleSaveTrip = (tripToSave) => {
    try {
      const existing = savedTrips.filter(t => t.id !== tripToSave.id);
      const updated = [tripToSave, ...existing];
      setSavedTrips(updated);
      localStorage.setItem('smart_trip_planner_trips', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save trip:', e);
    }
  };

  // Delete trip from localStorage
  const handleDeleteTrip = (tripId) => {
    try {
      const updated = savedTrips.filter(t => t.id !== tripId);
      setSavedTrips(updated);
      localStorage.setItem('smart_trip_planner_trips', JSON.stringify(updated));
      if (activeTrip?.id === tripId) {
        setActiveTrip(updated.length > 0 ? updated[0] : null);
      }
    } catch (e) {
      console.error('Failed to delete trip:', e);
    }
  };

  // When a new trip is generated in Trip Planner
  const handleTripGenerated = (newTrip) => {
    setActiveTrip(newTrip);
    handleSaveTrip(newTrip);
  };

  // Render active view component
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            savedTrips={savedTrips}
            onSelectTrip={(trip) => setActiveTrip(trip)}
            onDeleteTrip={handleDeleteTrip}
            onViewDestination={(dest) => {
              setSelectedExplorerDest(dest);
              setActiveTab('explorer');
            }}
          />
        );
      case 'planner':
        return (
          <TripPlanner
            setActiveTab={setActiveTab}
            onTripGenerated={handleTripGenerated}
            activeTrip={activeTrip}
          />
        );
      case 'dijkstra':
        return <DijkstraFinder />;
      case 'tsp':
        return <TspOptimizer />;
      case 'knapsack':
        return <BudgetKnapsack />;
      case 'greedy':
        return <GreedyRecommender />;
      case 'sorting':
        return <SortingVisualizer />;
      case 'explorer':
        return (
          <DestinationExplorer
            setActiveTab={setActiveTab}
            initialSelectedDest={selectedExplorerDest}
            onStartTripFrom={(cityId) => {
              setActiveTab('planner');
            }}
          />
        );
      case 'lab':
        return <AlgorithmLab setActiveTab={setActiveTab} />;
      case 'summary':
        return (
          <TripSummary
            activeTrip={activeTrip}
            savedTrips={savedTrips}
            onSaveCurrentTrip={handleSaveTrip}
            onLoadTrip={(trip) => setActiveTrip(trip)}
            onDeleteTrip={handleDeleteTrip}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return <Dashboard setActiveTab={setActiveTab} savedTrips={savedTrips} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedTripsCount={savedTrips.length}
        />

        {/* Page Content */}
        <main key={activeTab} className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in-up">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
