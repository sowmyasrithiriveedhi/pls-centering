import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, PackagePlus, PackageCheck, Receipt, Users, Warehouse,
  Settings, ShieldCheck, LogOut, Search, Plus, X, CheckCircle2, AlertTriangle,
  MessageCircle, Printer, Download, Trash2, Crown, ArrowUpRight, ArrowDownLeft,
  RefreshCw, LockKeyhole, Building2, Clock3
} from "lucide-react";

/*
  PLS Centering Materials
  Single-file React application for Vite.
  Data is stored in this browser with localStorage. This is not a cloud database.
*/

const BRANCHES = ["Kisan Nagar", "Allipuram"];
const today = () => new Date().toISOString().slice(0, 10);
const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const INITIAL_CATALOG = [
  { id: "cat-1", nameTe: "కాలం బాక్సులు", rentMode: "DAILY_ONLY", subItems: [
    { id: "cb-1", label: '9" x 12" — 5 అడుగులు', dailyRate: 30, midRate: 25, monthlyRate: 0, stockKisan: 40, stockAllipuram: 35 },
    { id: "cb-2", label: '9" x 9" — 7 అడుగులు', dailyRate: 35, midRate: 30, monthlyRate: 0, stockKisan: 30, stockAllipuram: 25 },
    { id: "cb-3", label: '12" x 12" — 8 అడుగులు', dailyRate: 45, midRate: 38, monthlyRate: 0, stockKisan: 20, stockAllipuram: 20 },
  ]},
  { id: "cat-2", nameTe: "సైడ్ వాల్ షీట్లు", rentMode: "MONTHLY_ONLY", subItems: [
    { id: "sw-1", label: "2' x 8' — స్టాండర్డ్", dailyRate: 6, midRate: 4.5, monthlyRate: 90, stockKisan: 120, stockAllipuram: 100 },
    { id: "sw-2", label: "2' x 7' — స్టాండర్డ్", dailyRate: 5.5, midRate: 4, monthlyRate: 80, stockKisan: 150, stockAllipuram: 110 },
  ]},
  { id: "cat-3", nameTe: "స్లాబ్ షీట్లు (నెలవారీ)", rentMode: "MONTHLY_ONLY", subItems: [
    { id: "sl-1", label: "2' x 3' — స్లాబ్ షీట్ (₹50/నెల)", dailyRate: 8, midRate: 5, monthlyRate: 50, stockKisan: 500, stockAllipuram: 450 },
    { id: "sl-2", label: "3' x 3' — స్లాబ్ షీట్ (₹75/నెల)", dailyRate: 10, midRate: 7, monthlyRate: 75, stockKisan: 300, stockAllipuram: 250 },
  ]},
  { id: "cat-4", nameTe: "సెంట్రింగ్ / సైడ్ షీట్లు (రోజువారీ)", rentMode: "DAILY_ONLY", subItems: [
    { id: "cs-1", label: "2' x 3' — సైడ్ / సెంట్రింగ్ షీట్", dailyRate: 8, midRate: 5, monthlyRate: 50, stockKisan: 400, stockAllipuram: 350 },
    { id: "cs-2", label: "2' x 4' — సైడ్ / సెంట్రింగ్ షీట్", dailyRate: 10, midRate: 6.5, monthlyRate: 65, stockKisan: 200, stockAllipuram: 180 },
  ]},
  { id: "cat-5", nameTe: "జాకీలు", rentMode: "BOTH", subItems: [
    { id: "jk-1", label: "2 మీ - 3 మీ అడ్జస్టబుల్ జాకీ", dailyRate: 6, midRate: 4, monthlyRate: 60, stockKisan: 350, stockAllipuram: 300 },
    { id: "jk-2", label: "2 మీ - 3.5 మీ హెవీ జాకీ", dailyRate: 8, midRate: 5.5, monthlyRate: 80, stockKisan: 200, stockAllipuram: 150 },
  ]},
  { id: "cat-6", nameTe: "యాంకర్ స్పాన్లు", rentMode: "BOTH", subItems: [
    { id: "sp-1", label: "2 మీ - 3 మీ యాంకర్ స్పాన్", dailyRate: 10, midRate: 7, monthlyRate: 120, stockKisan: 220, stockAllipuram: 180 },
    { id: "sp-2", label: "2.5 మీ - 4 మీ లాంగ్ స్పాన్", dailyRate: 14, midRate: 9.5, monthlyRate: 150, stockKisan: 140, stockAllipuram: 120 },
  ]},
  { id: "cat-7", nameTe: "రాడ్ బెండింగ్ మెషిన్", rentMode: "DAILY_ONLY", isMachine: true, subItems: [
    { id: "rbm-1", label: "మెషిన్ నంబర్ 1 (కిసాన్ నగర్)", dailyRate: 350, midRate: 300, monthlyRate: 0, godown: "Kisan Nagar" },
    { id: "rbm-2", label: "మెషిన్ నంబర్ 2 (కిసాన్ నగర్)", dailyRate: 350, midRate: 300, monthlyRate: 0, godown: "Kisan Nagar" },
    { id: "rbm-3", label: "మెషిన్ నంబర్ 3 (అల్లిపురం)", dailyRate: 350, midRate: 300, monthlyRate: 0, godown: "Allipuram" },
    { id: "rbm-4", label: "మెషిన్ నంబర్ 4 (అల్లిపురం)", dailyRate: 350, midRate: 300, monthlyRate: 0, godown: "Allipuram" },
  ]},
  { id: "cat-8", nameTe: "యాంగిల్ షట్టర్లు", rentMode: "DAILY_ONLY", subItems: [
    { id: "ag-1", label: '2" x 2" — 8 అడుగుల యాంగిల్', dailyRate: 5, midRate: 3.5, monthlyRate: 0, stockKisan: 300, stockAllipuram: 260 },
    { id: "ag-2", label: '2.5" x 2.5" — 10 అడుగుల యాంగిల్', dailyRate: 7, midRate: 5, monthlyRate: 0, stockKisan: 180, stockAllipuram: 150 },
  ]},
];

const INITIAL_CUSTOMERS = [
  { id: "cust-1", godown: "Kisan Nagar", name: "వెంకటేశ్వరరావు (మేస్త్రి)", whatsapp: "9848012345", site: "బాలాజీ నగర్, నెల్లూరు", referenceName: "శ్రీనివాసులు గారు (హార్డ్‌వేర్ షాప్)", referencePhone: "9848099887", advance: 2000, isVip: false, createdAt: "2026-10-15" },
  { id: "cust-2", godown: "Kisan Nagar", name: "సురేష్ రెడ్డి (బిల్డర్)", whatsapp: "9440155667", site: "వేదాయపాలెం, నెల్లూరు", referenceName: "రమేష్ బాబు (కాంట్రాక్టర్)", referencePhone: "9440111223", advance: 5000, isVip: true, createdAt: "2026-11-01" },
  { id: "cust-3", godown: "Allipuram", name: "కృష్ణమూర్తి", whatsapp: "9989077665", site: "మగంట లేఅవుట్, నెల్లూరు", referenceName: "ప్రసాద్ గారు (కిసాన్ నగర్)", referencePhone: "9989044332", advance: 1500, isVip: false, createdAt: "2026-11-10" },
  { id: "cust-4", godown: "Allipuram", name: "మధుసూదన్ రావు (కాంట్రాక్టర్)", whatsapp: "9866033445", site: "అల్లిపురం మెయిన్ రోడ్, నెల్లూరు", referenceName: "సుబ్బారావు గారు (స్టీల్ ట్రేడర్స్)", referencePhone: "9866011229", advance: 3000, isVip: true, createdAt: "2026-11-02" },
];

const INITIAL_DISPATCHES = [
  { id: "disp-101", godown: "Kisan Nagar", customerId: "cust-1", deliveryDate: "2026-10-18", categoryId: "cat-3", subItemId: "sl-1", qtyIssued: 100, initialPlan: "MONTHLY", enteredBy: "స్టాఫ్ - కిసాన్ నగర్", status: "READY_TO_BILL", returnBatches: [
    { id: "ret-1", returnDate: "2026-11-02", qtyReturned: 60, isPartial: true, enteredBy: "స్టాఫ్ - కిసాన్ నగర్" },
    { id: "ret-2", returnDate: "2026-11-17", qtyReturned: 40, isPartial: false, enteredBy: "స్టాఫ్ - కిసాన్ నగర్" },
  ]},
  { id: "disp-102", godown: "Kisan Nagar", customerId: "cust-2", deliveryDate: "2026-11-10", categoryId: "cat-1", subItemId: "cb-1", qtyIssued: 12, initialPlan: "DAILY", enteredBy: "స్టాఫ్ - కిసాన్ నగర్", status: "ACTIVE", returnBatches: [] },
  { id: "disp-103", godown: "Allipuram", customerId: "cust-4", deliveryDate: "2026-11-05", categoryId: "cat-7", subItemId: "rbm-3", qtyIssued: 1, initialPlan: "DAILY", enteredBy: "స్టాఫ్ - అల్లిపురం", status: "ACTIVE", returnBatches: [] },
  { id: "disp-104", godown: "Allipuram", customerId: "cust-3", deliveryDate: "2026-11-13", categoryId: "cat-5", subItemId: "jk-1", qtyIssued: 50, initialPlan: "DAILY", enteredBy: "స్టాఫ్ - అల్లిపురం", status: "ACTIVE", returnBatches: [
    { id: "ret-104a", returnDate: "2026-11-16", qtyReturned: 47, isPartial: true, enteredBy: "స్టాఫ్ - అల్లిపురం" },
  ]},
];

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function dayCount(start, end) {
  if (!start || !end) return 0;
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return Math.max(0, Math.round((b - a) / 86400000));
}
function remaining(dispatch) {
  return Math.max(0, Number(dispatch.qtyIssued) - (dispatch.returnBatches || []).reduce((sum, batch) => sum + Number(batch.qtyReturned), 0));
}
function getDetails(catalog, categoryId, subItemId) {
  const category = catalog.find((item) => item.id === categoryId);
  const subItem = category?.subItems.find((item) => item.id === subItemId);
  return { category, subItem };
}
function App() {
  const [role, setRole] = useState("ADMIN");
  const [adminPin, setAdminPin] = useState(() => readStore("pls_admin_pin_v1", "1234"));
  const [showPin, setShowPin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [newPin, setNewPin] = useState("");
  const [branch, setBranch] = useState("Kisan Nagar");
  const [tab, setTab] = useState("DASHBOARD");
  const [catalog, setCatalog] = useState(() => readStore("pls_catalog_v1", INITIAL_CATALOG));
  const [customers, setCustomers] = useState(() => readStore("pls_customers_v1", INITIAL_CUSTOMERS));
  const [dispatches, setDispatches] = useState(() => readStore("pls_dispatches_v1", INITIAL_DISPATCHES));
  const [bills, setBills] = useState(() => readStore("pls_bills_v1", []));
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBillCustomer, setSelectedBillCustomer] = useState("");
  const [billPreview, setBillPreview] = useState(null);
  const [returnTarget, setReturnTarget] = useState(null);
  const [returnDate, setReturnDate] = useState(today());
  const [returnQty, setReturnQty] = useState("");
  const [damageFee, setDamageFee] = useState("0");
  const [damageNote, setDamageNote] = useState("");
  const [planOverrides, setPlanOverrides] = useState({});
  const [rateOverrides, setRateOverrides] = useState({});
  const [customerForm, setCustomerForm] = useState({ name: "", whatsapp: "", site: "", referenceName: "", referencePhone: "", advance: "0", isVip: false });
  const [dispatchForm, setDispatchForm] = useState({ customerId: "", deliveryDate: today(), categoryId: "cat-1", subItemId: "cb-1", qtyIssued: "1", initialPlan: "DAILY" });

  useEffect(() => {
    localStorage.setItem("pls_catalog_v1", JSON.stringify(catalog));
    localStorage.setItem("pls_customers_v1", JSON.stringify(customers));
    localStorage.setItem("pls_dispatches_v1", JSON.stringify(dispatches));
    localStorage.setItem("pls_bills_v1", JSON.stringify(bills));
    localStorage.setItem("pls_admin_pin_v1", adminPin);
  }, [catalog, customers, dispatches, bills, adminPin]);

  const isAdmin = role === "ADMIN";
  const currentBranch = isAdmin ? branch : role === "STAFF_ALLIPURAM" ? "Allipuram" : "Kisan Nagar";
  const staffLabel = isAdmin ? `అడ్మిన్ (${currentBranch === "Kisan Nagar" ? "కిసాన్ నగర్" : "అల్లిపురం"})` : currentBranch === "Allipuram" ? "స్టాఫ్ - అల్లిపురం" : "స్టాఫ్ - కిసాన్ నగర్";
  const branchCustomers = customers.filter((customer) => customer.godown === currentBranch);
  const branchDispatches = dispatches.filter((dispatch) => dispatch.godown === currentBranch);
  const branchBills = bills.filter((bill) => bill.godown === currentBranch);

  const machineBusy = useMemo(() => {
    const busy = new Set();
    dispatches.forEach((dispatch) => {
      if (dispatch.categoryId === "cat-7" && dispatch.status !== "BILLED" && remaining(dispatch) > 0) busy.add(dispatch.subItemId);
    });
    return busy;
  }, [dispatches]);

  const metrics = useMemo(() => {
    const active = branchDispatches.filter((item) => item.status !== "BILLED");
    const small = active.filter((item) => remaining(item) > 0 && remaining(item) <= 5);
    const overdue = active.filter((item) => remaining(item) > 0 && dayCount(item.deliveryDate, today()) >= 30);
    const ready = active.filter((item) => remaining(item) === 0).length;
    const totalOut = active.reduce((sum, item) => sum + remaining(item), 0);
    const stock = catalog.filter((category) => !category.isMachine).reduce((sum, category) =>
      sum + category.subItems.reduce((subSum, sub) => subSum + Number(currentBranch === "Kisan Nagar" ? sub.stockKisan : sub.stockAllipuram), 0), 0);
    const machines = catalog.find((category) => category.id === "cat-7")?.subItems.filter((item) => item.godown === currentBranch) || [];
    const freeMachines = machines.filter((item) => !machineBusy.has(item.id)).length;
    const vip = customers.filter((customer) => customer.isVip).map((customer) => {
      const customerItems = dispatches.filter((item) => item.customerId === customer.id && item.status !== "BILLED");
      const pendingByBranch = (name) => customerItems.filter((item) => item.godown === name).reduce((sum, item) => sum + remaining(item), 0);
      return { ...customer, entries: customerItems.length, kisanPending: pendingByBranch("Kisan Nagar"), allipuramPending: pendingByBranch("Allipuram") };
    });
    return { small, overdue, ready, totalOut, stock, freeMachines, machineCount: machines.length, vip };
  }, [branchDispatches, catalog, currentBranch, machineBusy, customers, dispatches]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const selectedCategory = catalog.find((item) => item.id === dispatchForm.categoryId) || catalog[0];
  const availableSubItems = (selectedCategory?.subItems || []).filter((item) =>
    selectedCategory.isMachine ? item.godown === currentBranch && !machineBusy.has(item.id) : true
  );

  function updateDispatchCategory(categoryId) {
    const category = catalog.find((item) => item.id === categoryId);
    const first = category?.subItems.find((item) => category.isMachine ? item.godown === currentBranch && !machineBusy.has(item.id) : true);
    setDispatchForm((old) => ({ ...old, categoryId, subItemId: first?.id || "" }));
  }

  function addCustomer(event) {
    event.preventDefault();
    if (!customerForm.name.trim()) return showToast("కస్టమర్ పేరు నమోదు చేయండి.");
    if (!/^\d{10}$/.test(customerForm.whatsapp.trim())) return showToast("10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.");
    if (!customerForm.referenceName.trim()) return showToast("రిఫరెన్స్ పర్సన్ పేరు తప్పనిసరి.");
    const item = {
      id: `cust-${Date.now()}`, godown: currentBranch, name: customerForm.name.trim(),
      whatsapp: customerForm.whatsapp.trim(), site: customerForm.site.trim() || "నెల్లూరు",
      referenceName: customerForm.referenceName.trim(), referencePhone: customerForm.referencePhone.trim(),
      advance: Number(customerForm.advance) || 0, isVip: customerForm.isVip, createdAt: today(),
    };
    setCustomers((old) => [item, ...old]);
    setCustomerForm({ name: "", whatsapp: "", site: "", referenceName: "", referencePhone: "", advance: "0", isVip: false });
    showToast("కొత్త కస్టమర్ సేవ్ అయ్యారు.");
  }

  function addDispatch(event) {
    event.preventDefault();
    const customer = customers.find((item) => item.id === dispatchForm.customerId && item.godown === currentBranch);
    const category = catalog.find((item) => item.id === dispatchForm.categoryId);
    const sub = category?.subItems.find((item) => item.id === dispatchForm.subItemId);
    const qty = Number(dispatchForm.qtyIssued);
    if (!customer) return showToast("ముందుగా ఈ గోడౌన్ కస్టమర్‌ను ఎంచుకోండి.");
    if (!sub || !Number.isInteger(qty) || qty < 1) return showToast("సరైన మెటీరియల్ మరియు సంఖ్య ఎంచుకోండి.");
    if (category.isMachine && (sub.godown !== currentBranch || machineBusy.has(sub.id))) return showToast("ఈ మెషిన్ ప్రస్తుతం అందుబాటులో లేదు.");
    if (!category.isMachine) {
      const key = currentBranch === "Kisan Nagar" ? "stockKisan" : "stockAllipuram";
      const available = Number(sub[key]) || 0;
      if (qty > available) return showToast(`స్టాక్ సరిపోదు. అందుబాటులో ఉన్నవి: ${available}`);
      setCatalog((old) => old.map((cat) => cat.id !== category.id ? cat : {
        ...cat, subItems: cat.subItems.map((item) => item.id !== sub.id ? item : { ...item, [key]: available - qty }),
      }));
    }
    const staff = currentBranch === "Kisan Nagar" ? "స్టాఫ్ - కిసాన్ నగర్" : "స్టాఫ్ - అల్లిపురం";
    setDispatches((old) => [{
      id: `disp-${Date.now()}`, godown: currentBranch, customerId: customer.id,
      deliveryDate: dispatchForm.deliveryDate, categoryId: category.id, subItemId: sub.id,
      qtyIssued: qty, initialPlan: dispatchForm.initialPlan, enteredBy: staff,
      status: "ACTIVE", returnBatches: [],
    }, ...old]);
    setDispatchForm((old) => ({ ...old, qtyIssued: "1" }));
    showToast("మెటీరియల్ అవుట్ ఎంట్రీ సేవ్ అయింది.");
    setTab("DISPATCH");
  }

  function saveReturn(event) {
    event.preventDefault();
    if (!returnTarget) return;
    const qty = Number(returnQty);
    const pending = remaining(returnTarget);
    if (!Number.isInteger(qty) || qty < 1 || qty > pending) return showToast(`1 నుండి ${pending} లోపు సంఖ్య నమోదు చేయండి.`);
    const staff = currentBranch === "Kisan Nagar" ? "స్టాఫ్ - కిసాన్ నగర్" : "స్టాఫ్ - అల్లిపురం";
    const batch = { id: `ret-${Date.now()}`, returnDate, qtyReturned: qty, isPartial: qty < pending, enteredBy: staff };
    setDispatches((old) => old.map((item) => item.id !== returnTarget.id ? item : {
      ...item, returnBatches: [...item.returnBatches, batch],
      status: qty === pending ? "READY_TO_BILL" : "ACTIVE",
    }));
    const { category, subItem } = getDetails(catalog, returnTarget.categoryId, returnTarget.subItemId);
    if (!category?.isMachine && subItem) {
      const key = currentBranch === "Kisan Nagar" ? "stockKisan" : "stockAllipuram";
      setCatalog((old) => old.map((cat) => cat.id !== category.id ? cat : {
        ...cat, subItems: cat.subItems.map((item) => item.id !== subItem.id ? item : { ...item, [key]: (Number(item[key]) || 0) + qty }),
      }));
    }
    setReturnTarget(null); setReturnQty(""); showToast("రిటర్న్ ఎంట్రీ సేవ్ అయింది.");
  }

  const getBillLines = (customerId) => {
    const billCustomer = customers.find((item) => item.id === customerId);
    // VIP accounts combine matching customer entries from both branches.
    const customerItems = (billCustomer?.isVip
      ? dispatches.filter((item) =>
          (item.customerId === customerId ||
            customers.find((customer) => customer.id === item.customerId)?.name === billCustomer.name) &&
          item.status !== "BILLED")
      : branchDispatches.filter((item) => item.customerId === customerId && item.status !== "BILLED"));
    const lines = [];
    customerItems.forEach((dispatch) => {
      const { category, subItem } = getDetails(catalog, dispatch.categoryId, dispatch.subItemId);
      if (!category || !subItem) return;
      let cursor = dispatch.deliveryDate;
      const batches = [...dispatch.returnBatches];
      const pending = remaining(dispatch);
      if (pending > 0) batches.push({ id: `pending-${dispatch.id}`, returnDate: today(), qtyReturned: pending, isPartial: false, simulated: true });
      batches.forEach((batch) => {
        const endDate = batch.returnDate;
        const days = Math.max(1, dayCount(cursor, endDate));
        const isPartial = Boolean(batch.isPartial);
        const plan = planOverrides[dispatch.id] || dispatch.initialPlan;
        let defaultRate = Number(subItem.dailyRate) || 0;
        let ruleLabel = "రోజువారీ రేట్ (Daily Rate)";
        if (isPartial) {
          defaultRate = Number(subItem.midRate) || Number(subItem.dailyRate) || 0;
          ruleLabel = "పార్షియల్ రిటర్న్ మధ్యస్థ రేట్ (Mid-Tier Rate)";
        } else if (plan === "MONTHLY" && Number(subItem.monthlyRate) > 0) {
          if (days >= 20) {
            defaultRate = Number((Number(subItem.monthlyRate) / 30).toFixed(2));
            ruleLabel = `నెలవారీ ప్రో-రేటా (₹${subItem.monthlyRate}/30 = ₹${defaultRate}/రోజు)`;
          } else {
            ruleLabel = "20 రోజుల లోపు కాబట్టి రోజువారీ రేట్";
          }
        }
        const effectiveRate = rateOverrides[batch.id] !== undefined && rateOverrides[batch.id] !== ""
          ? Number(rateOverrides[batch.id]) : defaultRate;
        const subtotal = Math.round(Number(batch.qtyReturned) * days * effectiveRate);
        const label = `${days} రోజులు × ${money(effectiveRate)} × ${batch.qtyReturned}`;
        lines.push({
          id: batch.id, dispatchId: dispatch.id, itemName: `${category.nameTe} — ${subItem.label}`,
          qty: batch.qtyReturned, days, deliveryDate: cursor, returnDate: endDate,
          isPartial, simulated: Boolean(batch.simulated), plan, rate: effectiveRate, ruleLabel, subtotal, label,
        });
        cursor = endDate;
      });
    });
    return lines;
  };

  const activeBillCustomer = customers.find((item) => item.id === selectedBillCustomer);
  const billLines = selectedBillCustomer ? getBillLines(selectedBillCustomer) : [];
  const rentTotal = billLines.reduce((sum, line) => sum + line.subtotal, 0);
  const netTotal = rentTotal + (Number(damageFee) || 0) - (Number(activeBillCustomer?.advance) || 0);

  function finalizeBill() {
    if (!activeBillCustomer || billLines.length === 0) return showToast("బిల్ చేయడానికి పెండింగ్ ఎంట్రీలు లేవు.");
    const bill = {
      id: `bill-${Date.now()}`, billNo: `PLS-${Date.now().toString().slice(-6)}`,
      date: today(), godown: currentBranch, customer: { ...activeBillCustomer },
      lines: billLines.map((line) => ({ ...line })), rentTotal,
      damageFee: Number(damageFee) || 0, damageNote, advancePaid: Number(activeBillCustomer.advance) || 0,
      netPayable: Math.max(0, netTotal), finalizedBy: staffLabel,
    };
    const billedIds = new Set(billLines.map((line) => line.dispatchId));
    setDispatches((old) => old.map((item) => billedIds.has(item.id) ? { ...item, status: "BILLED" } : item));
    setBills((old) => [bill, ...old]);
    setBillPreview(bill);
    setDamageFee("0"); setDamageNote("");
    showToast("బిల్ ఫైనల్ అయింది.");
  }

  function billText(bill) {
    const rows = bill.lines.map((line, index) =>
      `${index + 1}. ${line.itemName}\nసంఖ్య: ${line.qty} | ${line.days} రోజులు\n${money(line.subtotal)}`
    ).join("\n");
    return `*PLS CENTERING MATERIALS*\n${bill.godown === "Allipuram" ? "అల్లిపురం" : "కిసాన్ నగర్"} గోడౌన్, నెల్లూరు\nబిల్: ${bill.billNo} | తేదీ: ${bill.date}\nకస్టమర్: ${bill.customer.name}\nసైట్: ${bill.customer.site}\n--------------------------\n${rows}\n--------------------------\nమొత్తం బాడుగ: ${money(bill.rentTotal)}\nడ్యామేజ్: ${money(bill.damageFee)}\nఅడ్వాన్స్: -${money(bill.advancePaid)}\n*నికర మొత్తం: ${money(bill.netPayable)}*\nధన్యవాదాలు!`;
  }

  function downloadBackup() {
    const data = { exportedAt: new Date().toISOString(), catalog, customers, dispatches, bills };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `PLS-Centering-Backup-${today()}.json`; anchor.click();
    URL.revokeObjectURL(url);
  }

  function updateRate(categoryId, subItemId, field, value) {
    if (!isAdmin) return;
    setCatalog((old) => old.map((category) => category.id !== categoryId ? category : {
      ...category, subItems: category.subItems.map((sub) => sub.id !== subItemId ? sub : { ...sub, [field]: Math.max(0, Number(value) || 0) }),
    }));
  }

  function requestAdmin() {
    if (isAdmin) return;
    setPinInput(""); setPinError(""); setShowPin(true);
  }
  function verifyAdmin(event) {
    event.preventDefault();
    if (pinInput === adminPin) { setRole("ADMIN"); setShowPin(false); setPinInput(""); setPinError(""); showToast("అడ్మిన్ లాగిన్ విజయవంతమైంది."); }
    else setPinError("తప్పు PIN. మళ్లీ ప్రయత్నించండి.");
  }

  const nav = [
    ["DASHBOARD", "డ్యాష్‌బోర్డ్", LayoutDashboard],
    ["DISPATCH", "మెటీరియల్ అవుట్", ArrowUpRight],
    ["RETURN", "రిటర్న్ ఎంట్రీ", ArrowDownLeft],
    ["BILLING", "బిల్ ఫైనల్", Receipt],
    ["CUSTOMERS", "కస్టమర్లు", Users],
    ["INVENTORY", "స్టాక్ & మెషిన్లు", Warehouse],
    ...(isAdmin ? [["RATES", "రేట్లు సెట్టింగ్స్", Settings]] : []),
  ];

  const filteredCustomers = branchCustomers.filter((customer) =>
    [customer.name, customer.whatsapp, customer.site, customer.referenceName].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const styles = `
    *{box-sizing:border-box} body{margin:0;background:#f1f5f9;color:#0f172a;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
    button,input,select,textarea{font:inherit} button{cursor:pointer}
    .app{min-height:100vh}.topbar{background:#0b1f3a;color:white;padding:18px 22px;display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap}
    .brand{display:flex;gap:12px;align-items:center}.brandmark{width:46px;height:46px;border-radius:12px;background:#38bdf8;color:#082f49;display:grid;place-items:center;font-weight:950;font-size:19px}
    .muted{color:#64748b}.topbar .muted{color:#cbd5e1}.top-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .branch-btn,.role-btn{border:1px solid #475569;background:#172b45;color:#e2e8f0;padding:8px 11px;border-radius:9px;font-size:13px;font-weight:700}
    .branch-btn.active{background:#38bdf8;color:#082f49;border-color:#38bdf8}.role-btn.active{background:#fbbf24;color:#422006;border-color:#fbbf24}
    .nav{display:flex;gap:7px;padding:12px 18px;background:#102944;overflow:auto}.nav button{display:flex;align-items:center;gap:7px;white-space:nowrap;border:0;border-radius:9px;padding:10px 13px;background:#1e3a56;color:#e2e8f0;font-weight:750;font-size:13px}.nav button.active{background:#38bdf8;color:#082f49}
    .main{max-width:1440px;margin:auto;padding:22px}.pagehead{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:18px}.pagehead h2{margin:0 0 5px;font-size:23px}.pagehead p{margin:0;color:#64748b;font-size:14px}
    .grid{display:grid;gap:14px}.stats{grid-template-columns:repeat(auto-fit,minmax(190px,1fr))}.two{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
    .card{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:17px;box-shadow:0 2px 8px #0f172a08}.stat{color:white;min-height:120px;display:flex;flex-direction:column;justify-content:space-between}.stat strong{font-size:29px}.stat span{font-size:13px;font-weight:750}.stat small{opacity:.85}
    .blue{background:#0369a1}.teal{background:#0f766e}.amber{background:#d97706}.rose{background:#be123c}.indigo{background:#4338ca}.gold{background:#d4a017;color:#1f2937}
    .section-title{font-size:16px;font-weight:850;margin:0 0 13px}.row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.between{justify-content:space-between}.field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;min-width:0}.field label{font-size:13px;font-weight:750;color:#334155}.field input,.field select,.field textarea,.search{width:100%;border:1px solid #cbd5e1;border-radius:9px;padding:10px 11px;background:white;color:#0f172a;outline:none}.field input:focus,.field select:focus,.field textarea:focus,.search:focus{border-color:#0284c7;box-shadow:0 0 0 3px #0ea5e922}
    .formgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:0 12px}.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:0;border-radius:9px;padding:10px 14px;font-weight:800;font-size:13px}.primary{background:#0369a1;color:white}.dark{background:#0f172a;color:white}.success{background:#047857;color:white}.warning{background:#f59e0b;color:#422006}.danger{background:#be123c;color:white}.light{background:#e2e8f0;color:#0f172a}.outline{background:white;color:#334155;border:1px solid #cbd5e1}
    .tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:11px 10px;border-bottom:1px solid #e2e8f0;vertical-align:top}th{background:#f8fafc;color:#475569;font-weight:850;white-space:nowrap}
    .pill{display:inline-flex;padding:4px 8px;border-radius:999px;background:#e0f2fe;color:#075985;font-size:11px;font-weight:850}.pill.green{background:#dcfce7;color:#166534}.pill.red{background:#ffe4e6;color:#9f1239}.pill.goldpill{background:#fef3c7;color:#92400e}
    .item{padding:12px;border:1px solid #e2e8f0;border-radius:11px;margin-top:9px}.item h4{margin:0 0 5px}.item p{margin:4px 0;font-size:13px;color:#64748b}.notice{padding:11px 13px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;color:#1e40af;font-size:13px;margin-bottom:13px}
    .toast{position:fixed;right:20px;bottom:20px;background:#0f172a;color:white;padding:13px 17px;border-radius:10px;box-shadow:0 8px 30px #0003;z-index:20;max-width:min(90vw,420px)}
    .modalback{position:fixed;inset:0;background:#0f172a99;display:grid;place-items:center;padding:16px;z-index:30}.modal{width:min(620px,100%);max-height:90vh;overflow:auto;background:white;border-radius:16px;padding:20px}
    .bill{border:1px dashed #94a3b8;padding:18px;border-radius:10px;background:#fff}.bill h3{text-align:center;margin:0}.bill p{margin:5px 0;font-size:13px}
    .empty{padding:25px;text-align:center;color:#64748b}.right{text-align:right}.vip{color:#a16207}.small{font-size:12px}
    @media(max-width:650px){.main{padding:13px}.topbar{padding:14px}.nav{padding:9px}.nav button{padding:9px;font-size:12px}.pagehead h2{font-size:20px}}
    @media print{body{background:white}.topbar,.nav,.no-print,.toast{display:none!important}.main{padding:0;max-width:none}.modalback{position:static;background:white;padding:0}.modal{width:100%;max-height:none;box-shadow:none;padding:0}.bill{border:0}}
  `;

  return (
    <div className="app">
      <style>{styles}</style>
      <header className="topbar">
        <div className="brand">
          <div className="brandmark">PLS</div>
          <div><div style={{fontSize:19,fontWeight:950}}>PLS సెంట్రింగ్ మెటీరియల్స్</div><div className="muted small">నెల్లూరు • {currentBranch === "Kisan Nagar" ? "కిసాన్ నగర్" : "అల్లిపురం"} గోడౌన్ • ఆటో-సేవ్</div></div>
        </div>
        <div className="top-actions">
          {isAdmin && BRANCHES.map((name) => <button key={name} className={`branch-btn ${branch===name?"active":""}`} onClick={() => setBranch(name)}>{name === "Kisan Nagar" ? "కిసాన్ నగర్" : "అల్లిపురం"}</button>)}
          <button className={`role-btn ${role==="STAFF_KISAN"?"active":""}`} onClick={() => setRole("STAFF_KISAN")}>స్టాఫ్: కిసాన్ నగర్</button>
          <button className={`role-btn ${role==="STAFF_ALLIPURAM"?"active":""}`} onClick={() => setRole("STAFF_ALLIPURAM")}>స్టాఫ్: అల్లిపురం</button>
          {isAdmin ? <button className="role-btn" onClick={() => setRole("STAFF_KISAN")}><LogOut size={14}/> స్టాఫ్ మోడ్</button> : <button className="role-btn" onClick={requestAdmin}><LockKeyhole size={14}/> అడ్మిన్</button>}
        </div>
      </header>

      <nav className="nav">
        {nav.map(([id,label,Icon]) => <button key={id} className={tab===id?"active":""} onClick={() => setTab(id)}><Icon size={16}/>{label}</button>)}
      </nav>

      <main className="main">
        {tab === "DASHBOARD" && <>
          <div className="pagehead"><div><h2>డ్యాష్‌బోర్డ్</h2><p>గోడౌన్ యొక్క రోజువారీ స్థితి మరియు ముఖ్యమైన వివరాలు</p></div><button className="btn outline no-print" onClick={downloadBackup}><Download size={15}/> బ్యాకప్ డౌన్‌లోడ్</button></div>
          {isAdmin && <div className="grid two" style={{marginBottom:14}}>{BRANCHES.map((name) => <button key={name} className={`card ${branch===name?"primary":""}`} style={{textAlign:"left",cursor:"pointer",color:branch===name?"white":"#0f172a"}} onClick={() => setBranch(name)}><b>{name==="Kisan Nagar"?"కిసాన్ నగర్ గోడౌన్":"అల్లిపురం గోడౌన్"}</b><div className="small" style={{marginTop:5}}>పూర్తి గోడౌన్ లెక్కలు చూడండి</div></button>)}</div>}
          <div className="grid stats">
            <div className="card stat gold"><span><Crown size={15} style={{verticalAlign:"middle"}}/> VIP కస్టమర్లు (రెండు గోడౌన్లు)</span><strong>{metrics.vip.length}</strong><small>VIP ఖాతాలు</small></div>
            <div className="card stat amber"><span>1–5 సంఖ్య బ్యాలెన్స్</span><strong>{metrics.small.length}</strong><small>చిన్న బ్యాలెన్స్ ఉన్న ఎంట్రీలు</small></div>
            <div className="card stat rose"><span>30+ రోజులు పెండింగ్</span><strong>{metrics.overdue.length}</strong><small>గడువు దాటిన ఎంట్రీలు</small></div>
            <div className="card stat teal"><span>గోడౌన్‌లో అందుబాటులో ఉన్న స్టాక్</span><strong>{metrics.stock}</strong><small>మెషిన్లు: {metrics.freeMachines}/{metrics.machineCount} రెడీ</small></div>
            <div className="card stat indigo"><span>బిల్‌కు సిద్ధం</span><strong>{metrics.ready}</strong><small>సైట్‌లో ఉన్న మొత్తం: {metrics.totalOut}</small></div>
          </div>
          <div className="grid two" style={{marginTop:15}}>
            <section className="card"><h3 className="section-title">VIP కస్టమర్లు — రెండు గోడౌన్లు</h3>{metrics.vip.length===0?<div className="empty">VIP కస్టమర్లు లేరు.</div>:metrics.vip.map((customer)=><div className="item" key={customer.id}><div className="row between"><b className="vip">★ {customer.name}</b><span className="pill goldpill">VIP</span></div><p>{customer.site} • {customer.whatsapp}</p><p>కిసాన్ నగర్: {customer.kisanPending} | అల్లిపురం: {customer.allipuramPending}</p><p>అడ్వాన్స్: {money(customer.advance)} • ఎంట్రీలు: {customer.entries}</p></div>)}</section>
            <section className="card"><h3 className="section-title">చిన్న బ్యాలెన్స్ / పాత ఎంట్రీలు</h3>{[...metrics.small,...metrics.overdue].filter((item,index,array)=>array.findIndex(x=>x.id===item.id)===index).slice(0,8).map((item)=><div className="item" key={item.id}><b>{customers.find(c=>c.id===item.customerId)?.name || "కస్టమర్"}</b><p>డెలివరీ: {item.deliveryDate} • బ్యాలెన్స్: {remaining(item)}</p></div>)}{metrics.small.length+metrics.overdue.length===0&&<div className="empty">పెండింగ్ అలర్ట్స్ లేవు.</div>}</section>
          </div>
        </>}

        {tab === "DISPATCH" && <>
          <div className="pagehead"><div><h2>మెటీరియల్ అవుట్</h2><p>కస్టమర్‌కు గోడౌన్ నుండి ఇచ్చిన మెటీరియల్ నమోదు చేయండి</p></div></div>
          <section className="card" style={{marginBottom:15}}><h3 className="section-title">కొత్త డెలివరీ ఎంట్రీ</h3>
            <form onSubmit={addDispatch}><div className="formgrid">
              <div className="field"><label>కస్టమర్ *</label><select required value={dispatchForm.customerId} onChange={e=>setDispatchForm({...dispatchForm,customerId:e.target.value})}><option value="">కస్టమర్ ఎంచుకోండి</option>{branchCustomers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="field"><label>డెలివరీ తేదీ *</label><input type="date" required value={dispatchForm.deliveryDate} onChange={e=>setDispatchForm({...dispatchForm,deliveryDate:e.target.value})}/></div>
              <div className="field"><label>కేటగిరీ *</label><select value={dispatchForm.categoryId} onChange={e=>updateDispatchCategory(e.target.value)}>{catalog.map(c=><option key={c.id} value={c.id}>{c.nameTe}</option>)}</select></div>
              <div className="field"><label>సైజు / మెషిన్ *</label><select required value={dispatchForm.subItemId} onChange={e=>setDispatchForm({...dispatchForm,subItemId:e.target.value})}>{availableSubItems.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
              <div className="field"><label>సంఖ్య *</label><input type="number" min="1" step="1" required value={dispatchForm.qtyIssued} onChange={e=>setDispatchForm({...dispatchForm,qtyIssued:e.target.value})}/></div>
              <div className="field"><label>బాడుగ ప్లాన్</label><select value={dispatchForm.initialPlan} onChange={e=>setDispatchForm({...dispatchForm,initialPlan:e.target.value})}><option value="DAILY">రోజువారీ</option><option value="MONTHLY">నెలవారీ</option></select></div>
            </div><button className="btn primary" type="submit"><PackagePlus size={16}/> మెటీరియల్ అవుట్ సేవ్</button></form>
          </section>
          <section className="card"><h3 className="section-title">డెలివరీల జాబితా</h3><div className="tablewrap"><table><thead><tr><th>కస్టమర్</th><th>మెటీరియల్</th><th>తేదీ</th><th>ఇచ్చినవి</th><th>వచ్చినవి</th><th>బ్యాలెన్స్</th><th>స్థితి</th>{isAdmin&&<th>చర్య</th>}</tr></thead><tbody>
            {branchDispatches.map(d=>{const c=customers.find(x=>x.id===d.customerId);const {category,subItem}=getDetails(catalog,d.categoryId,d.subItemId);const returned=d.qtyIssued-remaining(d);return <tr key={d.id}><td><b>{c?.name}</b><div className="small muted">{c?.site}</div></td><td>{category?.nameTe}<div className="small muted">{subItem?.label}</div></td><td>{d.deliveryDate}</td><td>{d.qtyIssued}</td><td>{returned}</td><td><b>{remaining(d)}</b></td><td><span className={`pill ${d.status==="BILLED"?"green":remaining(d)===0?"goldpill":""}`}>{d.status==="BILLED"?"బిల్ పూర్తయింది":remaining(d)===0?"బిల్ రెడీ":"సైట్‌లో ఉంది"}</span></td>{isAdmin&&<td><button className="btn danger" onClick={()=>{if(window.confirm("ఈ డెలివరీ ఎంట్రీని తొలగించాలా?")){setDispatches(old=>old.filter(x=>x.id!==d.id));showToast("ఎంట్రీ తొలగించబడింది.")}}}><Trash2 size={14}/></button></td>}</tr>})}
          </tbody></table>{branchDispatches.length===0&&<div className="empty">డెలివరీ ఎంట్రీలు లేవు.</div>}</div></section>
        </>}

        {tab === "RETURN" && <>
          <div className="pagehead"><div><h2>మెటీరియల్ ఇన్ / రిటర్న్</h2><p>సైట్ నుండి వచ్చిన సామాన్లను విడతల వారీగా నమోదు చేయండి</p></div></div>
          <div className="grid two">{branchDispatches.filter(d=>d.status!=="BILLED").map(d=>{const c=customers.find(x=>x.id===d.customerId);const {category,subItem}=getDetails(catalog,d.categoryId,d.subItemId);const returned=d.qtyIssued-remaining(d);return <div className="card" key={d.id}><div className="row between"><span className="pill">{d.deliveryDate}</span><span className="pill green">బ్యాలెన్స్: {remaining(d)}</span></div><h3 style={{marginBottom:4}}>{c?.name}</h3><p className="muted small">{category?.nameTe} — {subItem?.label}</p><div className="row" style={{gap:18,margin:"12px 0"}}><div><div className="small muted">ఇచ్చినవి</div><b>{d.qtyIssued}</b></div><div><div className="small muted">వచ్చినవి</div><b>{returned}</b></div><div><div className="small muted">బ్యాలెన్స్</div><b>{remaining(d)}</b></div></div>{d.returnBatches.map((batch,index)=><p className="small muted" key={batch.id}>బ్యాచ్ {index+1}: {batch.qtyReturned} • {batch.returnDate} {batch.isPartial?"(పార్షియల్)":"(ఫైనల్)"}</p>)}{remaining(d)>0?<button className="btn success" onClick={()=>{setReturnTarget(d);setReturnQty(String(remaining(d)));setReturnDate(today())}}><PackageCheck size={15}/> రిటర్న్ నమోదు</button>:<span className="pill goldpill">అన్నీ వచ్చాయి — బిల్ చేయండి</span>}</div>})}</div>
        </>}

        {tab === "BILLING" && <>
          <div className="pagehead"><div><h2>బిల్ తయారీ & ఫైనల్ సెటిల్‌మెంట్</h2><p>రిటర్న్ బ్యాచ్‌లు మరియు బాడుగ రేట్ల ఆధారంగా బిల్ తయారు చేయండి</p></div></div>
          <section className="card" style={{marginBottom:15}}><div className="field"><label>బిల్ వేయవలసిన కస్టమర్</label><select value={selectedBillCustomer} onChange={e=>setSelectedBillCustomer(e.target.value)}><option value="">కస్టమర్ ఎంచుకోండి</option>{branchCustomers.map(c=><option key={c.id} value={c.id}>{c.isVip?"★ ":""}{c.name}</option>)}</select></div>
            {activeBillCustomer&&<div className="notice">కస్టమర్: <b>{activeBillCustomer.name}</b> • WhatsApp: {activeBillCustomer.whatsapp} • అడ్వాన్స్: {money(activeBillCustomer.advance)}</div>}
            {!selectedBillCustomer?<div className="empty">ముందుగా కస్టమర్ ఎంచుకోండి.</div>:billLines.length===0?<div className="empty">ఈ కస్టమర్‌కు పెండింగ్ బిల్ ఐటమ్స్ లేవు.</div>:<>
              <div className="tablewrap"><table><thead><tr><th>మెటీరియల్</th><th>తేదీలు</th><th>రోజులు</th><th>ప్లాన్ / రూల్</th><th>సంఖ్య</th><th>రేట్ / లెక్క</th><th>మొత్తం</th></tr></thead><tbody>{billLines.map(line=><tr key={line.id}><td>{line.itemName}{line.isPartial&&<div className="pill goldpill">పార్షియల్ రిటర్న్</div>}{line.simulated&&<div className="pill red">ఇంకా సైట్‌లో ఉంది (ఈ రోజు వరకు)</div>}</td><td>{line.deliveryDate}<br/>→ {line.returnDate}</td><td>{line.days}</td><td>{line.isPartial ? <><span className="pill goldpill">పార్షియల్ — మధ్యస్థ రేట్</span></> : <select value={planOverrides[line.dispatchId] || line.plan} onChange={e=>setPlanOverrides(old=>({...old,[line.dispatchId]:e.target.value}))}><option value="DAILY">రోజువారీ</option><option value="MONTHLY">నెలవారీ</option></select>}<div className="small muted">{line.ruleLabel}</div></td><td>{line.qty}</td><td><input aria-label="రోజువారీ రేట్" type="number" min="0" step="0.01" style={{width:90,padding:6,border:"1px solid #cbd5e1",borderRadius:7}} value={rateOverrides[line.id] ?? line.rate} onChange={e=>setRateOverrides(old=>({...old,[line.id]:e.target.value}))}/><div className="small muted">{line.label}</div></td><td><b>{money(line.subtotal)}</b></td></tr>)}</tbody></table></div>
              <div className="grid two" style={{marginTop:15}}><div className="field"><label>డ్యామేజ్ / మిస్సింగ్ చార్జీలు (₹)</label><input type="number" min="0" value={damageFee} onChange={e=>setDamageFee(e.target.value)}/><label>వివరాలు</label><input value={damageNote} onChange={e=>setDamageNote(e.target.value)} placeholder="ఏ వస్తువు మిస్సింగ్ / డ్యామేజ్?"/></div><div className="card" style={{background:"#f8fafc"}}><p>మొత్తం మెటీరియల్ బాడుగ: <b>{money(rentTotal)}</b></p><p>డ్యామేజ్ చార్జీలు: <b>{money(damageFee)}</b></p><p>అడ్వాన్స్ మినహాయింపు: <b>-{money(activeBillCustomer.advance)}</b></p><hr/><h2 style={{margin:"8px 0"}}>నికర బ్యాలెన్స్: {money(netTotal)}</h2><button className="btn primary" onClick={finalizeBill}><Receipt size={16}/> బిల్ ఫైనల్ & లాక్</button></div></div>
            </>}
          </section>
          {branchBills.length>0&&<section className="card"><h3 className="section-title">ఫైనల్ అయిన బిల్లులు</h3>{branchBills.map(b=><div className="item row between" key={b.id}><div><b>{b.billNo} — {b.customer.name}</b><p>{b.date} • {money(b.netPayable)}</p></div><button className="btn dark" onClick={()=>setBillPreview(b)}>రసీదు చూడండి</button></div>)}</section>}
        </>}

        {tab === "CUSTOMERS" && <>
          <div className="pagehead"><div><h2>కస్టమర్ మేనేజ్‌మెంట్</h2><p>కొత్త కస్టమర్ నమోదు మరియు వివరాలు</p></div><div className="row"><Search size={16}/><input className="search" style={{width:230}} placeholder="పేరు / ఫోన్ / సైట్ వెతకండి" value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
          <section className="card" style={{marginBottom:15}}><h3 className="section-title">కొత్త కస్టమర్ నమోదు</h3><form onSubmit={addCustomer}><div className="formgrid">
            <div className="field"><label>కస్టమర్ పేరు *</label><input required value={customerForm.name} onChange={e=>setCustomerForm({...customerForm,name:e.target.value})}/></div>
            <div className="field"><label>వాట్సాప్ ఫోన్ నంబర్ *</label><input required maxLength="10" inputMode="numeric" value={customerForm.whatsapp} onChange={e=>setCustomerForm({...customerForm,whatsapp:e.target.value.replace(/\D/g,"").slice(0,10)})}/></div>
            <div className="field"><label>సైట్ అడ్రస్</label><input value={customerForm.site} onChange={e=>setCustomerForm({...customerForm,site:e.target.value})}/></div>
            <div className="field"><label>రిఫరెన్స్ పర్సన్ పేరు *</label><input required value={customerForm.referenceName} onChange={e=>setCustomerForm({...customerForm,referenceName:e.target.value})}/></div>
            <div className="field"><label>రిఫరెన్స్ ఫోన్</label><input value={customerForm.referencePhone} onChange={e=>setCustomerForm({...customerForm,referencePhone:e.target.value.replace(/\D/g,"").slice(0,10)})}/></div>
            <div className="field"><label>అడ్వాన్స్ (₹)</label><input type="number" min="0" value={customerForm.advance} onChange={e=>setCustomerForm({...customerForm,advance:e.target.value})}/></div>
          </div><label className="row small" style={{marginBottom:12}}><input type="checkbox" checked={customerForm.isVip} onChange={e=>setCustomerForm({...customerForm,isVip:e.target.checked})}/> గోల్డ్ VIP కస్టమర్</label><button className="btn primary"><Plus size={15}/> కస్టమర్ సేవ్ చేయండి</button></form></section>
          <section className="card"><h3 className="section-title">{currentBranch==="Kisan Nagar"?"కిసాన్ నగర్":"అల్లిపురం"} కస్టమర్లు ({filteredCustomers.length})</h3><div className="grid two">{filteredCustomers.map(c=><div className="item" key={c.id}><div className="row between"><b>{c.name}</b>{c.isVip&&<span className="pill goldpill">★ VIP</span>}</div><p>📱 {c.whatsapp} • 📍 {c.site}</p><p>రిఫరెన్స్: {c.referenceName} {c.referencePhone&&`(${c.referencePhone})`}</p><p>అడ్వాన్స్: <b>{money(c.advance)}</b></p>{isAdmin&&<button className="btn outline" onClick={()=>setCustomers(old=>old.map(x=>x.id===c.id?{...x,isVip:!x.isVip}:x))}>{c.isVip?"VIP తీసివేయి":"+ VIP ఇవ్వండి"}</button>}</div>)}</div>{filteredCustomers.length===0&&<div className="empty">కస్టమర్లు లేరు.</div>}</section>
        </>}

        {tab === "INVENTORY" && <>
          <div className="pagehead"><div><h2>గోడౌన్ స్టాక్ & మెషిన్లు</h2><p>{currentBranch==="Kisan Nagar"?"కిసాన్ నగర్":"అల్లిపురం"} — కేటగిరీ మరియు సైజు వారీగా నిల్వ</p></div></div>
          <div className="grid two">{catalog.map(category=><section className="card" key={category.id}><div className="row between"><h3 className="section-title">{category.nameTe}</h3><span className="pill">{category.rentMode==="BOTH"?"రోజు / నెల":category.rentMode==="MONTHLY_ONLY"?"నెలవారీ":"రోజువారీ"}</span></div>
            {category.subItems.filter(sub=>!category.isMachine||sub.godown===currentBranch).map(sub=>{const key=currentBranch==="Kisan Nagar"?"stockKisan":"stockAllipuram";const out=branchDispatches.filter(d=>d.subItemId===sub.id&&d.status!=="BILLED").reduce((sum,d)=>sum+remaining(d),0);const available=category.isMachine?(machineBusy.has(sub.id)?0:1):Number(sub[key])||0;return <div className="item" key={sub.id}><b>{sub.label}</b><div className="row between"><span className="small muted">గోడౌన్‌లో: {available}</span><span className="small muted">సైట్‌లో: {out}</span></div><p>రోజు: {money(sub.dailyRate)} • పార్షియల్: {money(sub.midRate)} {sub.monthlyRate>0&&`• నెల: ${money(sub.monthlyRate)}`}</p></div>})}
          </section>)}</div>
        </>}

        {tab === "RATES" && isAdmin && <>
          <div className="pagehead"><div><h2>అడ్మిన్ రేట్లు సెట్టింగ్స్</h2><p>రోజువారీ, పార్షియల్ మరియు నెలవారీ రేట్లను మార్చండి</p></div></div>
          <section className="card" style={{marginBottom:15}}><h3 className="section-title">అడ్మిన్ PIN మార్చండి</h3><form className="row" onSubmit={e=>{e.preventDefault();if(newPin.trim().length<4)return showToast("కనీసం 4 అక్షరాలు లేదా అంకెలు ఇవ్వండి.");setAdminPin(newPin.trim());setNewPin("");showToast("అడ్మిన్ PIN మార్చబడింది.")}}><input className="search" style={{maxWidth:260}} type="password" minLength="4" value={newPin} onChange={e=>setNewPin(e.target.value)} placeholder="కొత్త PIN / పాస్‌వర్డ్"/><button className="btn dark"><ShieldCheck size={15}/> PIN సేవ్</button></form><p className="small muted">మొదటి డిఫాల్ట్ PIN: 1234. PIN ఈ బ్రౌజర్‌లో మాత్రమే సేవ్ అవుతుంది.</p></section>
          {catalog.map(category=><section className="card" style={{marginBottom:13}} key={category.id}><h3 className="section-title">{category.nameTe}</h3><div className="tablewrap"><table><thead><tr><th>సైజు / మెషిన్</th><th>రోజువారీ ₹</th><th>పార్షియల్ ₹</th><th>నెలవారీ ₹</th></tr></thead><tbody>{category.subItems.map(sub=><tr key={sub.id}><td>{sub.label}</td>{["dailyRate","midRate","monthlyRate"].map(field=><td key={field}><input style={{width:95,padding:7,border:"1px solid #cbd5e1",borderRadius:7}} type="number" min="0" step="0.5" value={sub[field]} onChange={e=>updateRate(category.id,sub.id,field,e.target.value)}/></td>)}</tr>)}</tbody></table></div></section>)}
        </>}
      </main>

      {returnTarget&&<div className="modalback"><div className="modal"><div className="row between"><h3 style={{margin:0}}>మెటీరియల్ రిటర్న్ ఎంట్రీ</h3><button className="btn light" onClick={()=>setReturnTarget(null)}><X size={16}/></button></div><form onSubmit={saveReturn} style={{marginTop:15}}><div className="field"><label>రిటర్న్ తేదీ</label><input type="date" required min={returnTarget.deliveryDate} max={today()} value={returnDate} onChange={e=>setReturnDate(e.target.value)}/></div><div className="notice">మిగిలిన బ్యాలెన్స్: <b>{remaining(returnTarget)}</b>. మొత్తం కంటే తక్కువ సంఖ్య ఇస్తే పార్షియల్ రిటర్న్‌గా నమోదు అవుతుంది.</div><div className="field"><label>తిరిగి వచ్చిన సంఖ్య</label><input type="number" min="1" max={remaining(returnTarget)} step="1" required value={returnQty} onChange={e=>setReturnQty(e.target.value)}/></div><div className="row"><button className="btn light" type="button" onClick={()=>setReturnTarget(null)}>రద్దు</button><button className="btn success"><CheckCircle2 size={15}/> రిటర్న్ సేవ్</button></div></form></div></div>}

      {showPin&&<div className="modalback"><div className="modal"><div className="row between"><h3>అడ్మిన్ పాస్‌వర్డ్ (PIN)</h3><button className="btn light" onClick={()=>setShowPin(false)}><X size={15}/></button></div><p className="muted small">డిఫాల్ట్ PIN: 1234</p><form onSubmit={verifyAdmin}><div className="field"><label>PIN</label><input autoFocus type="password" value={pinInput} onChange={e=>setPinInput(e.target.value)}/></div>{pinError&&<p style={{color:"#be123c"}}>{pinError}</p>}<button className="btn primary">అడ్మిన్ మోడ్ ఓపెన్ చేయండి</button></form></div></div>}

      {billPreview&&<div className="modalback"><div className="modal"><div className="row between no-print"><h3>రెంట్ బిల్ రసీదు</h3><button className="btn light" onClick={()=>setBillPreview(null)}><X size={15}/></button></div><div className="bill" id="print-bill"><h3>PLS సెంట్రింగ్ మెటీరియల్స్</h3><p style={{textAlign:"center"}}>{billPreview.godown==="Allipuram"?"అల్లిపురం":"కిసాన్ నగర్"}, నెల్లూరు • రెంట్ బిల్</p><hr/><p><b>బిల్ నంబర్:</b> {billPreview.billNo} <span style={{float:"right"}}><b>తేదీ:</b> {billPreview.date}</span></p><p><b>కస్టమర్:</b> {billPreview.customer.name}</p><p><b>సైట్:</b> {billPreview.customer.site}</p><hr/>{billPreview.lines.map((line,index)=><div key={line.id} className="row between"><div style={{maxWidth:"75%"}}><p><b>{index+1}. {line.itemName}</b></p><p>{line.qty} సంఖ్య × {line.days} రోజులు</p></div><b>{money(line.subtotal)}</b></div>)}<hr/><p>మొత్తం బాడుగ: <b style={{float:"right"}}>{money(billPreview.rentTotal)}</b></p><p>డ్యామేజ్: <b style={{float:"right"}}>{money(billPreview.damageFee)}</b></p><p>అడ్వాన్స్: <b style={{float:"right"}}>-{money(billPreview.advancePaid)}</b></p><h3 style={{textAlign:"right",marginTop:15}}>నికర మొత్తం: {money(billPreview.netPayable)}</h3><p style={{textAlign:"center",marginTop:20}}>ధన్యవాదాలు! — PLS Centering Materials</p></div><div className="row no-print" style={{marginTop:14}}><button className="btn success" onClick={()=>window.open(`https://wa.me/91${billPreview.customer.whatsapp}?text=${encodeURIComponent(billText(billPreview))}`,"_blank")}><MessageCircle size={15}/> WhatsApp</button><button className="btn outline" onClick={()=>window.open(`sms:+91${billPreview.customer.whatsapp}?body=${encodeURIComponent(billText(billPreview))}`)}><MessageCircle size={15}/> SMS</button><button className="btn dark" onClick={()=>window.print()}><Printer size={15}/> ప్రింట్</button></div></div></div>}

      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
