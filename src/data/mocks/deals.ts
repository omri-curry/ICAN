export type DealStatus = "in_progress" | "needs_completion" | "approved" | "completed" | "rejected";
export type CheckStatus = "valid" | "needs_completion" | "paid";

export type DealCheck = Readonly<{
  id: string;
  checkNumber: string;
  amount: number;
  dueDate: string;
  drawerName: string;
  status: CheckStatus;
}>;

export type Deal = Readonly<{
  id: string;
  dealNumber: string;
  createdAt: string;
  amount: number;
  checkCount: number;
  status: DealStatus;
  lastUpdated: string;
  currentStage: number;
  checks: ReadonlyArray<DealCheck>;
  requiredActions: ReadonlyArray<string>;
  dealType: string;
  financingOffice: string;
  contactName: string;
}>;

export const dealStatusLabels: Record<DealStatus, string> = {
  in_progress: "בטיפול",
  needs_completion: "ממתין להשלמות",
  approved: "אושרה",
  completed: "בוצעה",
  rejected: "נדחתה",
};

export const checkStatusLabels: Record<CheckStatus, string> = {
  valid: "תקין",
  needs_completion: "נדרשת השלמה",
  paid: "נפרע",
};

export const dealStages = [
  "העסקה התקבלה",
  "בדיקת מסמכים",
  "בדיקת ICAN",
  "אישור העסקה",
  "ביצוע",
] as const;

const finalDealStatuses: ReadonlyArray<DealStatus> = ["completed", "rejected"];

export function isActiveDeal(deal: Deal) {
  return !finalDealStatuses.includes(deal.status);
}

const office = "אופק פתרונות מימון";
const contact = "ישראל ישראלי";

export const deals: ReadonlyArray<Deal> = [
  {
    id: "10301", dealNumber: "#10301", createdAt: "2026-09-02", amount: 145000, checkCount: 3,
    status: "in_progress", lastUpdated: "2026-09-02T12:10:00", currentStage: 0, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [
      { id: "10301-1", checkNumber: "184520", amount: 45000, dueDate: "2026-10-15", drawerName: "חברת א.ב בע״מ", status: "valid" },
      { id: "10301-2", checkNumber: "552018", amount: 62000, dueDate: "2026-10-30", drawerName: "אלון מסחר בע״מ", status: "valid" },
      { id: "10301-3", checkNumber: "774103", amount: 38000, dueDate: "2026-11-15", drawerName: "חברת גמא בע״מ", status: "valid" },
    ],
  },
  {
    id: "10234", dealNumber: "#10234", createdAt: "2026-09-01", amount: 185000, checkCount: 4,
    status: "in_progress", lastUpdated: "2026-09-02T10:35:00", currentStage: 2, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [
      { id: "10234-1", checkNumber: "184520", amount: 45000, dueDate: "2026-09-15", drawerName: "חברת א.ב בע״מ", status: "valid" },
      { id: "10234-2", checkNumber: "184521", amount: 52000, dueDate: "2026-09-30", drawerName: "חברת א.ב בע״מ", status: "valid" },
      { id: "10234-3", checkNumber: "774103", amount: 38000, dueDate: "2026-10-15", drawerName: "חברת גמא בע״מ", status: "needs_completion" },
      { id: "10234-4", checkNumber: "774104", amount: 50000, dueDate: "2026-10-30", drawerName: "חברת גמא בע״מ", status: "valid" },
    ],
  },
  {
    id: "10231", dealNumber: "#10231", createdAt: "2026-08-31", amount: 92500, checkCount: 2,
    status: "approved", lastUpdated: "2026-09-01T14:20:00", currentStage: 3, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [
      { id: "10231-1", checkNumber: "552018", amount: 42500, dueDate: "2026-09-20", drawerName: "אלון מסחר בע״מ", status: "valid" },
      { id: "10231-2", checkNumber: "552019", amount: 50000, dueDate: "2026-10-05", drawerName: "אלון מסחר בע״מ", status: "valid" },
    ],
  },
  {
    id: "10227", dealNumber: "#10227", createdAt: "2026-08-29", amount: 310000, checkCount: 7,
    status: "needs_completion", lastUpdated: "2026-09-01T09:10:00", currentStage: 1,
    requiredActions: ["יש להעלות צילום ברור עבור צ׳ק מספר 3."],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [
      { id: "10227-1", checkNumber: "310781", amount: 55000, dueDate: "2026-09-18", drawerName: "פסגה פתרונות בע״מ", status: "valid" },
      { id: "10227-2", checkNumber: "310782", amount: 48000, dueDate: "2026-09-30", drawerName: "פסגה פתרונות בע״מ", status: "valid" },
      { id: "10227-3", checkNumber: "921407", amount: 38000, dueDate: "2026-10-12", drawerName: "נגב תעשיות בע״מ", status: "needs_completion" },
      { id: "10227-4", checkNumber: "921408", amount: 42000, dueDate: "2026-10-26", drawerName: "נגב תעשיות בע״מ", status: "valid" },
      { id: "10227-5", checkNumber: "921409", amount: 40000, dueDate: "2026-11-10", drawerName: "נגב תעשיות בע״מ", status: "valid" },
      { id: "10227-6", checkNumber: "180045", amount: 45000, dueDate: "2026-11-25", drawerName: "אופק הנדסה בע״מ", status: "valid" },
      { id: "10227-7", checkNumber: "180046", amount: 42000, dueDate: "2026-12-10", drawerName: "אופק הנדסה בע״מ", status: "valid" },
    ],
  },
  {
    id: "10221", dealNumber: "#10221", createdAt: "2026-08-27", amount: 145000, checkCount: 3,
    status: "completed", lastUpdated: "2026-08-28T16:45:00", currentStage: 4, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [
      { id: "10221-1", checkNumber: "650120", amount: 45000, dueDate: "2026-08-15", drawerName: "מטרו אחזקות בע״מ", status: "paid" },
      { id: "10221-2", checkNumber: "650121", amount: 50000, dueDate: "2026-08-22", drawerName: "מטרו אחזקות בע״מ", status: "paid" },
      { id: "10221-3", checkNumber: "650122", amount: 50000, dueDate: "2026-08-28", drawerName: "מטרו אחזקות בע״מ", status: "paid" },
    ],
  },
  {
    id: "10218", dealNumber: "#10218", createdAt: "2026-08-25", amount: 76000, checkCount: 2,
    status: "rejected", lastUpdated: "2026-08-26T11:30:00", currentStage: 2, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [
      { id: "10218-1", checkNumber: "110932", amount: 38000, dueDate: "2026-09-10", drawerName: "ברק לוגיסטיקה בע״מ", status: "valid" },
      { id: "10218-2", checkNumber: "110933", amount: 38000, dueDate: "2026-09-25", drawerName: "ברק לוגיסטיקה בע״מ", status: "valid" },
    ],
  },
  {
    id: "10212", dealNumber: "#10212", createdAt: "2026-08-20", amount: 228000, checkCount: 5,
    status: "in_progress", lastUpdated: "2026-08-24T12:05:00", currentStage: 2, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [{ id: "10212-1", checkNumber: "440012", amount: 228000, dueDate: "2026-10-01", drawerName: "כרמל שיווק בע״מ", status: "valid" }],
  },
  {
    id: "10205", dealNumber: "#10205", createdAt: "2026-08-17", amount: 118000, checkCount: 3,
    status: "completed", lastUpdated: "2026-08-21T15:40:00", currentStage: 4, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [{ id: "10205-1", checkNumber: "730010", amount: 118000, dueDate: "2026-08-21", drawerName: "שקד מערכות בע״מ", status: "paid" }],
  },
  {
    id: "10198", dealNumber: "#10198", createdAt: "2026-08-12", amount: 265000, checkCount: 6,
    status: "approved", lastUpdated: "2026-08-18T10:15:00", currentStage: 3, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [{ id: "10198-1", checkNumber: "220019", amount: 265000, dueDate: "2026-10-15", drawerName: "עוגן פרויקטים בע״מ", status: "valid" }],
  },
  {
    id: "10191", dealNumber: "#10191", createdAt: "2026-08-08", amount: 84000, checkCount: 2,
    status: "needs_completion", lastUpdated: "2026-08-12T09:30:00", currentStage: 1,
    requiredActions: ["נדרש מסמך התאגדות עדכני לעסקה."], dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [{ id: "10191-1", checkNumber: "880091", amount: 84000, dueDate: "2026-09-28", drawerName: "אפיק קמעונאות בע״מ", status: "needs_completion" }],
  },
  {
    id: "10182", dealNumber: "#10182", createdAt: "2026-08-03", amount: 196000, checkCount: 4,
    status: "completed", lastUpdated: "2026-08-07T13:00:00", currentStage: 4, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [{ id: "10182-1", checkNumber: "910082", amount: 196000, dueDate: "2026-08-07", drawerName: "גפן שירותים בע״מ", status: "paid" }],
  },
  {
    id: "10174", dealNumber: "#10174", createdAt: "2026-07-28", amount: 134000, checkCount: 3,
    status: "rejected", lastUpdated: "2026-07-30T11:50:00", currentStage: 2, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [{ id: "10174-1", checkNumber: "770174", amount: 134000, dueDate: "2026-09-01", drawerName: "צור מסחר בע״מ", status: "valid" }],
  },
  {
    id: "10165", dealNumber: "#10165", createdAt: "2026-07-21", amount: 97000, checkCount: 2,
    status: "in_progress", lastUpdated: "2026-07-25T14:10:00", currentStage: 2, requiredActions: [],
    dealType: "ניכיון צ׳קים", financingOffice: office, contactName: contact,
    checks: [{ id: "10165-1", checkNumber: "320165", amount: 97000, dueDate: "2026-09-18", drawerName: "לב העיר בע״מ", status: "valid" }],
  },
];

export function getDeal(id: string) {
  return deals.find((deal) => deal.id === id);
}

export function formatCurrency(amount: number) {
  return `₪${amount.toLocaleString("en-US")}`;
}

export function formatDate(value: string) {
  return value.slice(0, 10).split("-").reverse().join("/");
}

export function formatDateTime(value: string) {
  return `${formatDate(value)} ${value.slice(11, 16)}`;
}
