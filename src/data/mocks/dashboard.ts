export type DealStatusTone = "review" | "approved" | "active" | "completed" | "stopped";

export const dashboardData = {
  office: {
    name: "אופק פתרונות מימון",
    userName: "ישראל ישראלי",
  },
  kpis: [
    {
      label: "היקף עסקאות כולל",
      value: "₪4,850,000",
      change: "12.4%+",
      context: "לעומת החודש הקודם",
      featured: true,
    },
    {
      label: "עסקאות פעילות",
      value: "12",
      change: "3 חדשות",
      context: "מתחילת השבוע",
      featured: false,
    },
    {
      label: "עסקאות שבוצעו",
      value: "34",
      change: "8 החודש",
      context: "הושלמו בהצלחה",
      featured: false,
    },
    {
      label: "עסקאות בטיפול",
      value: "7",
      change: "2 עודכנו",
      context: "ב־24 השעות האחרונות",
      featured: false,
    },
  ],
  annualTarget: {
    current: "₪8,250,000",
    goal: "₪12,000,000",
    percent: 69,
    remaining: "₪3,750,000 נותרו להשלמת היעד",
    period: "שנת 2026",
  },
  monthlyActivity: [
    { month: "ינו׳", value: 620000 },
    { month: "פבר׳", value: 740000 },
    { month: "מרץ", value: 680000 },
    { month: "אפר׳", value: 910000 },
    { month: "מאי", value: 830000 },
    { month: "יוני", value: 1050000 },
  ],
  pipeline: [
    { label: "בטיפול", value: 7, tone: "#a28457" },
    { label: "אושרו", value: 5, tone: "#647b70" },
    { label: "בוצעו", value: 34, tone: "#33383d" },
    { label: "נדחו", value: 2, tone: "#9a6d68" },
  ],
  checksOverview: {
    total: 186,
    returnedPercent: 4.8,
    statuses: [
      { label: "נפרעו", value: 142, percent: 76, tone: "#3f484d" },
      { label: "ממתינים לפירעון", value: 35, percent: 19, tone: "#a58a5a" },
      { label: "חזרו", value: 9, percent: 5, tone: "#9a6d68" },
    ],
    returnReasons: [
      { label: "אין כיסוי מספיק", value: 5, percent: 56, tone: "#8c625d" },
      { label: "חשבון מוגבל", value: 2, percent: 22, tone: "#a88758" },
      { label: "הוראת ביטול", value: 1, percent: 11, tone: "#747e83" },
      { label: "סיבה טכנית", value: 1, percent: 11, tone: "#b8bdc0" },
    ],
  },
  recentDeals: [
    { id: "#10234", date: "01/09/2026", amount: "₪185,000", checks: 4, status: "בבדיקת חיתום", tone: "review" as DealStatusTone },
    { id: "#10231", date: "31/08/2026", amount: "₪92,500", checks: 2, status: "אושרה", tone: "approved" as DealStatusTone },
    { id: "#10227", date: "29/08/2026", amount: "₪310,000", checks: 7, status: "בטיפול", tone: "active" as DealStatusTone },
    { id: "#10221", date: "27/08/2026", amount: "₪145,000", checks: 3, status: "בוצעה", tone: "completed" as DealStatusTone },
  ],
  allDeals: [
    { id: "#10234", date: "01/09/2026", amount: "₪185,000", checks: 4, status: "בבדיקת חיתום", tone: "review" as DealStatusTone, update: "בדיקת מסמכים", updateDate: "02/09/2026" },
    { id: "#10231", date: "31/08/2026", amount: "₪92,500", checks: 2, status: "אושרה", tone: "approved" as DealStatusTone, update: "ממתינה לביצוע", updateDate: "01/09/2026" },
    { id: "#10227", date: "29/08/2026", amount: "₪310,000", checks: 7, status: "בטיפול", tone: "active" as DealStatusTone, update: "בדיקת בטוחות", updateDate: "01/09/2026" },
    { id: "#10221", date: "27/08/2026", amount: "₪145,000", checks: 3, status: "בוצעה", tone: "completed" as DealStatusTone, update: "העסקה הושלמה", updateDate: "29/08/2026" },
    { id: "#10218", date: "25/08/2026", amount: "₪78,000", checks: 2, status: "נעצרה", tone: "stopped" as DealStatusTone, update: "מסמכים חסרים", updateDate: "27/08/2026" },
  ],
} as const;
