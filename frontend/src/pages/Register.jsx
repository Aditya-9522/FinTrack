import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

/* ── STYLES ─────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rg-root {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    background: #0b0e14;
    overflow: hidden;
  }

  /* ── LEFT PANEL ── */
  .rg-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 70px;
    position: relative;
    background: #0b0e14;
    overflow: hidden;
  }

  .rg-left-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, rgba(22,163,74,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 80% 70%, rgba(16,185,129,0.07) 0%, transparent 60%);
    pointer-events: none;
  }

  .rg-grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .rg-brand {
    position: relative;
    z-index: 1;
    margin-bottom: 60px;
  }
  .rg-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }
  .rg-brand-name span { color: #16a34a; }

  .rg-hero { position: relative; z-index: 1; }

  .rg-eyebrow {
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
  .rg-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: #16a34a;
  }

  .rg-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 4vw, 52px);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin-bottom: 24px;
  }
  .rg-headline em { font-style: normal; color: #16a34a; }

  .rg-desc {
    font-size: 15px;
    color: #6b7280;
    line-height: 1.7;
    max-width: 380px;
    margin-bottom: 50px;
  }

  /* Feature list */
  .rg-features {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    z-index: 1;
  }
  .rg-feature {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .rg-feature-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: rgba(22,163,74,0.1);
    border: 1px solid rgba(22,163,74,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }
  .rg-feature-text {
    font-size: 13px;
    color: #6b7280;
  }
  .rg-feature-text strong { color: #d1d5db; font-weight: 600; }

  /* ── RIGHT PANEL ── */
  .rg-right {
    width: 480px;
    flex-shrink: 0;
    background: #111318;
    border-left: 1px solid #1f2937;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 50px;
    position: relative;
    animation: rgFadeIn 0.5s ease both;
  }

  @keyframes rgFadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rg-right-top-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #16a34a, #10b981, transparent);
  }

  .rg-step-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(22,163,74,0.08);
    border: 1px solid rgba(22,163,74,0.2);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 600;
    color: #16a34a;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .rg-step-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #16a34a;
    box-shadow: 0 0 6px rgba(22,163,74,0.8);
  }

  .rg-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.8px;
    margin-bottom: 8px;
  }
  .rg-form-sub {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 36px;
  }

  .rg-field { margin-bottom: 20px; }
  .rg-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .rg-input {
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
  .rg-input::placeholder { color: #374151; }
  .rg-input:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
  }

  .rg-btn {
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
  .rg-btn:hover { background: #15803d; transform: translateY(-1px); }
  .rg-btn:active { transform: translateY(0); }
  .rg-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .rg-footer-text {
    font-size: 13px;
    color: #4b5563;
    text-align: center;
    margin-top: 24px;
  }
  .rg-link {
    color: #16a34a;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.15s;
  }
  .rg-link:hover { color: #10b981; }

  .rg-terms {
    font-size: 11px;
    color: #374151;
    text-align: center;
    margin-top: 16px;
    line-height: 1.6;
  }

  @media (max-width: 860px) {
    .rg-left { display: none; }
    .rg-right { width: 100%; border-left: none; padding: 40px 28px; }
  }
`;

if (!document.getElementById("rg-styles")) {
  const el = document.createElement("style");
  el.id = "rg-styles";
  el.textContent = css;
  document.head.appendChild(el);
}

/* ── COMPONENT ──────────────────────────────────────────────── */
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /* ── ALL ORIGINAL LOGIC UNCHANGED ── */
  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields to secure your account");
      return;
    }

    try {
      await API.post("/auth/register", { name, email, password });
      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      alert("User already exists or registration failed");
    }
  };

  return (
    <div className="rg-root">

      {/* ── LEFT PANEL ── */}
      <div className="rg-left">
        <div className="rg-left-bg" />
        <div className="rg-grid-lines" />

        <div className="rg-brand">
          <div className="rg-brand-name">Fin<span>Track</span></div>
        </div>

        <div className="rg-hero">
          <div className="rg-eyebrow">Get Started</div>
          <h1 className="rg-headline">
            Your path to<br /><em>financial</em><br />freedom starts
          </h1>
          <p className="rg-desc">
            Join thousands who use FinTrack to take control — budget smarter, spend wiser, and grow faster with AI-driven insights.
          </p>
        </div>

        <div className="rg-features">
          <div className="rg-feature">
            <div className="rg-feature-icon">📊</div>
            <div className="rg-feature-text">
              <strong>Visual Budget Tracking</strong> — see exactly where your money goes
            </div>
          </div>
          <div className="rg-feature">
            <div className="rg-feature-icon">🤖</div>
            <div className="rg-feature-text">
              <strong>AI Financial Advisor</strong> — personalized advice every month
            </div>
          </div>
          <div className="rg-feature">
            <div className="rg-feature-icon">🔒</div>
            <div className="rg-feature-text">
              <strong>Encrypted & Private</strong> — your data never leaves your control
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="rg-right">
        <div className="rg-right-top-accent" />

        <div className="rg-step-badge">
          <span className="rg-step-dot" />
          Free Account
        </div>

        <div className="rg-form-title">Create account</div>
        <div className="rg-form-sub">Start tracking your finances in minutes</div>

        {/* Full Name */}
        <div className="rg-field">
          <label className="rg-label">Full Name</label>
          <input
            className="rg-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="rg-field">
          <label className="rg-label">Email Address</label>
          <input
            className="rg-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="rg-field">
          <label className="rg-label">Password</label>
          <input
            className="rg-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="rg-btn" onClick={handleRegister}>
          Create Free Account →
        </button>

        <p className="rg-terms">
          By registering you agree to our Terms of Service and Privacy Policy.
        </p>

        <p className="rg-footer-text">
          Already a member?{" "}
          <span className="rg-link" onClick={() => navigate("/")}>
            Login here
          </span>
        </p>
      </div>

    </div>
  );
}

export default Register;