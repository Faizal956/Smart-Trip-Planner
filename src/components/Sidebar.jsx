import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Route,
  Share2,
  Coins,
  Sparkles,
  ArrowUpDown,
  MapPin,
  GraduationCap,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'planner', label: 'Trip Planner', icon: Compass, badge: 'Smart' },
    { id: 'explorer', label: 'Destinations', icon: MapPin, badge: '20' },
    { id: 'summary', label: 'My Saved Trips', icon: BookmarkCheck, badge: null },
  ];

  const algoNav = [
    { id: 'dijkstra', label: 'Dijkstra Shortest Path', icon: Route, tag: 'Graph' },
    { id: 'tsp', label: 'TSP Route Optimizer', icon: Share2, tag: 'DP + Bitmask' },
    { id: 'knapsack', label: '0/1 Knapsack Budget', icon: Coins, tag: 'DP' },
    { id: 'greedy', label: 'Greedy Recommendations', icon: Sparkles, tag: 'Greedy' },
    { id: 'sorting', label: 'Sorting Visualizer', icon: ArrowUpDown, tag: 'O(n²)/O(nlogn)' },
    { id: 'lab', label: 'DAA Algorithm Lab', icon: GraduationCap, tag: 'Theory' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-slate-300 transition-all duration-300 z-30 flex flex-col border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/50">
        {!collapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="truncate">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
                <span>Smart Trip</span>
                <span className="text-teal-400 font-extrabold">DAA</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Plan Smart. Travel Better.</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {/* Core Navigation */}
        <div>
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Trip Management
            </p>
          )}
          <div className="space-y-1">
            {mainNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                  } py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* DAA Algorithms Section */}
        <div>
          {!collapsed && (
            <div className="px-3 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <span>DAA Algorithms</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                Core Lab
              </span>
            </div>
          )}
          <div className="space-y-1">
            {algoNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                  } py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-teal-300'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && item.tag && (
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      {!collapsed ? (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 mb-1">
              <Cpu className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>DAA Academic Project</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Implemented with dynamic programming, greedy strategies, graph traversals & sorting.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800 text-center">
          <Cpu className="w-5 h-5 text-teal-400 mx-auto" />
        </div>
      )}
    </aside>
  );
}
