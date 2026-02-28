import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Legend
} from "recharts";

/* ---------------- STYLES ---------------- */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0b0e14; }

  .an-root {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #0b0e14;
    color: #f9fafb;
  }

  .an-bg {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 50% 40% at 10% 20%, rgba(22,163,74,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 90% 80%, rgba(16,185,129,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── TOPBAR ── */
  .an-topbar {
    background: #111318;
    border-bottom: 1px solid #1f2937;
    padding: 0 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .an-topbar-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #16a34a, #10b981, transparent);
    pointer-events: none;
  }
  .an-logo {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.4px;
    color: #fff;
  }
  .an-logo span { color: #16a34a; }

  .an-btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }
  .an-btn-back {
    background: rgba(22,163,74,0.08);
    color: #16a34a;
    border: 1px solid rgba(22,163,74,0.2);
  }
  .an-btn-back:hover { background: rgba(22,163,74,0.15); }

  .an-btn-sm {
    padding: 5px 12px;
    font-size: 12px;
    background: rgba(22,163,74,0.1);
    color: #16a34a;
    border: 1px solid rgba(22,163,74,0.2);
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 16px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .an-btn-sm:hover { background: rgba(22,163,74,0.2); }

  /* ── PAGE ── */
  .an-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 40px 60px;
    position: relative;
    z-index: 1;
  }

  /* ── PAGE HEADER ── */
  .an-page-header {
    margin-bottom: 32px;
  }
  .an-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #16a34a;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .an-eyebrow::before {
    content: '';
    display: block;
    width: 20px;
    height: 1px;
    background: #16a34a;
  }
  .an-page-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.8px;
  }

  /* ── SUMMARY STRIP ── */
  .an-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #1f2937;
    border: 1px solid #1f2937;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .an-stat {
    background: #111318;
    padding: 22px 28px;
    transition: background 0.2s;
  }
  .an-stat:hover { background: #13171e; }
  .an-stat-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #4b5563;
    margin-bottom: 6px;
  }
  .an-stat-value {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -1px;
    color: #f9fafb;
    font-family: 'DM Mono', monospace;
  }
  .an-stat-value.green { color: #16a34a; }
  .an-stat-value.muted { color: #9ca3af; }

  /* ── CHART GRID ── */
  .an-chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* ── CARD ── */
  .an-card {
    background: #111318;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 28px;
  }
  .an-card-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #4b5563;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #1f2937;
  }
  .an-card-subtitle {
    font-size: 13px;
    color: #6b7280;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    margin-left: 6px;
  }

  /* ── LEGEND ── */
  .an-legend {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .an-legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #9ca3af;
    padding: 6px 10px;
    border-radius: 7px;
    transition: background 0.15s;
  }
  .an-legend-item:hover { background: #1a1f2a; color: #d1d5db; }
  .an-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .an-legend-name { flex: 1; }
  .an-legend-value {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #6b7280;
  }

  /* ── EMPTY ── */
  .an-empty {
    text-align: center;
    padding: 60px 20px;
    color: #374151;
    font-size: 13px;
  }

  /* ── TOOLTIP OVERRIDE ── */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: #111318 !important;
    border: 1px solid #1f2937 !important;
    border-radius: 8px !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 13px !important;
    color: #d1d5db !important;
  }

  @media (max-width: 768px) {
    .an-page { padding: 24px 20px 40px; }
    .an-chart-grid { grid-template-columns: 1fr; }
    .an-summary { grid-template-columns: 1fr; }
    .an-topbar { padding: 0 20px; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .an-card { animation: fadeUp 0.4s ease both; }
  .an-card:nth-child(2) { animation-delay: 0.1s; }
`;

if (!document.getElementById("an-styles")) {
  const el = document.createElement("style");
  el.id = "an-styles";
  el.textContent = css;
  document.head.appendChild(el);
}

/* ---------------- UTIL ---------------- */

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 0,
  }).format(n);
}

const COLORS = ["#16a34a","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#06b6d4","#f97316"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#111318", border: "1px solid #1f2937",
        borderRadius: "8px", padding: "10px 14px",
        fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#d1d5db"
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{payload[0].name}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", color: "#16a34a" }}>
          {fmt(payload[0].value)}
        </div>
      </div>
    );
  }
  return null;
};

/* ---------------- COMPONENT ---------------- */

function Analytics() {
  const navigate = useNavigate();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const [budgets, setBudgets] = useState([]);
  const [income, setIncome] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const budgetRes = await API.get(
        `/budgets/all?year=${year}&month=${month}`,
        { headers: { Authorization: token } }
      );
      const incomeRes = await API.get(
        `/income/get?year=${year}&month=${month}`,
        { headers: { Authorization: token } }
      );

      const fetchedBudgets = budgetRes.data;
      setBudgets(fetchedBudgets);
      setIncome(incomeRes.data.amount || 0);
      generateParentPie(fetchedBudgets);
    } catch (err) {
      console.log(err);
    }
  };

  /* -------- Generate Parent Category Pie -------- */
  const generateParentPie = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.parentCategory]) acc[item.parentCategory] = 0;
      acc[item.parentCategory] += item.allocatedAmount;
      return acc;
    }, {});

    const formatted = Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    }));

    setPieData(formatted);
    setSelectedParent(null);
  };

  /* -------- Generate Subcategory Pie -------- */
  const generateSubPie = (parent) => {
    const filtered = budgets.filter(item => item.parentCategory === parent);
    const formatted = filtered.map(item => ({
      name: item.subCategory,
      value: item.allocatedAmount
    }));
    setPieData(formatted);
    setSelectedParent(parent);
  };

  /* -------- Summary Data -------- */
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const remaining = income - totalAllocated;

  const summaryData = [
    { name: "Income", value: income },
    { name: "Allocated", value: totalAllocated },
    { name: "Remaining", value: remaining }
  ];

  /* ---------------- UI ---------------- */
  return (
    <div className="an-root">
      <div className="an-bg" />

      {/* TOPBAR */}
      <header className="an-topbar" style={{ position: "relative" }}>
        <div className="an-topbar-accent" />
        <div className="an-logo">Fin<span>Track</span></div>
        <button className="an-btn an-btn-back" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
      </header>

      <main className="an-page">

        {/* PAGE HEADER */}
        <div className="an-page-header">
          <div className="an-eyebrow">Insights</div>
          <div className="an-page-title">Analytics Overview</div>
        </div>

        {/* SUMMARY */}
        <div className="an-summary">
          <div className="an-stat">
            <div className="an-stat-label">Monthly Income</div>
            <div className="an-stat-value">{fmt(income)}</div>
          </div>
          <div className="an-stat">
            <div className="an-stat-label">Allocated</div>
            <div className="an-stat-value muted">{fmt(totalAllocated)}</div>
          </div>
          <div className="an-stat">
            <div className="an-stat-label">Balance</div>
            <div className="an-stat-value green">{fmt(remaining)}</div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="an-chart-grid">

          {/* PIE CARD */}
          <div className="an-card">
            <div className="an-card-title">
              {selectedParent
                ? <>Subcategories <span className="an-card-subtitle">of {selectedParent}</span></>
                : "Allocation by Category"
              }
            </div>

            {selectedParent && (
              <button className="an-btn-sm" onClick={() => generateParentPie(budgets)}>
                ← Back
              </button>
            )}

            {pieData.length === 0 ? (
              <div className="an-empty">No allocation data yet.</div>
            ) : (
              <>
                <PieChart width={320} height={260}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={3}
                    onClick={(data) => {
                      if (!selectedParent) generateSubPie(data.name);
                    }}
                    style={{ cursor: selectedParent ? "default" : "pointer" }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>

                <div className="an-legend">
                  {pieData.map((entry, index) => (
                    <div
                      key={index}
                      className="an-legend-item"
                      onClick={() => { if (!selectedParent) generateSubPie(entry.name); }}
                      style={{ cursor: selectedParent ? "default" : "pointer" }}
                    >
                      <div className="an-legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
                      <span className="an-legend-name">{entry.name}</span>
                      <span className="an-legend-value">{fmt(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* BAR CARD */}
          <div className="an-card">
            <div className="an-card-title">Income vs Allocation</div>

            <BarChart
              width={400}
              height={260}
              data={summaryData}
              margin={{ top: 4, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#374151"
                tick={{ fill: "#6b7280", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                axisLine={{ stroke: "#1f2937" }}
                tickLine={false}
              />
              <YAxis
                stroke="#374151"
                tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {summaryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>

            {/* Bar legend */}
            <div className="an-legend" style={{ marginTop: "16px" }}>
              {summaryData.map((entry, index) => (
                <div key={index} className="an-legend-item">
                  <div className="an-legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
                  <span className="an-legend-name">{entry.name}</span>
                  <span className="an-legend-value">{fmt(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Analytics;