

# 🛡️ ShieldX

**Next-Generation Parametric Income Insurance for India's 12M+ Gig Workers**

Guidewire DEVTrails 2026 · Phase 3 

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-FF6900?style=for-the-badge&logo=vercel&logoColor=white)](https://shieldx.vercel.app)
[![API Docs](https://img.shields.io/badge/API_Docs-Active-430098?style=for-the-badge&logo=render&logoColor=white)](https://shieldx-api.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/justvrushank/ShieldX)

---

**`Real-Time Event Triggered → Worker Activity Verified → Fraud ML Scored → UPI Payout Disbursed`**

**`0 sec · 30 sec · 60 sec · < 2 hours`**

No claims to file. No red tape. No waiting. Absolute financial resilience for those who need it most. 

</div>

---

## 🎬 Pitch Deck & Demo

<div align="center">
  <a href="https://drive.google.com/file/d/1qTPfL6nEnW_R5tEsK4xyANe6yNZC7UHY/view?usp=sharing">
    <img src="https://img.shields.io/badge/Pitch_Deck-View_PDF-FF6900?style=for-the-badge&logo=googledrive&logoColor=white" alt="Pitch Deck"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://youtu.be/E13CQEx5pBI?si=zWGzfyyBFphmIa22">
    <img src="https://img.shields.io/badge/Demo_Video-Watch_on_YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Demo Video"/>
  </a>
</div>

> **5-Minute End-to-End Simulation:** Watch the entire pipeline from *Worker Registration* to *Event Disruption* and an *Automated UPI Payout* directly into the worker's bank account.

---

## 📖 The Story

Ravi Kumar. 28. Food delivery partner. Hyderabad. Earning ₹18,000/month.

**Tuesday, 2:15 PM.** IMD declares a Red Alert. Hyderabad faces 71mm of rainfall in just 6 hours. Ravi’s bike is grounded. For 3 days, he cannot deliver. A gig worker doesn’t get paid leave. ₹2,400 of his crucial weekly income, gone. Rent is due on Friday. And no insurance product in the market covers his lost shifts.

**Enter ShieldX.** 
While Ravi is at home, worried about his rent, ShieldX detects the extreme weather anomaly. In the background, our ML engine analyzes 9 fraud-prevention signals, verifies his recent delivery activity, and calculates a risk score of 0.18. 

The claim is **auto-approved**. ₹600 lands directly in his UPI wallet. 
He didn't make a phone call. He didn't fill out a slow web form. He didn't even know he was covered for this exact moment.

Ravi gets a text confirmation. He breathes a sigh of relief. His rent is covered.

**This is what insurance should feel like—an invisible safety net.**

---

## 🚀 What Is ShieldX?

ShieldX is a paradigm-shifting **parametric income protection ecosystem**. Unlike traditional indemnity insurance that relies on loss assessors and highly subjective claims, ShieldX executes objectively. When external, empirical data—like weather APIs or platform outages—confirms a gig worker cannot earn, payouts are aggressively automated into their accounts.

```
⚡ TRIGGER CONFIRMED     0 sec    External API confirms a city-wide disruption
✅ ACTIVITY VERIFIED    30 sec    System checks worker's latest delivery pings
🧠 FRAUD SCORED         60 sec    9-Signal ML Engine analyzes claim validity
📊 TIER CALCULATED      90 sec    Determines Silver/Gold payout levels
💸 UPI PAYOUT          <2 hours   Funds deposited instantly to registered UPI
🔗 AUDIT TRAIL         instant    Immutable hash-chain logged for IRDAI compliance
```

---

## ⚙️ The Zero-Human Claim Pipeline

Once a disruptive event is detected, **the entire lifecycle resolves automatically.** We've eradicated the waiting period.

### Step 1: Immutable Trigger Confirmation
A massive disruption is verified via certified external sources:
- **IMD SACHET RSS** — Official flood/weather alerts.
- **CPCB AQI API** — Hazardous air quality readings.
- **OpenWeatherMap** — Live rainfall and storm tracking.
- **Downdetector** — Platform server outages.

*(A robust APScheduler background worker polls these feeds every 15 minutes in production.)*

### Step 2: Cohort Eligibility & Mapping
ShieldX parallel-processes all workers intimately tied to the affected operational zone:
- Confirms active subscription and policy status.
- Verifies a delivery within the last 6 hours to prevent "phantom worker" claims.

### Step 3: Millisecond Fraud Detection (<50ms)
Every automated claim passes through our **GradientBoosting ML Engine** assessing 9 vital signals:
- GPS zone-to-home verification.
- Activity recency & historical claim velocity.
- Micro-geographic correlation (real events trigger mass-localized claims, lowering fraud probability).
- Advanced GPS Spoofing Detection: Impossible travel speeds, static overlapping coordinates, boundary abuse.
- New-account gatekeeping.

*Claims scoring **> 91% genuine (< 0.70 Fraud Score)** breeze past human review and lock in for payment.*

### Step 4: Actuarial Payout via Razorpay
Payouts are securely routed through Razorpay X APIs based on the worker's active coverage bracket (Bronze/Silver/Gold) and multiplied by the disruption's severity weight.

### Step 5: Cryptographic Audit Trail
Each event generates an unhackable **SHA-256 Hash Chain**—linking the trigger, verification, ML decision, and financial payout. This ensures absolute transparency and out-of-the-box compliance for IRDAI regulators.

---

## 🌪️ 5 Covered Disruptions

| Trigger Condition | Verified By | Threshold for Payout | Payout Weight |
|:---|:---|:---|:---|
| **🌊 Severe Flooding** | IMD + OpenWeather | ≥ 64.4mm/24h or Official Red Alert | 100% |
| **📉 Platform Outage** | Downdetector + Activity | API downtime > 30 mins | 75% |
| **🚨 Civil Curfew** | Govt RSS Feeds | Active Section 144 / Curfew in Zone | 100% |
| **🏭 Hazardous Air (AQI)** | CPCB Official API | AQI ≥ 301 (WHO Hazardous limits) | 50% |
| **📉 Unforeseen Drops** | Order Heatmaps | Zone demand drops ≥ 70% | 40% |

---

## 🏆 Income-Driven Payout Tiers

Payouts are dynamically scaled based on the worker's true effort, eliminating flat-rate inefficiency.

| Coverage Tier | Worker Profile | Daily Average | Disruption Payout |
|:---:|:---|:---:|:---:|
| **🥉 Bronze** | Part-time / Students | < 8 Orders/day | **₹400** |
| **🥈 Silver** | Standard Full-Time | 8–14 Orders/day | **₹600** |
| **🥇 Gold** | High-Volume Veterans | 15+ Orders/day | **₹900** |

---

## 🧠 ML-Driven Actuarial Pricing

Rather than a static premium, ShieldX uses a **RandomForestRegressor (R² ≈ 0.89)** to balance machine learning risk predictions with classic actuarial tables.

$$P_{final} = 0.60 \cdot P_{ML} + 0.40 \cdot P_{actuarial}$$

$$P_{actuarial} = \left(\lambda S + 0.25\sqrt{\lambda} \cdot S\right) \times 1.30 \times M_{seasonal}$$

*(S = Worker payout tier; evaluated in <50ms utilizing 10,000+ statistically rigorous training records)*

---

## 🏛️ IRDAI Compliance: By Design

To deploy legitimate financial tech in India, compliance isn't an afterthought. **ShieldX hits 10/10 metrics for IRDAI parametric sandboxes.**

- ✅ **Subjectivity Eliminated:** All triggers are publicly verifiable via Governmental APIs.
- ✅ **Adverse Selection Killed:** Purchases strictly locked out 48 hours prior to forecasted events.
- ✅ **Data Privacy:** Full DPDP Act 2023 compliance. Data locked to AWS/Render `ap-south-1` instances (Mumbai).
- ✅ **Scale Operations:** At an infrastructure cost of just $124/mo, our operating margins easily sustain the payout pool.

---

## 💻 Elite Tech Stack

Built on a flawless, asynchronous architecture ensuring zero bottleneck during high-load mass claim events.

| Domain | Underlying Technology |
|---|---|
| **Frontend UI** | **React 18, Vite, Framer Motion, Zustand, TailwindCSS** — Mobile-First Responsiveness |
| **Backend Core** | **FastAPI (Python 3.11+), Pydantic, Uvicorn, APScheduler** |
| **Machine Learning**| **`scikit-learn`** (Gradient Boosting, Random Forest, Isolation Forests), **Pandas** |
| **Database** | **Motor** (Async Python Driver), MongoDB Atlas Cluster |
| **Auth & Identity** | **Firebase Auth** (Phone/OTP + Google OAuth), Stateless JWT |
| **Financial Pipes** | **Razorpay API** (UPI Automated Collections & Disbursements) |
| **Geospatial Processing** | **Uber H3** Hexagonal Grids (Resolution 7) for surgical precision mapping |

---

## 🛠️ Quick Start & Local Execution

Feel the power of the platform natively. Here is how you can deploy the entire ecosystem in under 5 minutes.

### 1. Launch the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Hydrate the pipeline with your credentials
cp .env.example .env

# Verify environment variables
python check_env.py

# Engage the server
uvicorn app.main:app --reload --port 8000
```
> Explore the auto-generated API schema at `http://localhost:8000/docs`

### 2. Launch the Frontend
```bash
cd frontend
npm install

# Map VITE_API_URL to your local backend
cp .env.example .env

# Start the Vite hyper-fast dev server
npm run dev
```
> Explore the UI at `http://localhost:5173`

---

## 🌟 The Visionaries

| Contributor | Focus Area |
|---|---|
| **Vrushank** *(Lead)* | System Architecture, Backend APIs, ML & Fraud Engine, Deployment |
| **Project Contributors** | Frontend Experience, Geospatial Integration, Regulatory Research |

<div align="center">

*Designed for the 12 million unseen heroes delivering our meals, groceries, and packages everyday.*

**ShieldX is ready for production.**

</div>
