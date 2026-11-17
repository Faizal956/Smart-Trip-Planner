import React, { useState, useMemo } from 'react';
import {
  Route,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { NETWORK_EDGES } from '../data/graphData';
import { runDijkstra } from '../algorithms/dijkstra';
import InteractiveMap from './InteractiveMap';

// Graph Node positions for the custom SVG network topology
const GRAPH_COORDS = {
  manali: { x: 260, y: 25, label: "Manali" },
  shimla: { x: 275, y: 55, label: "Shimla" },
  amritsar: { x: 205, y: 45, label: "Amritsar" },
  rishikesh: { x: 310, y: 70, label: "Rishikesh" },
  delhi: { x: 260, y: 95, label: "Delhi" },
  jaipur: { x: 195, y: 130, label: "Jaipur" },
  agra: { x: 285, y: 135, label: "Agra" },
  udaipur: { x: 165, y: 175, label: "Udaipur" },
  varanasi: { x: 370, y: 160, label: "Varanasi" },
  darjeeling: { x: 440, y: 120, label: "Darjeeling" },
  kolkata: { x: 435, y: 210, label: "Kolkata" },
  mumbai: { x: 135, y: 245, label: "Mumbai" },
  lonavala: { x: 175, y: 265, label: "Lonavala" },
  pune: { x: 215, y: 275, label: "Pune" },
  mahabaleshwar: { x: 185, y: 315, label: "Mahabaleshwar" },
  hyderabad: { x: 300, y: 285, label: "Hyderabad" },
  goa: { x: 175, y: 365, label: "Goa" },
  bengaluru: { x: 260, y: 350, label: "Bengaluru" },
  ooty: { x: 220, y: 395, label: "Ooty" },
  kochi: { x: 200, y: 435, label: "Kochi" }
};

export default function DijkstraFinder() {
  const [source, setSource] = useState('mumbai');
  const [destination, setDestination] = useState('goa');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute Dijkstra result
  const dijkstraResult = useMemo(() => {
    return runDijkstra(source, destination);
  }, [source, destination]);

  const steps = dijkstraResult.steps || [];
  const activeStep = steps[currentStepIndex] || steps[steps.length - 1] || {};

  // Check if an edge is part of the shortest path
  const isEdgeInShortestPath = (u, v) => {
    if (!dijkstraResult.path || dijkstraResult.path.length < 2) return false;
    for (let i = 0; i < dijkstraResult.path.length - 1; i++) {
      const a = dijkstraResult.path[i];
      const b = dijkstraResult.path[i + 1];
      if ((a === u && b === v) || (a === v && b === u)) return true;
    }
    return false;
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const handleJumpToEnd = () => {
    setCurrentStepIndex(steps.length - 1);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
            <Route className="w-3.5 h-3.5 text-blue-600" />
            <span>Graph Shortest Path Algorithm</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dijkstra's Shortest Path Explorer</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Calculates the single-source shortest path across the Indian National Highway network using non-negative edge relaxation.
          </p>
        </div>

        {/* Source & Destination Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Source (Start)</label>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setCurrentStepIndex(0);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500"
            >
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 text-slate-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Destination</label>
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setCurrentStepIndex(0);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500"
            >
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Shortest Path Distance</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {dijkstraResult.totalDistance} km
          </h3>
          <p className="text-xs text-teal-600 font-semibold mt-1">
            {dijkstraResult.path.length} vertices traversed
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Vertex Relaxations</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {dijkstraResult.metrics.relaxations} times
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {dijkstraResult.metrics.comparisons} distance checks
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Time Complexity</p>
          <h3 className="text-lg font-black font-mono text-slate-900 mt-1">
            {dijkstraResult.metrics.timeComplexity}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Min-Priority Queue Implementation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Space Complexity</p>
          <h3 className="text-lg font-black font-mono text-slate-900 mt-1">
            {dijkstraResult.metrics.spaceComplexity}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Adjacency List + Distances Map</p>
        </div>
      </div>

      {/* Main Grid: Visual Graph on Left, Step-by-Step Execution on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Graph Representation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Network Topology Graph</h3>
                <p className="text-xs text-slate-500">Vertices = Cities, Edges = National Highways (km)</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-teal-500 inline-block"></span>
                  <span className="text-slate-600 font-medium">Shortest Path</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
                  <span className="text-slate-600 font-medium">Alternative Highway</span>
                </span>
              </div>
            </div>

            {/* SVG Visual Graph Representation */}
            <div className="relative w-full h-[450px] bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 520 460" className="w-full h-full">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Draw Network Edges */}
                {NETWORK_EDGES.map((edge, index) => {
                  const p1 = GRAPH_COORDS[edge.from];
                  const p2 = GRAPH_COORDS[edge.to];
                  if (!p1 || !p2) return null;

                  const isPath = isEdgeInShortestPath(edge.from, edge.to);
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;

                  return (
                    <g key={`edge-${index}`}>
                      {/* Base Edge Line */}
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={isPath ? '#0d9488' : '#334155'}
                        strokeWidth={isPath ? 5 : 2}
                        strokeDasharray={isPath ? 'none' : '4,4'}
                        filter={isPath ? 'url(#glow)' : undefined}
                      />
                      {/* Animated Flowing Pulse along Shortest Path */}
                      {isPath && (
                        <line
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke="#5eead4"
                          strokeWidth="3"
                          className="animate-dash-flow"
                        />
                      )}
                      {/* Edge Weight Pill */}
                      <rect
                        x={midX - 18}
                        y={midY - 9}
                        width="36"
                        height="18"
                        rx="9"
                        fill={isPath ? '#0d9488' : '#1e293b'}
                        stroke={isPath ? '#2dd4bf' : '#475569'}
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        fill={isPath ? '#ffffff' : '#94a3b8'}
                        fontSize="9"
                        fontWeight="700"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {/* Draw Graph Vertices (Nodes) */}
                {Object.entries(GRAPH_COORDS).map(([id, node]) => {
                  const isSource = id === source;
                  const isDest = id === destination;
                  const isInPath = dijkstraResult.path.includes(id);
                  const isVisitedInStep = activeStep.visitedSnapshot?.includes(id);

                  let fillColor = '#1e293b';
                  let strokeColor = '#64748b';
                  let textColor = '#cbd5e1';

                  if (isSource) {
                    fillColor = '#0d9488';
                    strokeColor = '#5eead4';
                    textColor = '#ffffff';
                  } else if (isDest) {
                    fillColor = '#2563eb';
                    strokeColor = '#93c5fd';
                    textColor = '#ffffff';
                  } else if (isInPath) {
                    fillColor = '#0f766e';
                    strokeColor = '#2dd4bf';
                    textColor = '#ffffff';
                  } else if (isVisitedInStep) {
                    fillColor = '#334155';
                    strokeColor = '#94a3b8';
                  }

                  return (
                    <g key={`node-${id}`} className="cursor-pointer">
                      {/* Pulse circle for source & dest */}
                      {(isSource || isDest) && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="18"
                          fill="none"
                          stroke={isSource ? '#14b8a6' : '#3b82f6'}
                          strokeWidth="2"
                          className="pulse-ring"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="12"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill={textColor}
                        fontSize="9"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {id.substring(0, 2).toUpperCase()}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 24}
                        fill="#f8fafc"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Path details route table */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Selected Route Sequence ({dijkstraResult.path.map(id => id.toUpperCase()).join(' → ')})
              </h4>
              <div className="space-y-2">
                {dijkstraResult.pathDetails.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 capitalize">{seg.from}</span>
                        <span className="text-slate-400 mx-1.5">→</span>
                        <span className="font-bold text-slate-900 capitalize">{seg.to}</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">{seg.highway}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      {seg.distance} km
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Trace & Algorithm Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step-by-Step Execution</h3>
                <p className="text-xs text-slate-500">Step {currentStepIndex + 1} of {steps.length}</p>
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 transition"
                >
                  Prev
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-xs font-bold text-white transition"
                >
                  Next
                </button>
                <button
                  onClick={handleJumpToEnd}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition"
                  title="Jump to Final Step"
                >
                  End
                </button>
              </div>
            </div>

            {/* Active Step Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-semibold text-slate-900">
                Action: <span className="font-normal text-slate-700">{activeStep.description}</span>
              </p>
              {activeStep.currentNode && (
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                  <span>Current Vertex: <strong className="text-teal-700 uppercase">{activeStep.currentNode}</strong></span>
                  <span>•</span>
                  <span>Tentative Distance: <strong className="text-slate-800">{activeStep.currentDist ?? 0} km</strong></span>
                </div>
              )}
            </div>

            {/* Tentative Distance Table at this step */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Distance Vector at Step {currentStepIndex + 1}
              </h4>
              <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-2">Vertex</th>
                      <th className="p-2">Shortest Dist</th>
                      <th className="p-2">Visited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {DESTINATIONS.map(d => {
                      const dist = activeStep.tableSnapshot ? activeStep.tableSnapshot[d.id] : Infinity;
                      const isVisited = activeStep.visitedSnapshot?.includes(d.id);
                      return (
                        <tr key={d.id} className={d.id === activeStep.currentNode ? 'bg-teal-50/70 font-bold' : ''}>
                          <td className="p-2 font-sans font-medium text-slate-900 capitalize">{d.name}</td>
                          <td className="p-2 text-teal-700">
                            {dist === Infinity ? '∞' : `${dist} km`}
                          </td>
                          <td className="p-2 font-sans">
                            {isVisited ? (
                              <span className="text-emerald-600 font-bold">✓ True</span>
                            ) : (
                              <span className="text-slate-400">False</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Academic Theoretical Insight */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-blue-800">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>DAA Theoretical Note</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800/90">
                Dijkstra maintains a greedy choice property: the vertex with the smallest tentative distance in the priority queue is always finalized next. It is guaranteed to be optimal as long as all edge weights are non-negative ($w(u, v) \ge 0$).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
