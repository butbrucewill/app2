# One Stock Academy — PRD

## Original problem statement
Build a 2-page website for One Stock Academy, a trading education company (online + offline classes).
- Page 1: Home/landing — hero, Why OSA, courses overview, mentors, FAQ, final CTA, risk disclosure footer.
- Page 2: Buy Course — course selection → checkout (hosted by Apex IT Solutions LMS; external redirect, link pending from user).
- Final pricing: Online ₹49,990 · Offline ₹1,99,990 (one-time, incl. GST).
- Design: dark brand-blue theme (from official logo), Syne/Manrope typography, plain dark background (3D/video/chart backgrounds removed per user), candlestick custom cursor, 3D tilt mentor cards, Lenis smooth scroll.
- Compliance: no profit guarantees; risk disclosure required.

## User personas
- Beginner who wants to learn trading from scratch, wary of tip-selling scams.
- Early-stage trader who wants structure + mentorship.

## Architecture
- React (CRA/craco) frontend on :3000, FastAPI backend on :8001 (/api prefix).
- Database: dual-mode via /app/backend/database.py — MySQL (aiomysql pool, auto-creates tables
  enrollments/leads/chat_messages) when MYSQL_HOST/MYSQL_USER/MYSQL_DATABASE are set in backend/.env,
  otherwise MongoDB (motor, MONGO_URL/DB_NAME). Chosen per user (Hostinger shared hosting ships MySQL).
- Key endpoints: POST /api/chat (rule-based chatbot), POST /api/leads (handoff lead form),
  POST /api/orders + POST /api/payments/verify + GET /api/orders/{ref} (enrollment, DEMO payment mode),
  POST /api/admin/login (JWT, 12h), GET /api/admin/enrollments, GET /api/admin/leads.
- DB collections: `enrollments` {order_ref, course_id, course_name, amount_inr, status, name, email, phone, created_at, paid_at},
  `leads` {lead_id, name, email, whatsapp, city, interest, status, created_at}, `chat_sessions` (transcripts).

## Implemented
- (2026-08-21) MySQL support: backend now runs on MySQL when MYSQL_* env vars are filled (tables auto-created on first use), MongoDB otherwise. Both paths verified: full flow (order → demo pay → paid → admin tables; lead → admin; chat transcripts) + 30/30 pytest regression against each backend.
- (2026-08-21) Rule-based chatbot: CHAT_FAQ fixed answers (fees, Buniyaad phases, mentors, formats, tips, guarantee, enroll, beginner, batch, refund, contact, greeting). Out-of-syllabus → fallback + "Talk to the team" handoff button → lead form saved to DB, visible in /admin. Word-boundary regex matching with plural tolerance (fixed 'hi'-in-'delhi' substring bug). Chat rate limit 10 msg/min keyed on X-Forwarded-For; admin login throttled to 5 attempts/10 min per IP.
- (2026-08-21) Removed unused 3D libs (three, @react-three/fiber, @react-three/drei) and 8 dead components (CandlestickChart, HeroScene, ScrollExperience, ChartBackdrop, ClassroomStrip, PartnerMarquee, ResultsWall, VideoIntro).
- (earlier) Dark brand-blue redesign, plain dark background, pricing ₹49,990/₹1,99,990, 3D mentor cards, candlestick cursor, chart quiz, classroom photos, confirmation emails (Resend managed), JWT admin dashboard at /admin, demo payment flow (Razorpay keys never arrived — checkout to be replaced by Apex LMS redirect).

## Pending / backlog
- P0: Apex IT Solutions LMS payment link from user → wire Enroll buttons as external redirect (currently demo checkout).
- P0 (user-side, deployment): Hostinger deployment — admin panel broken there because frontend was deployed without a reachable backend (REACT_APP_BACKEND_URL / API hosting / CORS). Code verified working in preview. User to share hosting details for guidance.
- P1: UI or CLI to change default admin password (OneStock@Admin2026 → ADMIN_PASSWORD in backend/.env).
- P1: Refactor server.py (510+ lines) into routers/modules; extract Home.jsx section data.
- P2: Contact details/socials in footer, batch dates, SEO meta + OG images.
