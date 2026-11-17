import React, { useState, useMemo } from 'react';
import {
  Coins,
  Check,
  X,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
  Table,
  Layers,
  Info,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { solveKnapsack } from '../algorithms/knapsack';

// Initial pool of attractions across multiple Indian destinations
const INITIAL_ATTRACTIONS = [
  { id: 'attr-1', name: 'Calangute Water Sports (Goa)', cost: 1800, popularityValue: 97, category: 'Adventure' },
  { id: 'attr-2', name: 'Amer Fort & Elephant Tour (Jaipur)', cost: 850, popularityValue: 99, category: 'Heritage' },
  { id: 'attr-3', name: 'Elephanta Caves Ferry (Mumbai)', cost: 750, popularityValue: 90, category: 'Heritage' },
  { id: 'attr-4', name: 'Solang Valley Paragliding (Manali)', cost: 2400, popularityValue: 98, category: 'Adventure' },
  { id: 'attr-5', name: 'Mapro Garden Strawberry Tour (Mahabaleshwar)', cost: 600, popularityValue: 95, category: 'Food' },
  { id: 'attr-6', name: 'Lake Pichola Sunset Cruise (Udaipur)', cost: 950, popularityValue: 97, category: 'Relaxation' },
  { id: 'attr-7', name: 'Old Delhi Chandni Chowk Food Walk', cost: 750, popularityValue: 98, category: 'Food' },
  { id: 'attr-8', name: 'Shaniwar Wada Palace (Pune)', cost: 150, popularityValue: 92, category: 'Heritage' },
  { id: 'attr-9', name: 'Tiger’s Leap Scenic Trek (Lonavala)', cost: 100, popularityValue: 91, category: 'Nature' },
  { id: 'attr-10', name: 'Ramoji Film City Full Day (Hyderabad)', cost: 1500, popularityValue: 93, category: 'Adventure' },
];

export default function BudgetKnapsack() {
  const [budget, setBudget] = useState(4000);
  const [attractions, setAttractions] = useState(INITIAL_ATTRACTIONS);
  const [showDpTable, setShowDpTable] = useState(true);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState(500);
  const [newItemValue, setNewItemValue] = useState(90);
  const [newItemCategory, setNewItemCategory] = useState('Heritage');

  // Run 0/1 Knapsack Dynamic Programming
  const knapsackResult = useMemo(() => {
    return solveKnapsack(attractions, budget, 50);
  }, [attractions, budget]);

  const handleAddAttraction = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newAttr = {
      id: `attr-${Date.now()}`,
      name: newItemName.trim(),
      cost: parseInt(newItemCost) || 100,
      popularityValue: parseInt(newItemValue) || 50,
      category: newItemCategory
    };

    setAttractions([...attractions, newAttr]);
    setNewItemName('');
  };

  const handleRemoveAttraction = (id) => {
    setAttractions(attractions.filter(a => a.id !== id));
  };

  const handleResetToDefault = () => {
    setAttractions(INITIAL_ATTRACTIONS);
    setBudget(4000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-2">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>0/1 Knapsack Problem (Dynamic Programming)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Budget Optimizer</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Solves the classical 0/1 Knapsack problem where items (attractions) have weights (costs in ₹) and values (popularity scores), choosing the subset that maximizes total experience within the budget.
          </p>
        </div>

        <button
          onClick={handleResetToDefault}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Budget Selector & Top Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Budget Control (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Sightseeing / Attraction Budget
            </label>
            <span className="text-xl font-black text-amber-600">
              ₹{budget.toLocaleString('en-IN')}
            </span>
          </div>

          <input
            type="range"
            min="500"
            max="10000"
            step="250"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>₹500 (Economy)</span>
            <span>₹5,000 (Standard)</span>
            <span>₹10,000 (Luxury)</span>
          </div>

          {/* Budget Utilization Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600">Budget Utilization:</span>
              <span className="text-amber-700 font-bold">{knapsackResult.budgetUtilizationPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-amber-500 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, knapsackResult.budgetUtilizationPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* DP Knapsack Metrics (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Optimal Value</p>
            <h4 className="text-2xl font-black text-amber-600 mt-1">
              {knapsackResult.totalValue} <span className="text-xs font-semibold text-slate-400">pts</span>
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Total popularity score</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Selected Cost</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">
              ₹{knapsackResult.totalCost.toLocaleString('en-IN')}
            </h4>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Within spending limit</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Remaining Budget</p>
            <h4 className="text-2xl font-black text-slate-700 mt-1">
              ₹{knapsackResult.remainingBudget.toLocaleString('en-IN')}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Surplus unspent</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Accepted Count</p>
            <h4 className="text-2xl font-black text-teal-600 mt-1">
              {knapsackResult.selectedItems.length} of {attractions.length}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">{knapsackResult.rejectedItems.length} rejected</p>
          </div>
        </div>
      </div>

      {/* Selected vs Rejected Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Attractions (Green) */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Selected Attractions ({knapsackResult.selectedItems.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal Choice
            </span>
          </div>

          {knapsackResult.selectedItems.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Budget too low to select any attraction. Increase budget above ₹{Math.min(...attractions.map(a => a.cost))}
            </p>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {knapsackResult.selectedItems.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs card-hover-lift"
                >
                  <div className="pr-2">
                    <h5 className="font-bold text-slate-900">{item.name}</h5>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        {item.category || 'Sightseeing'}
                      </span>
                      <span>Value: <strong className="text-emerald-700">{item.popularityValue} pts</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{item.cost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {(item.popularityValue / item.cost * 100).toFixed(1)} pts/₹100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rejected Attractions (Red/Slate) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900">
                Excluded / Rejected ({knapsackResult.rejectedItems.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Exceeded Cost/Value Ratio
            </span>
          </div>

          {knapsackResult.rejectedItems.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              All attractions fit within the current budget!
            </p>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {knapsackResult.rejectedItems.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs opacity-75 hover:opacity-100 transition"
                >
                  <div className="pr-2">
                    <h5 className="font-bold text-slate-800">{item.name}</h5>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold text-[10px]">
                        {item.category || 'Sightseeing'}
                      </span>
                      <span>Value: {item.popularityValue} pts</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-700 text-sm">
                      ₹{item.cost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-rose-500 font-semibold block">
                      Not optimal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Attraction Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-teal-600" />
          <span>Add Custom Attraction or Activity to Pool</span>
        </h3>

        <form onSubmit={handleAddAttraction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Attraction Name</label>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. Scuba Diving at Grand Island"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Cost (₹)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={newItemCost}
              onChange={(e) => setNewItemCost(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Popularity / Value (1-100)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Knapsack</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dynamic Programming Matrix Grid Visualization */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Table className="w-4 h-4 text-teal-600" />
              <span>Dynamic Programming 2D Table: dp[i][w]</span>
            </h3>
            <p className="text-xs text-slate-500">
              Rows: Items (0 to {attractions.length}), Columns: Sampled Budget Subcapacities (Step ₹{knapsackResult.step})
            </p>
          </div>
          <button
            onClick={() => setShowDpTable(!showDpTable)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            {showDpTable ? "Hide Matrix" : "Show Matrix"}
          </button>
        </div>

        {showDpTable && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 min-w-[180px]">Item i \ Sub-Budget (w)</th>
                  {knapsackResult.tableColumns?.map((col, idx) => (
                    <th key={idx} className="p-2.5 text-center min-w-[55px]">
                      ₹{col.costRs}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {knapsackResult.tableRows?.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={row.isIncluded ? 'bg-teal-50/70 font-bold' : (rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')}
                  >
                    <td className="p-2.5 border-r border-slate-200 font-sans text-xs text-slate-800 flex items-center space-x-1.5 truncate">
                      {row.isIncluded && <span className="w-2 h-2 rounded-full bg-teal-500 inline-block shrink-0"></span>}
                      <span className="truncate">{row.itemName}</span>
                    </td>
                    {row.values?.map((val, cIdx) => (
                      <td key={cIdx} className="p-2 text-center text-slate-700">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Theoretical Notes */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-2 font-mono">
          <p className="text-amber-400 font-bold font-sans">Bellman Recurrence Formulation:</p>
          <p>dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weight[i]] + value[i])</p>
          <p className="text-slate-400 text-[11px] font-sans">
            Time Complexity: O(n · W) | Space Complexity: O(n · W) where n = {attractions.length} items and W = budget capacity. Optimal substructure guarantees global maximum value without fractional splitting.
          </p>
        </div>
      </div>
    </div>
  );
}
