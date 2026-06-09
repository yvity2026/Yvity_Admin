/** Design-phase mock data — set USE_DASHBOARD_MOCK = true to preview layout. */



import { mapQuickActions } from "@/lib/admin/dashboardQuickActions";



export const USE_DASHBOARD_MOCK = false;



export const DASHBOARD_MOCK = {

  meta: {

    adminName: "Krishna",

    periodLabel: "Last 6 months",

    updatedAt: "Updated 2 min ago",

  },

  platformGrowth: [

    { id: "total-users", label: "Total users", value: "2,140", emoji: "👥", hint: "All accounts", accent: "teal" },

    { id: "professionals", label: "Total professionals", value: "1,248", emoji: "👨‍💼", hint: "Advisor profiles", accent: "teal" },

    { id: "customers", label: "Total customers", value: "892", emoji: "🙋", hint: "Non-advisor users", accent: "slate" },

    { id: "live-profiles", label: "Live professional profiles", value: "1,104", emoji: "📄", hint: "Verified & active", accent: "gold" },

    { id: "registrations-today", label: "New registrations today", value: "18", emoji: "📈", hint: "Users + professionals", accent: "success" },

  ],

  operations: [

    { id: "verifications", label: "Pending service verifications", value: "23", emoji: "🛡", hint: "IRDAI & profile queue", accent: "coral" },

    { id: "complaints", label: "Open complaints", value: "4", emoji: "🚩", hint: "Needs resolution", accent: "coral" },

    { id: "reviews", label: "New reviews", value: "8", emoji: "⭐", hint: "3 submitted today", accent: "gold" },

    { id: "completion", label: "Profile completion", value: "74%", emoji: "📊", hint: "Average across professionals", accent: "teal" },

  ],

  revenue: {

    monthly: "₹2,91,000",

    monthlyCompact: "₹2.9L",

    total: "₹24,80,000",

    months: [

      { month: "Jan", amount: 184000, label: "₹1.84L", highlight: false },

      { month: "Feb", amount: 212000, label: "₹2.12L", highlight: true },

      { month: "Mar", amount: 198000, label: "₹1.98L", highlight: false },

      { month: "Apr", amount: 245000, label: "₹2.45L", highlight: true },

      { month: "May", amount: 268000, label: "₹2.68L", highlight: false },

      { month: "Jun", amount: 291000, label: "₹2.91L", highlight: true },

    ],

    plans: [

      { id: "free", label: "Free members", emoji: "🆓", count: 518, pct: 42, color: "#0D6060" },

      { id: "silver", label: "Silver members", emoji: "🥈", count: 318, pct: 25, color: "#94A3B8" },

      { id: "gold", label: "Gold members", emoji: "🥇", count: 412, pct: 33, color: "#F59E0B" },

    ],

    recentUpgrades: [

      { id: "1", name: "Priya Sharma", city: "Hyderabad", plan: "gold", amount: "₹4,999", time: "12 min ago" },

      { id: "2", name: "Anitha Reddy", city: "Chennai", plan: "silver", amount: "₹1,499", time: "2 hr ago" },

      { id: "3", name: "Ravi Kumar", city: "Nellore", plan: "gold", amount: "₹4,999", time: "5 hr ago" },

    ],

  },

  activity: [

    { id: 1, title: "New user registered", detail: "Arjun Mehta · Bengaluru", time: "8 min ago", tone: "success" },

    { id: 2, title: "Professional profile published", detail: "Priya Sharma · Hyderabad", time: "22 min ago", tone: "success" },

    { id: 3, title: "Silver plan upgraded", detail: "₹1,499 · Anitha Reddy", time: "1 hr ago", tone: "gold" },

    { id: 4, title: "New review submitted", detail: "Audio review · Customer", time: "2 hr ago", tone: "info" },

    { id: 5, title: "New complaint received", detail: "Case CMP-1042", time: "3 hr ago", tone: "warning" },

  ],

  quickActions: mapQuickActions({

    pendingVerifications: 23,

    pendingProfiles: 14,

    openComplaints: 4,

  }),

};


