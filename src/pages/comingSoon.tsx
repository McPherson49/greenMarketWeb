"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function getTimeLeft() {
  const TARGET = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function ComingSoon() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --green-deep:  #1a4731;
          --green-mid:   #39B54A;
          --green-light: #d1f0d8;
          --cream:       #f7f3ec;
          --soil:        #7a5c3a;
          --gold:        #c8a84b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cs-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--cream);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* ── Background organic shapes ── */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
        }
        .bg-blob-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #39B54A, #1a4731);
          top: -200px; left: -200px;
          animation: blobDrift 12s ease-in-out infinite alternate;
        }
        .bg-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #c8a84b, #f7f3ec);
          bottom: -100px; right: -100px;
          animation: blobDrift 16s ease-in-out infinite alternate-reverse;
        }
        .bg-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #d1f0d8, #39B54A44);
          top: 40%; left: 60%;
          animation: blobDrift 9s ease-in-out infinite alternate;
        }
        @keyframes blobDrift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }

        /* ── Grain texture overlay ── */
        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* ── Floating leaves ── */
        .leaf-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }
        .leaf {
          position: absolute;
          font-size: 1.4rem;
          opacity: 0;
          animation: leafFall linear infinite;
        }
        @keyframes leafFall {
          0%   { opacity: 0; transform: translateY(-40px) rotate(0deg); }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(110vh) rotate(360deg); }
        }

        /* ── Main card ── */
        .card {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 3rem 2rem 2.5rem;
          max-width: 680px;
          width: 100%;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Logo ── */
        .logo-wrap {
          margin-bottom: 2rem;
          animation: fadeUp 0.9s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── Tag line ── */
        .tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--green-mid);
          background: #39B54A1a;
          border: 1px solid #39B54A44;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          margin-bottom: 1.2rem;
          animation: fadeUp 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── Headline ── */
        .headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 8vw, 4.2rem);
          font-weight: 700;
          color: var(--green-deep);
          line-height: 1.1;
          margin-bottom: 1rem;
          animation: fadeUp 0.9s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        .headline em {
          font-style: italic;
          color: var(--green-mid);
        }

        /* ── Sub ── */
        .sub {
          font-size: 1rem;
          font-weight: 300;
          color: #4a5568;
          max-width: 420px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
          animation: fadeUp 0.9s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* ── Countdown ── */
        .countdown {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2.8rem;
          animation: fadeUp 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        .countdown-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 700;
          color: var(--green-deep);
          background: white;
          border: 1.5px solid var(--green-light);
          border-radius: 12px;
          width: clamp(64px, 16vw, 80px);
          height: clamp(64px, 16vw, 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px #39B54A18;
          transition: transform 0.2s;
        }
        .countdown-num:hover { transform: translateY(-3px); }
        .countdown-label {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #9aad9f;
          font-weight: 500;
        }
        .countdown-sep {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: var(--green-light);
          align-self: flex-start;
          margin-top: 0.6rem;
        }

        /* ── Email form ── */
        .notify-form {
          display: flex;
          gap: 0.6rem;
          max-width: 420px;
          margin: 0 auto 1.2rem;
          animation: fadeUp 0.9s 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .notify-input {
          flex: 1;
          padding: 0.75rem 1.1rem;
          border: 1.5px solid #d1e8d5;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          background: white;
          color: var(--green-deep);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .notify-input:focus {
          border-color: var(--green-mid);
          box-shadow: 0 0 0 3px #39B54A22;
        }
        .notify-btn {
          padding: 0.75rem 1.4rem;
          background: var(--green-mid);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .notify-btn:hover {
          background: var(--green-deep);
          transform: translateY(-1px);
        }
        .notify-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--green-mid);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.75rem;
          background: #39B54A0f;
          border: 1px solid #39B54A33;
          border-radius: 10px;
          max-width: 420px;
          margin: 0 auto 1.2rem;
          animation: fadeUp 0.4s ease both;
        }

        /* ── Back link ── */
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: #9aad9f;
          text-decoration: none;
          transition: color 0.2s;
          animation: fadeUp 0.9s 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .back-link:hover { color: var(--green-mid); }

        /* ── Divider sprout ── */
        .sprout-divider {
          margin: 2rem auto 0;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          max-width: 260px;
          animation: fadeUp 0.9s 0.75s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sprout-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #39B54A44, transparent);
        }
        .sprout-icon { font-size: 1.1rem; }

        @media (max-width: 480px) {
          .notify-form { flex-direction: column; }
          .countdown { gap: 0.5rem; }
          .countdown-sep { display: none; }
        }
      `}</style>

      <div className="cs-root">
        {/* Background blobs */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />

        {/* Grain */}
        <div className="grain" />

        {/* Floating leaves */}
        <div className="leaf-wrap">
          {[
            { left: "8%",  delay: "0s",   dur: "9s"  },
            { left: "18%", delay: "2.5s", dur: "12s" },
            { left: "33%", delay: "1s",   dur: "10s" },
            { left: "50%", delay: "4s",   dur: "8s"  },
            { left: "65%", delay: "0.5s", dur: "11s" },
            { left: "78%", delay: "3s",   dur: "13s" },
            { left: "90%", delay: "1.8s", dur: "9s"  },
          ].map((l, i) => (
            <span
              key={i}
              className="leaf"
              style={{
                left: l.left,
                animationDelay: l.delay,
                animationDuration: l.dur,
              }}
            >
              {["🌿", "🍃", "🌱"][i % 3]}
            </span>
          ))}
        </div>

        {/* Main card */}
        <div className="card">
          {/* Logo */}
          <div className="logo-wrap">
            <Image
              src="/assets/logo.svg"
              alt="GreenMarket"
              width={160}
              height={56}
              priority
            />
          </div>

          {/* Tag */}
          <div className="tag">🌱 Something fresh is growing</div>

          {/* Headline */}
          <h1 className="headline">
            We're almost <em>ready</em><br />to harvest
          </h1>

          {/* Sub */}
          <p className="sub">
            This feature is being carefully cultivated. We'll be launching soon — sign up to be the first to know when it's ready.
          </p>

          {/* Countdown */}
          <div className="countdown">
            {[
              { val: time?.days,    label: "Days"  },
              { val: time?.hours,   label: "Hours" },
              { val: time?.minutes, label: "Mins"  },
              { val: time?.seconds, label: "Secs"  },
            ].map((unit, i) => (
              <>
                {i > 0 && <div className="countdown-sep" key={`sep-${i}`}>:</div>}
                <div className="countdown-unit" key={unit.label}>
                  <div className="countdown-num">
                    {unit.val !== undefined ? pad(unit.val) : "--"}
                  </div>
                  <div className="countdown-label">{unit.label}</div>
                </div>
              </>
            ))}
          </div>

          {/* Email notify */}
          {submitted ? (
            <div className="notify-success">
              <span>✅</span>
              <span>You're on the list! We'll notify you at launch.</span>
            </div>
          ) : (
            <form className="notify-form" onSubmit={handleNotify}>
              <input
                type="email"
                className="notify-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="notify-btn">
                Notify Me
              </button>
            </form>
          )}

          {/* Back link */}
          <Link href="/" className="back-link">
            ← Back to GreenMarket
          </Link>

          {/* Sprout divider */}
          <div className="sprout-divider">
            <div className="sprout-line" />
            <span className="sprout-icon">🌾</span>
            <div className="sprout-line" />
          </div>
        </div>
      </div>
    </>
  );
}

(ComingSoon as any).noLayout = true;