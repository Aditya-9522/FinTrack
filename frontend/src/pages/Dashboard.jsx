import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

/* ---------------- STYLES ---------------- */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0b0e14; }

  .ft-root {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #0b0e14;
    color: #f9fafb;
  }

  /* ── TOPBAR ── */
  .ft-topbar {
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
  .ft-topbar-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #16a34a, #10b981, transparent);
    pointer-events: none;
  }
  .ft-logo {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.4px;
    color: #fff;
  }
  .ft-logo span { color: #16a34a; }

  .ft-topbar select {
    appearance: none;
    border: 1px solid #1f2937;
    background: #0b0e14;
    border-radius: 7px;
    padding: 6px 12px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #d1d5db;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
  }
  .ft-topbar select:focus { border-color: #16a34a; }

  .ft-badge {
    font-size: 11px;
    background: rgba(22,163,74,0.08);
    color: #16a34a;
    border: 1px solid rgba(22,163,74,0.2);
    border-radius: 20px;
    padding: 4px 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  /* ── PAGE ── */
  .ft-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 40px 60px;
    position: relative;
  }

  .ft-page-bg {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 50% 40% at 10% 20%, rgba(22,163,74,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 90% 80%, rgba(16,185,129,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── SUMMARY STRIP ── */
  .ft-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #1f2937;
    border: 1px solid #1f2937;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }
  .ft-stat {
    background: #111318;
    padding: 24px 28px;
    transition: background 0.2s;
  }
  .ft-stat:hover { background: #13171e; }
  .ft-stat-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #4b5563;
    margin-bottom: 8px;
  }
  .ft-stat-value {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -1px;
    color: #f9fafb;
    font-family: 'DM Mono', monospace;
  }
  .ft-stat-value.green { color: #16a34a; }
  .ft-stat-value.muted { color: #9ca3af; }

  /* ── GRID ── */
  .ft-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 20px;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  /* ── CARD ── */
  .ft-card {
    background: #111318;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 28px;
    position: relative;
    z-index: 1;
  }
  .ft-card-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #4b5563;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #1f2937;
  }

  /* ── INPUTS ── */
  .ft-input {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid #1f2937;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #f9fafb;
    background: #0b0e14;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    margin-bottom: 12px;
    display: block;
  }
  .ft-input:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  }
  .ft-input::placeholder { color: #374151; }

  /* ── BUTTONS ── */
  .ft-btn {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.1px;
  }
  .ft-btn-primary {
    width: 100%;
    background: #16a34a;
    color: #fff;
    margin-top: 4px;
    position: relative;
    overflow: hidden;
  }
  .ft-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
  .ft-btn-primary:hover { background: #15803d; transform: translateY(-1px); }

  .ft-btn-analytics {
    background: rgba(22,163,74,0.08);
    color: #16a34a;
    border: 1px solid rgba(22,163,74,0.2);
  }
  .ft-btn-analytics:hover { background: rgba(22,163,74,0.15); }

  .ft-btn-logout {
    background: rgba(239,68,68,0.08);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  .ft-btn-logout:hover { background: rgba(239,68,68,0.15); }

  .ft-btn-ai {
    background: #16a34a;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
  }
  .ft-btn-ai::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
  .ft-btn-ai:hover { background: #15803d; transform: translateY(-1px); }
  .ft-btn-ai:disabled { background: rgba(22,163,74,0.3); cursor: not-allowed; transform: none; }

  /* ── BUDGET LIST ── */
  .ft-budget-item {
    padding: 16px 0;
    border-bottom: 1px solid #1a1f2a;
  }
  .ft-budget-item:last-child { border-bottom: none; padding-bottom: 0; }
  .ft-budget-item:first-child { padding-top: 0; }

  .ft-budget-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .ft-budget-name {
    font-size: 14px;
    font-weight: 600;
    color: #f9fafb;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ft-budget-name::before {
    content: '';
    display: block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #16a34a;
    box-shadow: 0 0 6px rgba(22,163,74,0.5);
    flex-shrink: 0;
  }
  .ft-budget-pct {
    font-size: 12px;
    color: #4b5563;
    font-family: 'DM Mono', monospace;
  }

  .ft-bar-bg {
    height: 3px;
    background: #1f2937;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .ft-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #16a34a, #10b981);
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  /* ── EMPTY ── */
  .ft-empty {
    text-align: center;
    padding: 48px 20px;
    color: #374151;
    font-size: 13px;
  }
  .ft-empty-icon {
    font-size: 28px;
    margin-bottom: 10px;
    opacity: 0.4;
  }

  /* ── AI SECTION ── */
  .ft-ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #1f2937;
  }
  .ft-ai-header-left h3 {
    font-size: 14px;
    font-weight: 600;
    color: #f9fafb;
    margin-bottom: 2px;
  }
  .ft-ai-header-left p {
    font-size: 12px;
    color: #4b5563;
  }

  .ft-advice-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
  }
  .ft-advice-item {
    background: #0b0e14;
    border: 1px solid #1f2937;
    border-radius: 10px;
    padding: 16px;
    font-size: 13px;
    line-height: 1.65;
    color: #9ca3af;
    animation: fadeUp 0.35s ease both;
  }
  .ft-advice-item:hover { border-color: rgba(22,163,74,0.25); color: #d1d5db; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FOOTER ── */
  .ft-footer {
    text-align: center;
    font-size: 12px;
    color: #1f2937;
    padding-top: 32px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    .ft-page { padding: 24px 20px 40px; }
    .ft-summary { grid-template-columns: 1fr; }
    .ft-grid { grid-template-columns: 1fr; }
    .ft-topbar { padding: 0 20px; }
  }
`;

if (!document.getElementById("ft-styles")) {
  const el = document.createElement("style");
  el.id = "ft-styles";
  el.textContent = css;
  document.head.appendChild(el);
}

/* ---------------- UTIL ---------------- */

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(n);
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [income, setIncome] = useState(0);
  const [incomeInput, setIncomeInput] = useState("");

  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");

  const [budgets, setBudgets] = useState([]);
  const [aiAdvice, setAiAdvice] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchIncome();
    fetchBudgets();
  }, [year, month]);

  /* ---------------- FETCH ---------------- */

  const fetchIncome = async () => {
    const res = await API.get(`/income/get?year=${year}&month=${month}`);
    setIncome(res.data.amount || 0);
  };

  const fetchBudgets = async () => {
    const res = await API.get(`/budgets/all?year=${year}&month=${month}`);
    setBudgets(res.data);
  };

  /* ---------------- INCOME ---------------- */

  const handleSetIncome = async () => {
    if (!incomeInput) return alert("Enter income amount");

    await API.post("/income/set", {
      year,
      month,
      amount: Number(incomeInput),
    });

    setIncomeInput("");
    fetchIncome();
  };

  /* ---------------- CALCULATIONS ---------------- */

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const remaining = income - totalAllocated;

  /* ---------------- SET BUDGET ---------------- */

  const handleSetBudget = async () => {
    if (!parentCategory || !subCategory || !allocatedAmount)
      return alert("Fill all fields");

    if (Number(allocatedAmount) > remaining)
      return alert("Exceeds available balance");

    await API.post("/budgets/set", {
      parentCategory,
      subCategory,
      allocatedAmount: Number(allocatedAmount),
      year,
      month,
    });

    setParentCategory("");
    setSubCategory("");
    setAllocatedAmount("");

    fetchBudgets();
  };

  /* ---------------- GROUP ---------------- */

  const groupedBudgets = budgets.reduce((acc, item) => {
    if (!acc[item.parentCategory]) {
      acc[item.parentCategory] = [];
    }
    acc[item.parentCategory].push(item);
    return acc;
  }, {});

  /* ---------------- AI ---------------- */

  const getAIAdvice = async () => {
    try {
      setLoadingAI(true);
      const res = await API.get(`/ai/advice?year=${year}&month=${month}`);
      setAiAdvice(res.data.advice.split("\n").filter((l) => l.trim()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="ft-root">
      <div className="ft-page-bg" />

      {/* TOPBAR */}
      <header className="ft-topbar" style={{ position: "relative" }}>
        <div className="ft-topbar-accent" />
        <div className="ft-logo">Fin<span>Track</span></div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2023, 2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          <button
            className="ft-btn ft-btn-analytics"
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </button>

          <button
            className="ft-btn ft-btn-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="ft-page">

        {/* SUMMARY */}
        <div className="ft-summary">
          <div className="ft-stat">
            <div className="ft-stat-label">Monthly Income</div>
            <div className="ft-stat-value">{fmt(income)}</div>
          </div>
          <div className="ft-stat">
            <div className="ft-stat-label">Allocated</div>
            <div className="ft-stat-value muted">{fmt(totalAllocated)}</div>
          </div>
          <div className="ft-stat">
            <div className="ft-stat-label">Balance</div>
            <div className="ft-stat-value green">{fmt(remaining)}</div>
          </div>
        </div>

        {/* GRID */}
        <div className="ft-grid">

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="ft-card">
              <div className="ft-card-title">Add Income</div>
              <input
                className="ft-input"
                type="number"
                placeholder="Enter income"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
              />
              <button className="ft-btn ft-btn-primary" onClick={handleSetIncome}>
                Add Income →
              </button>
            </div>

            <div className="ft-card">
              <div className="ft-card-title">Allocate Budget</div>

              <input
                className="ft-input"
                placeholder="Parent Category (Kid-1, Wife)"
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
              />

              <input
                className="ft-input"
                placeholder="Sub Category (Fees, Rent)"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              />

              <input
                className="ft-input"
                type="number"
                placeholder="Amount"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
              />

              <button className="ft-btn ft-btn-primary" onClick={handleSetBudget}>
                Add Allocation →
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="ft-card">
            <div className="ft-card-title">Budget Overview</div>

            {Object.keys(groupedBudgets).length === 0 ? (
              <div className="ft-empty">
                <div className="ft-empty-icon">📋</div>
                No budget categories yet.
              </div>
            ) : (
              Object.keys(groupedBudgets).map((parent, i) => {
                const parentItems = groupedBudgets[parent];
                const parentTotal = parentItems.reduce(
                  (sum, item) => sum + item.allocatedAmount, 0
                );
                const parentPercent =
                  income > 0 ? Math.min((parentTotal / income) * 100, 100) : 0;

                return (
                  <div key={i} className="ft-budget-item">
                    <div className="ft-budget-row">
                      <div className="ft-budget-name">{parent}</div>
                      <span className="ft-budget-pct">{Math.round(parentPercent)}%</span>
                    </div>

                    <div className="ft-bar-bg">
                      <div className="ft-bar-fill" style={{ width: `${parentPercent}%` }} />
                    </div>

                    {parentItems.map((sub, j) => (
                      <div
                        key={j}
                        style={{
                          paddingLeft: "16px",
                          marginTop: "6px",
                          fontSize: "12px",
                          color: "#4b5563",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span style={{ color: "#16a34a", fontSize: "10px" }}>▸</span>
                        {sub.subCategory}
                        <span style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", color: "#6b7280" }}>
                          {fmt(sub.allocatedAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* AI SECTION */}
        <div className="ft-card" style={{ marginTop: "0" }}>
          <div className="ft-ai-header">
            <div className="ft-ai-header-left">
              <h3>AI Financial Advisor</h3>
              <p>Personalized insights for {MONTHS[month]} {year}</p>
            </div>
            <button
              className="ft-btn ft-btn-ai"
              onClick={getAIAdvice}
              disabled={loadingAI}
            >
              {loadingAI ? "Analyzing..." : "✦ Get Advice"}
            </button>
          </div>

          {aiAdvice.length > 0 && (
            <div className="ft-advice-grid">
              {aiAdvice.map((point, i) => (
                <div
                  key={i}
                  className="ft-advice-item"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {point}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ft-footer">© {new Date().getFullYear()} FinTrack</div>

      </main>
    </div>
  );
}