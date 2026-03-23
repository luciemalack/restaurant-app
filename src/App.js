import { useState, useEffect } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api/" });

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// ─── STYLES ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --noir: #0D0A05; --brun: #1C1409; --or: #C9953C; --or-pale: #FBF4E8;
    --creme: #FAF7F2; --vert: #2A6B47; --vert-clair: #E6F4ED;
    --rouge: #B83232; --rouge-clair: #FDEAEA; --bleu: #1E4D8C; --bleu-clair: #EBF1FA;
    --gris: #6B6560;
  }
  body { font-family: 'Jost', sans-serif; background: var(--creme); color: var(--noir); min-height: 100vh; }
  h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; }
  .app { min-height: 100vh; }
  .sidebar { width: 260px; background: var(--brun); position: fixed; top: 0; left: 0; bottom: 0; display: flex; flex-direction: column; z-index: 100; border-right: 1px solid rgba(201,149,60,0.2); transition: transform 0.3s; }
  .main { margin-left: 260px; min-height: 100vh; display: flex; flex-direction: column; }
  .sidebar-logo { padding: 32px 24px 24px; border-bottom: 1px solid rgba(201,149,60,0.15); }
  .sidebar-logo h1 { color: var(--or); font-size: 26px; line-height: 1.1; }
  .sidebar-logo p { color: rgba(255,255,255,0.3); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .sidebar-user { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sidebar-user-name { color: white; font-size: 14px; font-weight: 500; }
  .sidebar-user-role { font-size: 11px; color: var(--or); text-transform: uppercase; letter-spacing: 1px; }
  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
  .nav-btn { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; color: rgba(255,255,255,0.45); cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.2s; }
  .nav-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
  .nav-btn.active { background: linear-gradient(135deg, var(--or), #A87830); color: white; }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.05); }
  .logout-btn { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.35); background: none; border: none; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 13px; width: 100%; padding: 8px 0; transition: color 0.2s; }
  .logout-btn:hover { color: var(--rouge); }
  .topbar { background: white; border-bottom: 1px solid rgba(0,0,0,0.07); padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar h2 { font-size: 24px; color: var(--noir); }
  .content { padding: 32px; flex: 1; }
  .auth-page { min-height: 100vh; display: flex; background: var(--noir); }
  .auth-left { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px; background: linear-gradient(135deg, var(--noir) 0%, var(--brun) 100%); position: relative; }
  .auth-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(201,149,60,0.12) 0%, transparent 60%); }
  .auth-brand { position: relative; z-index: 1; }
  .auth-brand h1 { color: var(--or); font-size: 52px; line-height: 1; margin-bottom: 12px; }
  .auth-brand p { color: rgba(255,255,255,0.4); font-size: 13px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 48px; }
  .auth-features { display: flex; flex-direction: column; gap: 20px; }
  .auth-feature { display: flex; align-items: center; gap: 14px; color: rgba(255,255,255,0.6); font-size: 14px; }
  .auth-feature-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(201,149,60,0.15); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .auth-right { width: 480px; background: var(--creme); display: flex; align-items: center; justify-content: center; padding: 60px 48px; }
  .auth-form-wrap { width: 100%; }
  .auth-title { font-size: 32px; color: var(--noir); margin-bottom: 6px; }
  .auth-subtitle { color: var(--gris); font-size: 14px; margin-bottom: 36px; }
  .auth-tabs { display: flex; margin-bottom: 32px; border-radius: 10px; overflow: hidden; border: 1.5px solid rgba(0,0,0,0.1); }
  .auth-tab { flex: 1; padding: 11px; text-align: center; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600; border: none; background: white; color: var(--gris); transition: all 0.2s; }
  .auth-tab.active { background: var(--or); color: white; }
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; font-weight: 600; color: var(--gris); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
  .form-input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1.5px solid rgba(0,0,0,0.1); background: white; font-family: 'Jost', sans-serif; font-size: 14px; color: var(--noir); transition: all 0.2s; }
  .form-input:focus { outline: none; border-color: var(--or); box-shadow: 0 0 0 3px rgba(201,149,60,0.1); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 10px; border: none; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 600; transition: all 0.2s; }
  .btn-full { width: 100%; justify-content: center; }
  .btn-primary { background: var(--or); color: white; }
  .btn-primary:hover { background: #B8842E; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-outline { background: transparent; border: 1.5px solid rgba(0,0,0,0.15); color: var(--noir); padding: 11px 20px; }
  .btn-icon { padding: 9px; border-radius: 9px; background: rgba(0,0,0,0.05); border: none; cursor: pointer; display: inline-flex; align-items: center; transition: all 0.15s; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: white; border-radius: 16px; padding: 22px; border: 1px solid rgba(0,0,0,0.06); }
  .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: var(--noir); line-height: 1; }
  .stat-label { color: var(--gris); font-size: 12px; margin-top: 4px; font-weight: 500; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-or { background: var(--or-pale); color: var(--or); }
  .badge-vert { background: var(--vert-clair); color: var(--vert); }
  .badge-rouge { background: var(--rouge-clair); color: var(--rouge); }
  .badge-bleu { background: var(--bleu-clair); color: var(--bleu); }
  .badge-gris { background: rgba(0,0,0,0.06); color: var(--gris); }
  .menu-hero { background: linear-gradient(135deg, var(--brun) 0%, #2C1A0A 100%); padding: 40px 32px; position: relative; overflow: hidden; }
  .menu-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 70% 50%, rgba(201,149,60,0.15) 0%, transparent 60%); }
  .menu-hero-content { position: relative; z-index: 1; }
  .menu-hero h2 { color: var(--or); font-size: 36px; margin-bottom: 6px; }
  .menu-hero p { color: rgba(255,255,255,0.5); font-size: 14px; }
  .categories-bar { display: flex; gap: 8px; padding: 20px 32px; background: white; border-bottom: 1px solid rgba(0,0,0,0.06); overflow-x: auto; }
  .cat-btn { padding: 8px 18px; border-radius: 20px; border: 1.5px solid rgba(0,0,0,0.1); background: white; color: var(--gris); cursor: pointer; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500; white-space: nowrap; transition: all 0.15s; }
  .cat-btn.active { background: var(--or); border-color: var(--or); color: white; }
  .plats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .plat-card { background: white; border-radius: 14px; padding: 20px; border: 1.5px solid transparent; cursor: pointer; transition: all 0.2s; }
  .plat-card:hover { border-color: var(--or); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .plat-card.selected { border-color: var(--or); background: var(--or-pale); }
  .plat-nom { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; margin-bottom: 6px; }
  .plat-desc { color: var(--gris); font-size: 13px; line-height: 1.5; margin-bottom: 14px; }
  .plat-prix { font-size: 18px; font-weight: 700; color: var(--or); }
  .qty-control { display: flex; align-items: center; gap: 8px; }
  .qty-btn { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid rgba(0,0,0,0.12); background: white; cursor: pointer; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .panier-panel { position: fixed; right: 0; top: 0; bottom: 0; width: 360px; background: white; border-left: 1px solid rgba(0,0,0,0.08); display: flex; flex-direction: column; z-index: 200; transform: translateX(100%); transition: transform 0.3s ease; box-shadow: -8px 0 32px rgba(0,0,0,0.1); }
  .panier-panel.open { transform: translateX(0); }
  .panier-header { padding: 24px; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; }
  .panier-body { flex: 1; overflow-y: auto; padding: 16px 24px; }
  .panier-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .panier-footer { padding: 20px 24px; border-top: 1px solid rgba(0,0,0,0.06); }
  .panier-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .panier-total-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: var(--or); }
  .panier-btn-open { position: fixed; bottom: 24px; right: 24px; z-index: 150; background: var(--or); color: white; border: none; border-radius: 50px; padding: 14px 24px; font-family: 'Jost', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(201,149,60,0.4); transition: all 0.2s; }
  .commande-card { background: white; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 14px; }
  .commande-header { padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .commande-body { padding: 16px 22px; }
  .commande-item-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,0.06); }
  .commande-footer { padding: 14px 22px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; }
  .statut-step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid rgba(0,0,0,0.1); background: white; color: var(--gris); }
  .statut-step-dot.done { background: var(--vert); border-color: var(--vert); color: white; }
  .statut-step-dot.current { background: var(--or); border-color: var(--or); color: white; animation: pulse 2s infinite; }
  .statut-step-line { height: 2px; flex: 1; background: rgba(0,0,0,0.08); }
  .statut-step-line.done { background: var(--vert); }
  .statut-step-label { font-size: 10px; color: var(--gris); margin-top: 6px; text-align: center; font-weight: 500; }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(201,149,60,0.4); } 50% { box-shadow: 0 0 0 8px rgba(201,149,60,0); } }
  .admin-commande { background: white; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 12px; overflow: hidden; }
  .admin-commande-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .admin-commande-body { padding: 14px 20px; }
  .admin-commande-footer { padding: 12px 20px; background: rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; }
  .statut-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .statut-action-btn { padding: 6px 14px; border-radius: 8px; border: none; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600; transition: all 0.15s; }
  .admin-plat-card { background: white; border-radius: 14px; padding: 18px; border: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .toggle-switch { width: 40px; height: 22px; border-radius: 11px; background: rgba(0,0,0,0.12); position: relative; transition: background 0.2s; cursor: pointer; }
  .toggle-switch.on { background: var(--vert); }
  .toggle-knob { width: 16px; height: 16px; border-radius: 50%; background: white; position: absolute; top: 3px; left: 3px; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .toggle-switch.on .toggle-knob { left: 21px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: white; border-radius: 20px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.2); animation: slideUp 0.25s ease; }
  .modal-header { padding: 24px 28px 0; display: flex; justify-content: space-between; align-items: center; }
  .modal-title { font-size: 22px; }
  .modal-body { padding: 20px 28px 28px; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .notif { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 9999; background: var(--brun); color: white; padding: 14px 24px; border-radius: 12px; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; white-space: nowrap; }
  .empty { text-align: center; padding: 60px 20px; color: var(--gris); }
  .empty-emoji { font-size: 52px; margin-bottom: 12px; }
  .divider { height: 1px; background: rgba(0,0,0,0.06); margin: 20px 0; }
  .text-muted { color: var(--gris); font-size: 13px; }
  .section-title { font-size: 20px; margin-bottom: 16px; }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .filter-btn { padding: 7px 16px; border-radius: 20px; border: 1.5px solid rgba(0,0,0,0.1); background: white; color: var(--gris); cursor: pointer; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500; transition: all 0.15s; }
  .filter-btn.active { background: var(--or); border-color: var(--or); color: white; }
  .success-banner { background: var(--vert-clair); border: 1px solid rgba(42,107,71,0.2); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; color: var(--vert); font-weight: 500; margin-bottom: 20px; }
  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0) !important; }
    .main { margin-left: 0 !important; }
    .content { padding: 20px 16px; }
    .topbar { padding: 14px 16px; }
    .auth-left { display: none; }
    .auth-right { width: 100%; padding: 40px 24px; }
    .panier-panel { width: 100%; }
    .form-row { grid-template-columns: 1fr; }
    .plats-grid { grid-template-columns: 1fr; }
  }
  .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
  @media (max-width: 900px) { .hamburger { display: flex; align-items: center; } }
  .overlay-mob { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }
  .overlay-mob.show { display: block; }
`;

// ─── ICONS ─────────────────────────────────────────────────────────────────
const Ic = ({ n, s = 18 }) => {
  const icons = {
    menu: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
    orders: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
    food: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    cart: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
    logout: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    close: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    plus: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
    trash: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    clock: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  };
  return icons[n] || null;
};

// ─── NOTIFICATION ──────────────────────────────────────────────────────────
function Notif({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className="notif">✓ {msg}</div>;
}

// ─── STATUT TIMELINE ───────────────────────────────────────────────────────
function StatutTimeline({ statut }) {
  const steps = [
    { key: "en_attente", label: "Reçue", icon: "📥" },
    { key: "en_preparation", label: "En cuisine", icon: "👨‍🍳" },
    { key: "pret", label: "Prête", icon: "✅" },
    { key: "livre", label: "Livrée", icon: "🎉" },
  ];
  if (statut === "annule") return <div style={{ padding: "12px 0" }}><span className="badge badge-rouge">Commande annulée</span></div>;
  const currentIdx = steps.findIndex(s => s.key === statut);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", padding: "8px 0" }}>
      {steps.map((step, i) => (
        <div key={step.key} style={{ display: "flex", alignItems: "flex-start", flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className={`statut-step-dot ${i < currentIdx ? "done" : i === currentIdx ? "current" : ""}`}>
              {i < currentIdx ? <Ic n="check" s={12}/> : step.icon}
            </div>
            <div className="statut-step-label">{step.label}</div>
          </div>
          {i < steps.length - 1 && <div className={`statut-step-line ${i < currentIdx ? "done" : ""}`} style={{ marginTop: 13, marginLeft: 4, marginRight: 4 }}/>}
        </div>
      ))}
    </div>
  );
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [tab, setTab] = useState("connexion");
  const [form, setForm] = useState({ username: "", password: "", email: "", first_name: "", last_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (tab === "connexion") {
        const res = await API.post("auth/connexion/", { username: form.username, password: form.password });
        localStorage.setItem("token", res.data.tokens.access);
        localStorage.setItem("refresh", res.data.tokens.refresh);
        onAuth(res.data.user);
      } else {
        if (!form.username || !form.password || !form.first_name) { setError("Remplissez tous les champs obligatoires"); setLoading(false); return; }
        const res = await API.post("auth/inscription/", form);
        localStorage.setItem("token", res.data.tokens.access);
        localStorage.setItem("refresh", res.data.tokens.refresh);
        onAuth(res.data.user);
      }
    } catch (e) { setError(e.response?.data?.error || e.response?.data?.username?.[0] || "Une erreur est survenue"); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <h1>La Belle<br/>Époque</h1>
          <p>Restaurant Gastronomique</p>
          <div className="auth-features">
            {[
              { icon: "🍽️", text: "Carte raffinée et saisonnière" },
              { icon: "⚡", text: "Commande en ligne instantanée" },
              { icon: "📱", text: "Suivi de commande en temps réel" },
              { icon: "👨‍🍳", text: "Préparée par nos chefs experts" },
            ].map((f, i) => (
              <div className="auth-feature" key={i}>
                <div className="auth-feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2 className="auth-title">Bienvenue</h2>
          <p className="auth-subtitle">{tab === "connexion" ? "Connectez-vous à votre compte" : "Créez votre compte client"}</p>
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === "connexion" ? "active" : ""}`} onClick={() => { setTab("connexion"); setError(""); }}>Connexion</button>
            <button className={`auth-tab ${tab === "inscription" ? "active" : ""}`} onClick={() => { setTab("inscription"); setError(""); }}>Inscription</button>
          </div>
          {tab === "inscription" && (
            <div className="form-row" style={{ marginBottom: 18 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Prénom *</label>
                <input className="form-input" value={form.first_name} onChange={e => set("first_name", e.target.value)} placeholder="Marie"/>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nom *</label>
                <input className="form-input" value={form.last_name} onChange={e => set("last_name", e.target.value)} placeholder="Dupont"/>
              </div>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur *</label>
            <input className="form-input" value={form.username} onChange={e => set("username", e.target.value)} placeholder="ex: marie.dupont" onKeyDown={e => e.key === "Enter" && submit()}/>
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <input className="form-input" type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()}/>
          </div>
          {error && <div style={{ color: "#B83232", fontSize: 13, marginBottom: 14, padding: "10px 14px", background: "#FDEAEA", borderRadius: 8 }}>⚠️ {error}</div>}
          <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>
            {loading ? "Chargement..." : tab === "connexion" ? "Se connecter" : "Créer mon compte"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CLIENT MENU ───────────────────────────────────────────────────────────
function ClientMenu({ user, onNotif }) {
  const [plats, setPlats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catFiltre, setCatFiltre] = useState("all");
  const [panier, setPanier] = useState({});
  const [panierOpen, setPanierOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("plats/").then(r => setPlats(r.data));
    API.get("categories/").then(r => setCategories(r.data));
  }, []);

  const addToCart = (id) => setPanier(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const removeFromCart = (id) => setPanier(p => { const n = { ...p }; if (n[id] > 1) n[id]--; else delete n[id]; return n; });
  const totalItems = Object.values(panier).reduce((s, q) => s + q, 0);
  const totalPrix = Object.entries(panier).reduce((s, [id, q]) => s + q * (plats.find(p => p.id === Number(id))?.prix || 0), 0);

  const commander = async () => {
    if (Object.keys(panier).length === 0) return;
    setLoading(true);
    try {
      const items = Object.entries(panier).map(([id, q]) => ({ plat_id: Number(id), quantite: q }));
      await API.post("commandes/", { items, notes });
      setPanier({}); setNotes(""); setPanierOpen(false);
      onNotif("Commande envoyée en cuisine !");
    } catch (e) { onNotif("Erreur lors de la commande"); }
    setLoading(false);
  };

  const filtered = catFiltre === "all" ? plats : plats.filter(p => p.categorie === Number(catFiltre));

  return (
    <div style={{ position: "relative" }}>
      <div className="menu-hero">
        <div className="menu-hero-content">
          <h2>Notre Carte</h2>
          <p>Découvrez nos plats préparés avec passion</p>
        </div>
      </div>
      <div className="categories-bar">
        <button className={`cat-btn ${catFiltre === "all" ? "active" : ""}`} onClick={() => setCatFiltre("all")}>Tout voir</button>
        {categories.map(c => (
          <button key={c.id} className={`cat-btn ${catFiltre === String(c.id) ? "active" : ""}`} onClick={() => setCatFiltre(String(c.id))}>
            {c.icone} {c.nom}
          </button>
        ))}
      </div>
      <div className="content">
        {plats.length === 0 ? (
          <div className="empty"><div className="empty-emoji">🍽️</div><p>Aucun plat disponible pour le moment</p></div>
        ) : (
          <div className="plats-grid">
            {filtered.map(plat => (
              <div key={plat.id} className={`plat-card ${panier[plat.id] ? "selected" : ""}`}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{plat.categorie_icone || "🍽️"}</div>
                <div className="plat-nom">{plat.nom}</div>
                <div className="plat-desc">{plat.description}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div className="plat-prix">{Number(plat.prix).toFixed(2)}€</div>
                    <div style={{ color: "#6B6560", fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <Ic n="clock" s={12}/>{plat.temps_preparation} min
                    </div>
                  </div>
                  <div className="qty-control">
                    {panier[plat.id] && <button className="qty-btn" onClick={() => removeFromCart(plat.id)}>−</button>}
                    {panier[plat.id] && <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{panier[plat.id]}</span>}
                    <button className="qty-btn" onClick={() => addToCart(plat.id)} style={{ background: "#C9953C", color: "white", border: "none" }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {totalItems > 0 && !panierOpen && (
        <button className="panier-btn-open" onClick={() => setPanierOpen(true)}>
          <Ic n="cart" s={20}/>Mon panier
          <span style={{ background: "white", color: "#C9953C", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{totalItems}</span>
          · {totalPrix.toFixed(2)}€
        </button>
      )}
      <div className={`panier-panel ${panierOpen ? "open" : ""}`}>
        <div className="panier-header">
          <h3>Mon Panier</h3>
          <button className="btn-icon" onClick={() => setPanierOpen(false)}><Ic n="close"/></button>
        </div>
        <div className="panier-body">
          {Object.entries(panier).map(([id, qty]) => {
            const plat = plats.find(p => p.id === Number(id));
            if (!plat) return null;
            return (
              <div className="panier-item" key={id}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{plat.nom}</div>
                  <div style={{ color: "#6B6560", fontSize: 13 }}>{qty} × {Number(plat.prix).toFixed(2)}€</div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => removeFromCart(Number(id))}>−</button>
                  <span style={{ fontWeight: 700 }}>{qty}</span>
                  <button className="qty-btn" onClick={() => addToCart(Number(id))}>+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="panier-footer">
          <textarea style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.1)", fontFamily: "Jost, sans-serif", fontSize: 13, marginBottom: 14, resize: "none" }} rows="2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes spéciales..."/>
          <div className="panier-total">
            <span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>
            <span className="panier-total-val">{totalPrix.toFixed(2)}€</span>
          </div>
          <button className="btn btn-primary btn-full" onClick={commander} disabled={loading}>
            {loading ? "Envoi..." : "Commander maintenant →"}
          </button>
        </div>
      </div>
      {panierOpen && <div className="overlay-mob show" onClick={() => setPanierOpen(false)}/>}
    </div>
  );
}

// ─── CLIENT COMMANDES ──────────────────────────────────────────────────────
function ClientCommandes() {
  const [commandes, setCommandes] = useState([]);

  const charger = () => API.get("commandes/").then(r => setCommandes(r.data)).catch(() => {});
  useEffect(() => { charger(); const t = setInterval(charger, 5000); return () => clearInterval(t); }, []);

  const statutBadge = { en_attente: "badge-or", en_preparation: "badge-bleu", pret: "badge-vert", livre: "badge-gris", annule: "badge-rouge" };
  const statutLabel = { en_attente: "En attente", en_preparation: "En cuisine", pret: "Prête !", livre: "Livrée", annule: "Annulée" };

  return (
    <div className="content">
      {commandes.length === 0 ? (
        <div className="empty"><div className="empty-emoji">📋</div><p>Aucune commande pour le moment</p></div>
      ) : commandes.map(cmd => (
        <div className="commande-card" key={cmd.id}>
          <div className="commande-header">
            <div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 600 }}>Commande #{cmd.id}</div>
              <div className="text-muted">{new Date(cmd.created_at).toLocaleDateString("fr")}</div>
            </div>
            <span className={`badge ${statutBadge[cmd.statut]}`}>{statutLabel[cmd.statut]}</span>
          </div>
          <div className="commande-body">
            {cmd.statut === "livre" && (
              <div className="success-banner"><Ic n="check" s={20}/>Votre commande a été livrée ! Bon appétit 🎉</div>
            )}
            <StatutTimeline statut={cmd.statut}/>
            <div className="divider"/>
            {cmd.items.map((item, i) => (
              <div className="commande-item-row" key={i}>
                <span>{item.quantite}× {item.plat_nom}</span>
                <span style={{ fontWeight: 600 }}>{Number(item.sous_total).toFixed(2)}€</span>
              </div>
            ))}
          </div>
          <div className="commande-footer">
            <span className="text-muted">{cmd.items.length} article(s)</span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>Total : {Number(cmd.total).toFixed(2)}€</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
function AdminDashboard({ onNotif }) {
  const [stats, setStats] = useState({});
  const [commandes, setCommandes] = useState([]);
  const [filtre, setFiltre] = useState("actives");

  const charger = async () => {
    const [s, c] = await Promise.all([
      API.get("commandes/statistiques/").catch(() => ({ data: {} })),
      API.get("commandes/").catch(() => ({ data: [] }))
    ]);
    setStats(s.data); setCommandes(c.data);
  };
  useEffect(() => { charger(); const t = setInterval(charger, 4000); return () => clearInterval(t); }, []);

  const changerStatut = async (id, statut) => {
    await API.patch(`commandes/${id}/changer_statut/`, { statut });
    charger();
    onNotif(`Commande #${id} mise à jour`);
  };

  const filtered = filtre === "actives"
    ? commandes.filter(c => !["livre", "annule"].includes(c.statut))
    : filtre === "livrees" ? commandes.filter(c => c.statut === "livre")
    : commandes;

  const actionsBtns = {
    en_attente: [{ s: "en_preparation", l: "Accepter", bg: "#EBF1FA", c: "#1E4D8C" }, { s: "annule", l: "Refuser", bg: "#FDEAEA", c: "#B83232" }],
    en_preparation: [{ s: "pret", l: "Marquer Prêt", bg: "#E6F4ED", c: "#2A6B47" }],
    pret: [{ s: "livre", l: "Livrer", bg: "#E6F4ED", c: "#2A6B47" }],
    livre: [], annule: [],
  };

  return (
    <div className="content">
      <div className="stats-grid">
        {[
          { label: "En attente", value: stats.en_attente || 0, icon: "⏳", bg: "#FBF4E8" },
          { label: "En cuisine", value: stats.en_preparation || 0, icon: "👨‍🍳", bg: "#EBF1FA" },
          { label: "Livrées", value: stats.livrees || 0, icon: "✅", bg: "#E6F4ED" },
          { label: "Revenus", value: `${Number(stats.revenus || 0).toFixed(0)}€`, icon: "💰", bg: "#F5F0FF" },
          { label: "Clients", value: stats.total_clients || 0, icon: "👥", bg: "#FBF4E8" },
          { label: "Plats actifs", value: stats.total_plats || 0, icon: "🍽️", bg: "#E6F4ED" },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <h3 className="section-title">Gestion des commandes</h3>
      <div className="filters">
        {[
          { k: "actives", l: `Actives (${commandes.filter(c => !["livre","annule"].includes(c.statut)).length})` },
          { k: "livrees", l: "Livrées" },
          { k: "all", l: "Toutes" }
        ].map(f => (
          <button key={f.k} className={`filter-btn ${filtre === f.k ? "active" : ""}`} onClick={() => setFiltre(f.k)}>{f.l}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-emoji">✅</div><p>Aucune commande</p></div>
      ) : filtered.map(cmd => (
        <div className="admin-commande" key={cmd.id}>
          <div className="admin-commande-header">
            <div>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 600 }}>Commande #{cmd.id}</span>
              <div className="text-muted">{cmd.client_nom} (@{cmd.client_username})</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontWeight: 700 }}>{Number(cmd.total).toFixed(2)}€</span>
              <span className={`badge ${cmd.statut === "en_attente" ? "badge-or" : cmd.statut === "en_preparation" ? "badge-bleu" : cmd.statut === "pret" ? "badge-vert" : cmd.statut === "livre" ? "badge-gris" : "badge-rouge"}`}>
                {cmd.statut === "en_attente" ? "En attente" : cmd.statut === "en_preparation" ? "En cuisine" : cmd.statut === "pret" ? "Prête" : cmd.statut === "livre" ? "Livrée" : "Annulée"}
              </span>
            </div>
          </div>
          <div className="admin-commande-body">
            {cmd.items.map((item, i) => (
              <div className="commande-item-row" key={i}>
                <span>{item.quantite}× {item.plat_nom}</span>
                <span style={{ fontWeight: 600 }}>{Number(item.sous_total).toFixed(2)}€</span>
              </div>
            ))}
          </div>
          {(actionsBtns[cmd.statut] || []).length > 0 && (
            <div className="admin-commande-footer">
              <span className="text-muted">{cmd.items.length} article(s)</span>
              <div className="statut-btns">
                {actionsBtns[cmd.statut].map(a => (
                  <button key={a.s} className="statut-action-btn" style={{ background: a.bg, color: a.c }} onClick={() => changerStatut(cmd.id, a.s)}>{a.l}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN MENU ─────────────────────────────────────────────────────────────
function AdminMenu({ onNotif }) {
  const [plats, setPlats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nom: "", description: "", prix: "", categorie: 1, disponible: true, temps_preparation: 15 });

  const charger = () => {
    API.get("plats/").then(r => setPlats(r.data));
    API.get("categories/").then(r => setCategories(r.data));
  };
  useEffect(() => { charger(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const sauvegarder = async () => {
    await API.post("plats/", { ...form, prix: Number(form.prix), categorie: Number(form.categorie) });
    charger(); setModal(false);
    setForm({ nom: "", description: "", prix: "", categorie: 1, disponible: true, temps_preparation: 15 });
    onNotif("Plat ajouté au menu !");
  };

  const toggleDispo = async (plat) => {
    await API.patch(`plats/${plat.id}/`, { disponible: !plat.disponible });
    charger();
  };

  const supprimer = async (id) => {
    await API.delete(`plats/${id}/`);
    charger();
    onNotif("Plat supprimé");
  };

  return (
    <div className="content">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => setModal(true)}><Ic n="plus" s={16}/>Nouveau plat</button>
      </div>
      {plats.length === 0 ? (
        <div className="empty"><div className="empty-emoji">🍽️</div><p>Aucun plat dans le menu</p></div>
      ) : plats.map(plat => (
        <div className="admin-plat-card" key={plat.id}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 600 }}>{plat.nom}</span>
              <span className={`badge ${plat.disponible ? "badge-vert" : "badge-rouge"}`}>{plat.disponible ? "Disponible" : "Indisponible"}</span>
            </div>
            <div className="text-muted">{plat.description}</div>
            <div style={{ marginTop: 8, fontWeight: 700, color: "#C9953C" }}>{Number(plat.prix).toFixed(2)}€</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className={`toggle-switch ${plat.disponible ? "on" : ""}`} onClick={() => toggleDispo(plat)}>
              <div className="toggle-knob"/>
            </div>
            <button className="btn-icon" style={{ color: "#B83232" }} onClick={() => supprimer(plat.id)}><Ic n="trash" s={15}/></button>
          </div>
        </div>
      ))}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Nouveau plat</h3>
              <button className="btn-icon" onClick={() => setModal(false)}><Ic n="close"/></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom du plat</label>
                <input className="form-input" value={form.nom} onChange={e => set("nom", e.target.value)} placeholder="Ex: Entrecôte grillée"/>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Description..."/>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prix (€)</label>
                  <input className="form-input" type="number" step="0.5" value={form.prix} onChange={e => set("prix", e.target.value)}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Préparation (min)</label>
                  <input className="form-input" type="number" value={form.temps_preparation} onChange={e => set("temps_preparation", e.target.value)}/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <select className="form-input" value={form.categorie} onChange={e => set("categorie", Number(e.target.value))}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icone} {c.nom}</option>)}
                </select>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={() => setModal(false)}>Annuler</button>
                <button className="btn btn-primary" onClick={sauvegarder}><Ic n="check" s={16}/>Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notif, setNotif] = useState(null);

  const onNotif = (msg) => setNotif(msg);
  const onAuth = (u) => { setUser(u); setPage(u.role === "admin" ? "dashboard" : "menu"); };
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("refresh"); setUser(null); setPage(""); };

  if (!user) return (
    <>
      <style>{styles}</style>
      <AuthPage onAuth={onAuth}/>
      {notif && <Notif msg={notif} onClose={() => setNotif(null)}/>}
    </>
  );

  const isAdmin = user.role === "admin";
  const nav = isAdmin
    ? [{ id: "dashboard", label: "Commandes", icon: "orders" }, { id: "menu", label: "Gérer le menu", icon: "food" }]
    : [{ id: "menu", label: "La Carte", icon: "food" }, { id: "mescommandes", label: "Mes commandes", icon: "orders" }];

  const pageTitles = { dashboard: "Gestion des commandes", menu: isAdmin ? "Gestion du menu" : "Notre Carte", mescommandes: "Mes commandes" };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className={`overlay-mob ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)}/>
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <h1>La Belle<br/>Époque</h1>
            <p>Restaurant Gastronomique</p>
          </div>
          <div className="sidebar-user">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#C9953C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              {(user.first_name?.[0] || user.username[0]).toUpperCase()}
            </div>
            <div className="sidebar-user-name">{user.first_name} {user.last_name}</div>
            <div className="sidebar-user-role">{isAdmin ? "👑 Administrateur" : "👤 Client"}</div>
          </div>
          <nav className="sidebar-nav">
            {nav.map(item => (
              <button key={item.id} className={`nav-btn ${page === item.id ? "active" : ""}`} onClick={() => { setPage(item.id); setSidebarOpen(false); }}>
                <Ic n={item.icon}/>{item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={logout}><Ic n="logout"/>Se déconnecter</button>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}><Ic n="menu" s={22}/></button>
              <h2>{pageTitles[page]}</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#C9953C", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>
                {(user.first_name?.[0] || user.username[0]).toUpperCase()}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{user.first_name || user.username}</span>
            </div>
          </div>
          {page === "dashboard" && isAdmin && <AdminDashboard onNotif={onNotif}/>}
          {page === "menu" && isAdmin && <AdminMenu onNotif={onNotif}/>}
          {page === "menu" && !isAdmin && <ClientMenu user={user} onNotif={onNotif}/>}
          {page === "mescommandes" && !isAdmin && <ClientCommandes/>}
        </main>
      </div>
      {notif && <Notif msg={notif} onClose={() => setNotif(null)}/>}
    </>
  );
}