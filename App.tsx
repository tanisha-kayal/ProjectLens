
import React, { useState, useCallback } from 'react';
import { analyzeProjectPlan } from './services/geminiService';
import { AuditReport, RiskLevel } from './types';
import { RiskBadge } from './components/RiskBadge';
import { SAMPLE_PLAN } from './components/SamplePlan';
import { AlertTriangle, CheckCircle, Info, Send, RefreshCcw, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeProjectPlan(input);
      setReport(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSample = () => {
    setInput(SAMPLE_PLAN);
  };

  const reset = () => {
    setReport(null);
    setInput('');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-indigo-400 w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">ProjectLens  <span className="text-slate-400 font-normal">Project Risk Assessment</span></h1>
          </div>
          <div className="flex gap-4">
            {!report && (
              <button 
                onClick={handleSample}
                className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Load Sample Plan
              </button>
            )}
            {report && (
              <button 
                onClick={reset}
                className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
              >
                <RefreshCcw size={14} /> New Audit
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!report ? (
          <section className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-800">
                <FileText size={20} className="text-indigo-600" />
                <h2 className="text-lg font-semibold">Enter Project Plan</h2>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Paste your project documentation, scope, or timeline below for a formal risk assessment.
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Project X aims to build a new CRM system in 3 months. Team: 2 developers. Tasks: Backend, Frontend, Launch..."
                className="w-full h-80 p-4 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-sans text-sm leading-relaxed"
              />
              <p className="mt-2 text-xs text-slate-500">
  Tip: Include goal, timeline, team size, and task breakdown for best results.
</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAudit}
                  disabled={isLoading || !input.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-lg font-semibold shadow-md flex items-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Analyzing Plan...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Analyze Project Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertTriangle size={20} className="mt-0.5" />
                <div>
                  <p className="font-bold">Audit Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Summary Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-slate-50 border-b border-slate-100">
                <div className="space-y-2">
  <h2 className="text-2xl font-bold text-slate-900">Risk Assessment Summary</h2>
  <p className="text-sm text-slate-500">
    Based on the provided project plan, ProjectLens identified the following risks and recommendations.
  </p>
  <p className="text-slate-600 max-w-2xl">{report.riskJustification}</p>
</div>
                <RiskBadge level={report.riskLevel as RiskLevel} />
              </div>

              {/* Risks Grid */}
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                    <AlertTriangle className="text-amber-500" size={24} />
                    <h3 className="text-xl font-bold text-slate-800">Key Risk Factors</h3>
                  </div>
                  <div className="grid gap-6">
                    {report.topRisks.map((risk, idx) => (
                      <div key={idx} className="group relative flex gap-6 p-5 rounded-lg border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600">
                          {idx + 1}
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-lg font-bold text-slate-800">{risk.name}</h4>
                          <p className="text-slate-600 leading-relaxed">{risk.why}</p>
                          <div className="bg-slate-50 p-3 rounded-md border-l-4 border-slate-300">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Project Evidence:</p>
                            <p className="text-sm italic text-slate-700">"{risk.reference}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                    <CheckCircle className="text-emerald-500" size={24} />
                    <h3 className="text-xl font-bold text-slate-800">Fix-Now Suggestions</h3>
                  </div>
                  <div className="grid gap-4">
                    {report.fixNowSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex gap-4 p-5 rounded-lg border border-emerald-100 bg-emerald-50/30">
                        <div className="flex-shrink-0 mt-1">
                          <Info className="text-emerald-600" size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-emerald-800 uppercase">Addressing: {suggestion.riskName}</p>
                          <p className="text-slate-800 font-medium leading-relaxed">{suggestion.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={reset}
                className="text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"
              >
                <RefreshCcw size={16} /> Run analysis for another project plan
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer Info */}
      <footer className="text-center text-slate-400 text-xs mt-10">
        <p>© {new Date().getFullYear()} ProjectLens. AI-powered project risk assessment.</p>
      </footer>
    </div>
  );
};

export default App;
