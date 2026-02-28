import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

/* ── STYLES ─────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #0b0e14;
    overflow: hidden;
  }

  /* ── LEFT PANEL ── */
  .lg-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 70px;
    position: relative;
    background: #0b0e14;
    overflow: hidden;
  }

  .lg-left-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, rgba(22,163,74,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 80% 70%, rgba(16,185,129,0.07) 0%, transparent 60%);
    pointer-events: none;
  }

  .lg-grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .lg-brand {
    position: relative;
    z-index: 1;
    margin-bottom: 60px;
  }
  .lg-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }
  .lg-brand-name span { color: #16a34a; }

  .lg-hero {
    position: relative;
    z-index: 1;
  }
  .lg-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #16a34a;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lg-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: #16a34a;
  }
  .lg-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 4vw, 52px);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin-bottom: 24px;
  }
  .lg-headline em {
    font-style: normal;
    color: #16a34a;
  }
  .lg-desc {
    font-size: 15px;
    color: #6b7280;
    line-height: 1.7;
    max-width: 380px;
    margin-bottom: 50px;
  }

  /* Stats row */
  .lg-stats {
    display: flex;
    gap: 40px;
    position: relative;
    z-index: 1;
  }
  .lg-stat-item {}
  .lg-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -1px;
  }
  .lg-stat-label {
    font-size: 12px;
    color: #4b5563;
    margin-top: 2px;
  }

  .lg-stat-divider {
    width: 1px;
    background: #1f2937;
    align-self: stretch;
  }

  /* ── RIGHT PANEL ── */
  .lg-right {
    width: 480px;
    flex-shrink: 0;
    background: #111318;
    border-left: 1px solid #1f2937;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 50px;
    position: relative;
  }

  .lg-right-top-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #16a34a, #10b981, transparent);
  }

  .lg-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.8px;
    margin-bottom: 8px;
  }
  .lg-form-sub {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 40px;
  }

  .lg-field {
    margin-bottom: 22px;
  }
  .lg-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .lg-input-wrap {
    position: relative;
  }
  .lg-input {
    width: 100%;
    padding: 14px 16px;
    background: #0b0e14;
    border: 1px solid #1f2937;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lg-input::placeholder { color: #374151; }
  .lg-input:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
  }

  .lg-btn {
    width: 100%;
    padding: 15px;
    background: #16a34a;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    transition: background 0.2s, transform 0.15s;
    letter-spacing: 0.2px;
  }
  .lg-btn:hover { background: #15803d; transform: translateY(-1px); }
  .lg-btn:active { transform: translateY(0); }
  .lg-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .lg-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 28px 0;
    color: #1f2937;
    font-size: 12px;
  }
  .lg-divider::before,
  .lg-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1f2937;
  }

  .lg-footer-text {
    font-size: 13px;
    color: #4b5563;
    text-align: center;
    margin-top: 24px;
  }
  .lg-link {
    color: #16a34a;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.15s;
  }
  .lg-link:hover { color: #10b981; }

  .lg-secure-note {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 28px;
    padding: 12px 16px;
    background: rgba(22,163,74,0.06);
    border: 1px solid rgba(22,163,74,0.15);
    border-radius: 8px;
    font-size: 12px;
    color: #4b5563;
  }
  .lg-secure-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #16a34a;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(22,163,74,0.6);
  }

  @media (max-width: 860px) {
    .lg-left { display: none; }
    .lg-right { width: 100%; border-left: none; padding: 40px 28px; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lg-right { animation: fadeIn 0.5s ease both; }
`;

if (!document.getElementById("lg-styles")) {
  const el = document.createElement("style");
  el.id = "lg-styles";
  el.textContent = css;
  document.head.appendChild(el);
}

/* ── COMPONENT ──────────────────────────────────────────────── */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="lg-root">

      {/* ── LEFT PANEL ── */}
      <div className="lg-left">
        <div className="lg-left-bg" />
        <div className="lg-grid-lines" />

        <div className="lg-brand">
          <div className="lg-brand-name">Fin<span>Track</span></div>
        </div>

        <div className="lg-hero">
          <div className="lg-eyebrow">Smart Finance</div>
          <h1 className="lg-headline">
            Take control of<br />your <em>financial</em><br />future
          </h1>
          <p className="lg-desc">
            Track income, allocate budgets, and get AI-powered insights — all in one clean dashboard built for clarity.
          </p>
        </div>

        <div className="lg-stats">
          <div className="lg-stat-item">
            <div className="lg-stat-num">₹0→∞</div>
            <div className="lg-stat-label">Unlimited tracking</div>
          </div>
          <div className="lg-stat-divider" />
          <div className="lg-stat-item">
            <div className="lg-stat-num">AI</div>
            <div className="lg-stat-label">Powered insights</div>
          </div>
          <div className="lg-stat-divider" />
          <div className="lg-stat-item">
            <div className="lg-stat-num">100%</div>
            <div className="lg-stat-label">Private & secure</div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lg-right">
        <div className="lg-right-top-accent" />

        <div className="lg-form-title">Welcome back</div>
        <div className="lg-form-sub">Sign in to your FinTrack account</div>

        {/* Email */}
        <div className="lg-field">
          <label className="lg-label">Email Address</label>
          <div className="lg-input-wrap">
            <input
              className="lg-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="lg-field">
          <label className="lg-label">Password</label>
          <div className="lg-input-wrap">
            <input
              className="lg-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="lg-btn" onClick={handleLogin}>
          Sign In →
        </button>

        <div className="lg-secure-note">
          <span className="lg-secure-dot" />
          Your data is encrypted and never shared with third parties.
        </div>

        <p className="lg-footer-text">
          New to FinTrack?{" "}
          <span className="lg-link" onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>
      </div>

    </div>
  );
}

export default Login;