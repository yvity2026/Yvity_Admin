"use client";
import { useState } from "react";
import PaymentDetails from "@/components/Paymentdetails";
import Link from "next/link";
import { useEffect } from "react";

const COLORS = {
  primary: "#0A4A4A",
  primaryHover: "#155e5e",
  primaryBorder: "#155e5e",
  accent: "#8bc34a",
  gold: "#d4a017",
};

const C = {
  orange: "#E8833A",
  teal: "#3AAFA9",
  pageBg: "#EDEEE6",
  cardBg: "#FFFFFF",
  cardBorder: "#E3E6DC",
  textDark: "#1A2B22",
  textMid: "#6B7280",
  textLight: "#9CA3AF",
  successText: "#166534",
  successBg: "#DCFCE7",
  successBorder: "#86EFAC",
  searchBg: "#1C3829",
  sidebarBody: "#1C3829",
};

const transactions = [
  { id: 1, initials: "KM", avatarBg: C.orange, name: "Krishna Mohan", location: "Nellore, AP", plan: "Gold",   amount: "₹2,999", method: "UPI",        date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
  { id: 2, initials: "PS", avatarBg: C.teal,   name: "Priya Sharma",  location: "Nellore, AP", plan: "Gold",   amount: "₹2,999", method: "Card",        date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
  { id: 3, initials: "PS", avatarBg: C.teal,   name: "Priya Sharma",  location: "Hyderabad",   plan: "Silver", amount: "₹2,999", method: "Net Banking", date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
  { id: 4, initials: "PS", avatarBg: C.teal,   name: "Priya Sharma",  location: "Nellore, AP", plan: "Gold",   amount: "₹2,999", method: "Card",        date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
];

const navItems = {
  MAIN: [
    {
      label: "Overview",
      href: "/admin",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Advisors",
      href: "/admin/advisors",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="9" cy="7" r="4" strokeWidth="2" />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeWidth="2" />
          <path d="M16 11l2 2 4-4" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  APPROVALS: [
    {
      label: "IRDAI Approvals",
      href: "/admin/irdaiapprovals",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <path d="M9 12l2 2 4-4" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  FINANCE: [
    {
      label: "Payments",
      href: "/admin/payments",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "Subscriptions",
      href: "/admin/subscriptions",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" />
        </svg>
      ),
    },
  ],
  SYSTEM: [
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2" />
        </svg>
      ),
    },
  ],
};

function Avatar({ initials, size = 40, bg = COLORS.gold }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: bg, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Sidebar({ activeNav, setActiveNav, onClose }) {
  return (
    <div style={{ background: COLORS.primary, minHeight: "100vh", width: 280, flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <div className="h-[60px] bg-[#FAFAFA] flex justify-center items-center border-b border-[#155e5e]">
  <img
    src="/images/Adivisor/Navbar/navlogo.png"
    alt="logo"
    className="h-10 w-auto object-contain"
  />
</div>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.primaryBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials="KM" size={40} />
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Admin</div>
            <div style={{ color: COLORS.accent, fontSize: 10, marginTop: 1 }}>● Super Administrator</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {Object.entries(navItems).map(([section, items]) => (
          <div key={section}>
            <div style={{ color: "#5fa8a8", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, padding: "14px 16px 4px" }}>
              {section}
            </div>
            {items.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ textDecoration: "none" }}
                  onClick={() => { setActiveNav(item.label); onClose && onClose(); }}
                >
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 16px", cursor: "pointer",
                      color: isActive ? "#fff" : "#a3d0d0",
                      background: isActive ? COLORS.primaryHover : "transparent",
                      borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 0" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", color: "#ef4444", fontSize: 13, cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primaryHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}>
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" strokeWidth="2" />
          </svg>
          Logout
        </div>
      </div>
    </div>
  );
}

function PlanBadge({ plan }) {
  const isGold = plan === "Gold";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 10, fontWeight: 600,
      color: isGold ? "#92400E" : "#475569",
      backgroundColor: isGold ? "#FEF9C3" : "#F1F5F9",
      border: `1px solid ${isGold ? "#FDE68A" : "#CBD5E1"}`,
      padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      {isGold ? "🏅" : "🥈"} {plan}
    </span>
  );
}

export default function PaymentsDashboard() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeNav, setActiveNav]             = useState("Payments");
  const [search, setSearch]                   = useState("");
  const [showSidebar, setShowSidebar]         = useState(false);
  useEffect(() => {
  if (showSidebar) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showSidebar]);

  const filtered = transactions.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.txnId.toLowerCase().includes(search.toLowerCase()) ||
    t.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: C.pageBg }}>

      <style>{`
        .pay-sidebar-container {
          position: relative;
          z-index: 50;
        }
        .pay-hamburger-btn {
          display: none;
        }
        .pay-mobile-overlay {
          display: none;
        }
        .pay-table-scroll-hint {
          display: none;
        }
        @media (max-width: 768px) {
          .pay-sidebar-container {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .pay-sidebar-container.open {
            transform: translateX(0);
          }
          .pay-mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 40;
          }
          .pay-hamburger-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            margin-right: 8px;
          }
          .pay-table-scroll-hint {
            display: block;
            font-size: 11px;
            color: #9ca3af;
            text-align: right;
            padding: 6px 12px 2px;
          }
          .pay-main-content-padding {
            padding: 14px !important;
          }
          .pay-stat-grid {
            grid-template-columns: 1fr !important;
          }
          /* ── FIX: Stack search row vertically on small screens ── */
          .pay-search-row {
            flex-direction: column;
            align-items: stretch !important;
          }
          .pay-search-btn {
            width: 100%;
          }
        }
      `}</style>

      {showSidebar && (
        <div
          className="pay-mobile-overlay"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className={`pay-sidebar-container${showSidebar ? " open" : ""}`}>
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onClose={() => setShowSidebar(false)}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className="pay-hamburger-btn"
              onClick={() => setShowSidebar(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" fill="none" stroke="#374151" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Payments</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" />
              </svg>
              <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", position: "absolute", top: -2, right: -2 }} />
            </div>
            <Avatar initials="KM" size={32} />
          </div>
        </div>

        {/* Body */}
        <main className="pay-main-content-padding" style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>

          {/* STAT CARDS */}
          <div className="pay-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
            <div style={{ backgroundColor: C.cardBg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: "#15803D", backgroundColor: "#DCFCE7", padding: "2px 7px", borderRadius: 20, marginBottom: 8 }}>
                  ↑ 18%
                </span>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.textDark, lineHeight: 1.1 }}>₹12.4L</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 3, fontWeight: 500 }}>Revenue This Month</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>💰</div>
            </div>

            <div style={{ backgroundColor: C.cardBg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ paddingTop: 22 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.textDark, lineHeight: 1.1 }}>₹8.6L</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 3, fontWeight: 500 }}>Gold Plan Revenue</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🏅</div>
            </div>

            <div style={{ backgroundColor: C.cardBg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ paddingTop: 22 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.textDark, lineHeight: 1.1 }}>₹2.1L</div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 3, fontWeight: 500 }}>Silver Plan Revenue</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🥈</div>
            </div>
          </div>

          {/* RECENT TRANSACTIONS */}
          <div style={{ backgroundColor: C.cardBg, borderRadius: 14, border: `1px solid ${C.cardBorder}`, padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={C.sidebarBody} strokeWidth="1.8" strokeLinecap="round"/>
                <rect x="9" y="3" width="6" height="4" rx="1" stroke={C.sidebarBody} strokeWidth="1.8"/>
                <line x1="9" y1="12" x2="15" y2="12" stroke={C.sidebarBody} strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="9" y1="16" x2="13" y2="16" stroke={C.sidebarBody} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span style={{ fontWeight: 700, fontSize: 13, color: C.textDark }}>Recent Transactions</span>
            </div>

            {/* ── FIXED: Search row stacks vertically on small screens ── */}
  <div className="pay-search-row" style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
  <style>{`
    .search-wrap {
      display: flex;
      align-items: center;
      background: #0A4A4A;
      border-radius: 999px;
      padding: 0 20px 0 24px;
      gap: 10px;
      flex: 1;
      max-width: 100%;
      height: 48px;
    }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      color: #fff;
      flex: 1;
      min-width: 0;
      font-family: inherit;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.7); }
    .search-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      flex-shrink: 0;
    }
  `}</style>

  <div className="search-wrap">
    <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.45)" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" strokeWidth="2" />
    </svg>
    <input
      type="text"
      className="search-input"
      placeholder="Search transactions..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <div className="search-arrow">→</div>
  </div>
</div>

            <div className="pay-table-scroll-hint">← Scroll to see all columns →</div>

            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ minWidth: 750, width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                    {["Adviser", "Plan", "Amount", "Method", "Date", "Txn Id", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ textAlign: "left", paddingBottom: 9, paddingRight: 12, fontSize: 10, fontWeight: 700, color: C.textLight, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn, i) => (
                    <tr
                      key={txn.id}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F3F6F0" : "none" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fafafa"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "10px 12px 10px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: txn.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                            {txn.initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.textDark }}>{txn.name}</div>
                            <div style={{ fontSize: 10, color: C.textLight }}>{txn.location}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ paddingRight: 12 }}><PlanBadge plan={txn.plan} /></td>
                      <td style={{ paddingRight: 12, fontSize: 12, fontWeight: 600, color: C.textDark }}>{txn.amount}</td>
                      <td style={{ paddingRight: 12, fontSize: 12, color: C.textMid }}>{txn.method}</td>
                      <td style={{ paddingRight: 12, fontSize: 12, color: C.textMid }}>{txn.date}</td>
                      <td style={{ paddingRight: 12, fontSize: 11, color: C.textLight, fontFamily: "monospace" }}>{txn.txnId}</td>
                      <td style={{ paddingRight: 12 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: C.successText, backgroundColor: C.successBg, border: `1px solid ${C.successBorder}`, padding: "3px 10px", borderRadius: 20 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke={C.successText} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {txn.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedPayment(txn)}
                          style={{ background: COLORS.primary, color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primaryHover; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.primary; }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "28px 0", color: C.textLight, fontSize: 13 }}>
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedPayment && (
        <PaymentDetails data={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
}