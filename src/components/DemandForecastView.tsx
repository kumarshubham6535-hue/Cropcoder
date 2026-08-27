import React, { useState, useMemo } from 'react';
import { REGIONAL_HISTORICAL_DATASETS } from '../data/forecastingData';
import { generateCropForecast } from '../services/forecastingEngine';
import { TrendingUp, Sparkles, DollarSign, Calendar, BarChart2, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const DemandForecastView: React.FC = () => {
  const [selectedCropId, setSelectedCropId] = useState<string>('onion');

  const dataset = useMemo(() => {
    return REGIONAL_HISTORICAL_DATASETS.find(d => d.cropId === selectedCropId) || REGIONAL_HISTORICAL_DATASETS[0];
  }, [selectedCropId]);

  const forecast = useMemo(() => {
    return generateCropForecast(selectedCropId, dataset.district);
  }, [selectedCropId, dataset.district]);

  // Compute 3-month moving average for the historical data
  const movingAverages = useMemo(() => {
    const hist = dataset.history;
    return hist.map((item, idx) => {
      if (idx < 2) return item.demandVolumeQuintals;
      const sum = hist[idx].demandVolumeQuintals + hist[idx - 1].demandVolumeQuintals + hist[idx - 2].demandVolumeQuintals;
      return Math.round(sum / 3);
    });
  }, [dataset]);

  return (
    <div id="demand-forecast-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-stone-800">
      {/* Top Banner */}
      <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1B4332] text-xs font-mono font-bold mb-1">
            <span>Requirement #3 • Holt-Winters & Linear Regression</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            AI Demand & Fair Farmgate Price Forecasting
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Analyzes 12-month historical wholesale APMC arrivals and seasonal consumption trends to calculate expected demand and suggested fair prices.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-stone-600">Select Commodity:</label>
          <select
            id="forecast-crop-select"
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 shadow-xs cursor-pointer focus:ring-2 focus:ring-[#1B4332]"
          >
            {REGIONAL_HISTORICAL_DATASETS.map((d) => (
              <option key={d.cropId} value={d.cropId}>
                {d.cropNameEn} ({d.district}, {d.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Core Forecast Outputs (The 2 Required Deliverables) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Output 1: Expected Demand Next Month */}
        <div className="bg-white p-5 rounded-2xl border-2 border-amber-300/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Expected Demand Next Month</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-stone-900">
            {forecast.predictedDemandQuintals.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-semibold text-stone-500">Quintals</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {forecast.demandTrend === 'rising' ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-4 h-4" /> Rising Demand Trend
              </span>
            ) : (
              <span className="text-amber-700 font-bold flex items-center gap-0.5">
                <ArrowDownRight className="w-4 h-4" /> Stable / Normalized Trend
              </span>
            )}
            <span className="text-stone-400">• High Confidence ({forecast.confidenceScore}%)</span>
          </div>
        </div>

        {/* Output 2: Suggested Price */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-400 shadow-xs space-y-2 bg-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-black uppercase tracking-wider">
            <span>Suggested Fair Farmgate Price</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-[#1B4332]">
            ₹{forecast.suggestedFarmerPrice}{' '}
            <span className="text-xs font-semibold text-stone-500">/ Quintal (₹{(forecast.suggestedFarmerPrice / 100).toFixed(1)}/kg)</span>
          </div>
          <div className="text-xs text-emerald-800 font-bold">
            +{forecast.farmerMarginGainPercent}% higher farmer earnings vs local mandi
          </div>
        </div>

        {/* Output 3: Recommended Consumer Direct Price */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
            <span>Recommended Consumer Price</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-stone-900">
            ₹{forecast.recommendedConsumerPrice}{' '}
            <span className="text-xs font-semibold text-stone-500">/ Quintal (₹{(forecast.recommendedConsumerPrice / 100).toFixed(1)}/kg)</span>
          </div>
          <div className="text-xs text-emerald-700 font-bold">
            -{forecast.consumerPriceDropPercent}% lower than traditional retail shop price
          </div>
        </div>
      </div>

      {/* Historical Dataset & Mathematical Computation Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#1B4332]" />
              <span>Historical Mandi Arrival & Price Dataset — {dataset.cropNameEn}</span>
            </h2>
            <p className="text-xs text-stone-500">
              Region: {dataset.district}, {dataset.state} • Basis for client-side regression and Holt smoothing
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded">
            12 Historical Cycles
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <th className="p-2.5">Month</th>
                <th className="p-2.5">Arrival Volume (Qtl)</th>
                <th className="p-2.5">3-Month Moving Avg</th>
                <th className="p-2.5">Mandi Price (₹/Qtl)</th>
                <th className="p-2.5">Direct Farmgate (₹/Qtl)</th>
                <th className="p-2.5">Retail Price (₹/Qtl)</th>
                <th className="p-2.5">Farmer Margin Loss in APMC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {dataset.history.map((row, idx) => {
                const middlemanMargin = row.consumerRetailPrice - row.avgMandiPrice;
                const farmerLossPercent = Math.round(((row.directFarmerPrice - row.avgMandiPrice) / row.avgMandiPrice) * 100);

                return (
                  <tr key={row.month} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-2.5 font-bold">{row.month}</td>
                    <td className="p-2.5 font-mono">{row.demandVolumeQuintals.toLocaleString('en-IN')}</td>
                    <td className="p-2.5 font-mono text-stone-500">{movingAverages[idx].toLocaleString('en-IN')}</td>
                    <td className="p-2.5 font-bold text-rose-700">₹{row.avgMandiPrice}</td>
                    <td className="p-2.5 font-black text-[#1B4332]">₹{row.directFarmerPrice}</td>
                    <td className="p-2.5 font-semibold text-stone-700">₹{row.consumerRetailPrice}</td>
                    <td className="p-2.5">
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        -{farmerLossPercent}% vs Direct
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 3-Month Projection Strip */}
        <div className="pt-3 border-t border-stone-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Next 3 Months Forward Forecast (Real Linear Projection)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {forecast.next3MonthsForecast.map((proj) => (
              <div key={proj.month} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>{proj.month}</span>
                  <span className="text-[#1B4332]">₹{proj.recommendedPrice}/Qtl</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Projected Demand:</span>
                  <span className="font-semibold text-stone-800">{proj.projectedDemand.toLocaleString('en-IN')} Qtl</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
