// import React from "react";
// import SLAAnalysis from "./SLAAnalysis";
// import TasksCompletedByVendor from "./TasksCompletedByVendor";
// import SLAComplianceRate from "./SLAComplianceRate.jsx";
// import AverageResolutionTime from "./AcerageResulutionTime.jsx";
// import SLAResolution from "./SLAIssuResolution.jsx";
// import TeamPerformance from "./TeamPerformance.jsx";
// import AverageResponseTimeChart from "./AverageTeamPerformance.jsx";
// import Notifications from "../dashboardNew/Notifications.jsx";
// import Alerts from "./Alerts.jsx";
// import TaskSchedule from "./TaskSchedule.jsx";
// import MapData from "./MapData.jsx";
// import NotificationLog from "./NotificationLog.jsx";
// import SLASummary from "./SLASummary1.jsx";
// import HelplineNo from "../SanitationDashboard/helplineNo.jsx";

// const SLADashboard = () => {
//   return (
//     <div className="grid grid-cols-4 mx-3 mt-3 gap-3 ">
//       <div className="col-span-4 md:col-span-2 shadow-md bg-white rounded-md">
//         <TasksCompletedByVendor></TasksCompletedByVendor>
//       </div>
//       <div className="col-span-4 md:col-span-2 shadow-md bg-white rounded-md">
//         <SLAAnalysis></SLAAnalysis>
//       </div>
//       <div className="col-span-4 rounded-md gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         <AverageResolutionTime></AverageResolutionTime>
//         <SLAComplianceRate></SLAComplianceRate>
//         <SLAResolution></SLAResolution>
//       </div>

//       </div>
//   );
// };

// export default SLADashboard;
import React, { useMemo, useState } from "react";

/*
  Sanitation & Vehicle SLA Dashboard
  - Ready-to-use React component with static demo data.
  - Uses Tailwind CSS utility classes only; no icon/chart dependency required.
  - Data is kept in component state for demonstration. Connect these arrays/actions to your APIs
    before using it as a production monitoring system.
*/

const initialToilets = [
  { id: "T-1001", type: "Public Toilet", sector: "Sector 01", location: "Main Ghat - North", vendor: "CleanCity Services", lastInspection: "10:15 AM", cleanliness: "Clean", water: "Available", dueCleaning: "11:00 AM", complaints: 0 },
  { id: "T-1002", type: "Toilet Block", sector: "Sector 01", location: "Entry Gate A", vendor: "CleanCity Services", lastInspection: "09:40 AM", cleanliness: "Needs Cleaning", water: "Available", dueCleaning: "10:30 AM", complaints: 2 },
  { id: "T-1018", type: "Accessible Toilet", sector: "Sector 02", location: "Medical Camp Road", vendor: "Swasth Facilities", lastInspection: "10:05 AM", cleanliness: "Clean", water: "Low", dueCleaning: "11:30 AM", complaints: 1 },
  { id: "T-1042", type: "Mobile Toilet", sector: "Sector 03", location: "Parking Zone B", vendor: "Swasth Facilities", lastInspection: "08:55 AM", cleanliness: "Unclean", water: "Unavailable", dueCleaning: "09:30 AM", complaints: 3 },
  { id: "T-1087", type: "Public Toilet", sector: "Sector 04", location: "Camp Lane 7", vendor: "JanSeva Operations", lastInspection: "10:22 AM", cleanliness: "Clean", water: "Available", dueCleaning: "12:00 PM", complaints: 0 },
];

const initialVehicles = [
  { id: "MH-12-AB-1024", type: "Compactor", vendor: "GreenRoute Logistics", driver: "Ramesh Patil", route: "R-01", sector: "Sector 01", status: "On Route", trips: 3, plannedKm: 42, actualKm: 38.6, pointsDone: 14, pointsTotal: 15, lastUpdate: "10:28 AM" },
  { id: "MH-12-CD-2218", type: "Tipper", vendor: "GreenRoute Logistics", driver: "Sanjay More", route: "R-02", sector: "Sector 02", status: "On Route", trips: 2, plannedKm: 35, actualKm: 31.2, pointsDone: 10, pointsTotal: 12, lastUpdate: "10:25 AM" },
  { id: "MH-14-EF-3140", type: "Tipper", vendor: "UrbanClean Transport", driver: "Ajay Shinde", route: "R-07", sector: "Sector 03", status: "Breakdown", trips: 1, plannedKm: 48, actualKm: 12.4, pointsDone: 4, pointsTotal: 16, lastUpdate: "09:42 AM" },
  { id: "MH-12-GH-4561", type: "Compactor", vendor: "UrbanClean Transport", driver: "Nitin Jadhav", route: "R-09", sector: "Sector 04", status: "Completed", trips: 4, plannedKm: 55, actualKm: 56.1, pointsDone: 18, pointsTotal: 18, lastUpdate: "10:10 AM" },
  { id: "MH-15-JK-7812", type: "Tractor Trolley", vendor: "GreenRoute Logistics", driver: "Prakash Kale", route: "R-12", sector: "Sector 02", status: "Not Started", trips: 0, plannedKm: 28, actualKm: 0, pointsDone: 0, pointsTotal: 9, lastUpdate: "08:00 AM" },
];

const initialComplaints = [
  { id: "C-1025", category: "Unclean toilet", asset: "T-1042", sector: "Sector 03", vendor: "Swasth Facilities", created: "09:10 AM", deadline: "10:10 AM", status: "Overdue", priority: "Critical", assignedTo: "Sector Supervisor" },
  { id: "C-1026", category: "No water", asset: "T-1018", sector: "Sector 02", vendor: "Swasth Facilities", created: "10:00 AM", deadline: "11:00 AM", status: "In Progress", priority: "High", assignedTo: "Vendor Team 2" },
  { id: "C-1027", category: "Missed collection point", asset: "R-02 / CP-11", sector: "Sector 02", vendor: "GreenRoute Logistics", created: "09:45 AM", deadline: "10:45 AM", status: "Assigned", priority: "High", assignedTo: "Route Supervisor" },
  { id: "C-1028", category: "Vehicle breakdown", asset: "MH-14-EF-3140", sector: "Sector 03", vendor: "UrbanClean Transport", created: "09:42 AM", deadline: "10:12 AM", status: "Overdue", priority: "Critical", assignedTo: "Transport Manager" },
  { id: "C-1029", category: "Cleaning request", asset: "T-1002", sector: "Sector 01", vendor: "CleanCity Services", created: "10:20 AM", deadline: "11:20 AM", status: "Resolved - Awaiting Verification", priority: "Medium", assignedTo: "Inspector 14" },
];

const initialRoutes = [
  { id: "R-01", sector: "Sector 01", vendor: "GreenRoute Logistics", vehicle: "MH-12-AB-1024", points: 15, completed: 14, plannedKm: 42, actualKm: 38.6, window: "06:00–11:00", status: "At Risk" },
  { id: "R-02", sector: "Sector 02", vendor: "GreenRoute Logistics", vehicle: "MH-12-CD-2218", points: 12, completed: 10, plannedKm: 35, actualKm: 31.2, window: "06:30–11:30", status: "At Risk" },
  { id: "R-07", sector: "Sector 03", vendor: "UrbanClean Transport", vehicle: "MH-14-EF-3140", points: 16, completed: 4, plannedKm: 48, actualKm: 12.4, window: "06:00–12:00", status: "Breached" },
  { id: "R-09", sector: "Sector 04", vendor: "UrbanClean Transport", vehicle: "MH-12-GH-4561", points: 18, completed: 18, plannedKm: 55, actualKm: 56.1, window: "05:30–10:30", status: "Completed" },
];

const initialRules = [
  { id: "S-01", service: "Toilet registration", target: "100% before operation", threshold: "100", unit: "%", severity: "High", enabled: true },
  { id: "S-02", service: "Scheduled cleanliness inspections", target: "100% of inspections due", threshold: "100", unit: "%", severity: "High", enabled: true },
  { id: "S-03", service: "Complaint acknowledgement", target: "Within 10 minutes", threshold: "10", unit: "minutes", severity: "High", enabled: true },
  { id: "S-04", service: "Urgent toilet complaint resolution", target: "Within 60 minutes", threshold: "60", unit: "minutes", severity: "Critical", enabled: true },
  { id: "S-05", service: "Scheduled collection-point coverage", target: "100% of points due", threshold: "100", unit: "%", severity: "Critical", enabled: true },
  { id: "S-06", service: "Vehicle breakdown acknowledgement", target: "Within 15 minutes", threshold: "15", unit: "minutes", severity: "High", enabled: true },
  { id: "S-07", service: "Daily trip and distance reporting", target: "Complete by daily cut-off", threshold: "100", unit: "%", severity: "Medium", enabled: true },
];

const initialVendors = [
  { name: "CleanCity Services", service: "Sanitation", assets: 420, compliance: 96, open: 4, overdue: 1, trend: "+2.1%" },
  { name: "Swasth Facilities", service: "Sanitation", assets: 385, compliance: 88, open: 9, overdue: 4, trend: "-3.4%" },
  { name: "JanSeva Operations", service: "Sanitation", assets: 445, compliance: 97, open: 2, overdue: 0, trend: "+1.4%" },
  { name: "GreenRoute Logistics", service: "Vehicles", assets: 24, compliance: 93, open: 5, overdue: 1, trend: "+0.8%" },
  { name: "UrbanClean Transport", service: "Vehicles", assets: 18, compliance: 81, open: 7, overdue: 3, trend: "-5.2%" },
];

const tabs = ["Overview", "Sanitation SLA", "Vehicle SLA", "Complaints", "Vendor Performance", "SLA Configuration"];
const cx = (...parts) => parts.filter(Boolean).join(" ");

function Badge({ children, tone = "gray" }) {
  const tones = {
    green: "bg-green-50 text-green-700 ring-green-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    yellow: "bg-amber-50 text-amber-800 ring-amber-200",
    blue: "bg-blue-50 text-blue-600 ring-blue-200",
    gray: "bg-gray-100 text-gray-700 ring-gray-200",
    purple: "bg-purple-50 text-purple-700 ring-purple-200",
  };
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", tones[tone] || tones.gray)}>{children}</span>;
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={cx("min-w-0 rounded-md border border-gray-200 bg-gray-50 p-3 shadow-md", className)}>
      {(title || action) && <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>{title && <h2 className="text-base font-bold text-gray-900">{title}</h2>}{subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}</div>
        {action}
      </div>}
      {children}
    </section>
  );
}

function Metric({ label, value, note, tone = "blue" }) {
  const styles = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    amber: "bg-yellow-400",
    purple: "bg-purple-500",
  };

  return (
    <div className="relative flex min-h-[110px] flex-col justify-between rounded-md border border-gray-200 bg-gray-50 p-3 shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-gray-600">{label}</p>
        <span className={cx("h-3 w-3 shrink-0 rounded-full", styles[tone] || styles.blue)} aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{note}</p>
    </div>
  );
}

function Progress({ value, color = "bg-blue-600" }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100"><div className={cx("h-full rounded-full", color)} style={{ width: `${safe}%` }} /></div>;
}

function EmptyState({ children }) { return <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">{children}</div>; }

function exportCsv(filename, rows) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [keys.map(quote).join(","), ...rows.map((row) => keys.map((key) => quote(row[key])).join(","))].join("\r\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

export default function SanitationVehicleSLADashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [toilets, setToilets] = useState(initialToilets);
  const [vehicles] = useState(initialVehicles);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [routes] = useState(initialRoutes);
  const [rules, setRules] = useState(initialRules);
  const [vendors] = useState(initialVendors);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [notice, setNotice] = useState("");

  const openComplaints = complaints.filter((item) => !["Closed", "Verified / Closed"].includes(item.status));
  const overdueComplaints = complaints.filter((item) => item.status === "Overdue");
  const cleanToilets = toilets.filter((item) => item.cleanliness === "Clean").length;
  const toiletCompliance = toilets.length ? Math.round((cleanToilets / toilets.length) * 100) : 0;
  const totalPoints = routes.reduce((sum, item) => sum + item.points, 0);
  const donePoints = routes.reduce((sum, item) => sum + item.completed, 0);
  const routeCoverage = totalPoints ? Math.round((donePoints / totalPoints) * 100) : 0;
  const activeVehicles = vehicles.filter((item) => ["On Route", "Completed"].includes(item.status)).length;
  const averageVendorCompliance = vendors.length ? Math.round(vendors.reduce((sum, vendor) => sum + vendor.compliance, 0) / vendors.length) : 0;

  const filteredToilets = useMemo(() => toilets.filter((item) => `${item.id} ${item.type} ${item.sector} ${item.location} ${item.vendor} ${item.cleanliness}`.toLowerCase().includes(search.toLowerCase())), [toilets, search]);
  const filteredVehicles = useMemo(() => vehicles.filter((item) => `${item.id} ${item.type} ${item.vendor} ${item.route} ${item.driver} ${item.status}`.toLowerCase().includes(search.toLowerCase())), [vehicles, search]);
  const filteredComplaints = useMemo(() => complaints.filter((item) => `${item.id} ${item.category} ${item.asset} ${item.vendor} ${item.sector} ${item.status}`.toLowerCase().includes(search.toLowerCase())), [complaints, search]);
  const filteredVendors = vendors.filter((item) => (serviceFilter === "All" || item.service === serviceFilter) && `${item.name} ${item.service}`.toLowerCase().includes(search.toLowerCase()));

  const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(""), 3000); };
  const updateComplaintStatus = (id, status) => {
    setComplaints((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    showNotice(`${id} updated to: ${status}. Demo state only; connect an API to persist it.`);
  };
  const updateToiletCleanliness = (id, cleanliness) => {
    setToilets((current) => current.map((item) => item.id === id ? { ...item, cleanliness } : item));
    showNotice(`${id} cleanliness changed to ${cleanliness}. Demo state only; connect an API to persist it.`);
  };
  const updateRule = (id, field, value) => setRules((current) => current.map((rule) => rule.id === id ? { ...rule, [field]: value } : rule));

  const statusTone = (status) => {
    if (["Clean", "Completed", "Verified / Closed", "Resolved"].includes(status)) return "green";
    if (["Unclean", "Overdue", "Breakdown", "Breached"].includes(status)) return "red";
    if (["Needs Cleaning", "Low", "At Risk", "In Progress", "Resolved - Awaiting Verification"].includes(status)) return "yellow";
    if (["On Route", "Assigned"].includes(status)) return "blue";
    return "gray";
  };

  const exportCurrent = () => {
    if (activeTab === "Sanitation SLA") exportCsv("sanitation-assets-demo.csv", toilets);
    else if (activeTab === "Vehicle SLA") exportCsv("vehicle-routes-demo.csv", routes);
    else if (activeTab === "Complaints") exportCsv("complaints-demo.csv", complaints);
    else if (activeTab === "Vendor Performance") exportCsv("vendor-performance-demo.csv", vendors);
    else if (activeTab === "SLA Configuration") exportCsv("sla-rules-demo.csv", rules);
    else exportCsv("sla-overview-complaints-demo.csv", complaints);
  };

  return <main className="w-full space-y-4 rounded-xl bg-white p-4 text-gray-800">
    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div><h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">SLA Provision & Escalation Matrix</h1><p className="mt-1 text-sm text-gray-500">Toilet cleanliness, vehicle routes, collection points, complaints and vendor compliance</p></div>
      <div className="flex flex-wrap items-center gap-2"><button onClick={exportCurrent} className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">Export Current Data CSV</button></div>
    </header>

    {notice && <div role="status" className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div>}

    <nav className="flex gap-2 overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-2 shadow-md" aria-label="SLA dashboard sections">
      {tabs.map((tab) => <button key={tab} onClick={() => { setActiveTab(tab); setSearch(""); }} className={cx("whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition", activeTab === tab ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}>{tab}</button>)}
    </nav>

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="text-lg font-bold text-gray-900">{activeTab}</h2><p className="text-xs text-gray-500">Illustrative records for UI demonstration. Confirm SLA values against the signed contract.</p></div>
      {activeTab !== "Overview" && activeTab !== "SLA Configuration" && <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID, sector, route, vendor..." className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm" />}
    </div>

    {activeTab === "Overview" && <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Registered toilets (demo subset)" value={toilets.length.toLocaleString("en-IN")} note={`${cleanToilets} clean on latest inspection`} tone="green" />
        <Metric label="Vehicles on route / completed" value={`${activeVehicles} / ${vehicles.length}`} note={`${vehicles.filter((v) => v.status === "Breakdown").length} breakdown reported`} tone="blue" />
        <Metric label="Open complaints" value={openComplaints.length} note={`${overdueComplaints.length} marked overdue`} tone="red" />
        <Metric label="Average vendor compliance" value={`${averageVendorCompliance}%`} note="Illustrative vendor score average" tone="purple" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Sanitation snapshot" subtitle="Latest demo inspection status by registered toilet">
          <div className="mb-4 flex items-end justify-between"><div><p className="text-3xl font-bold text-gray-900">{toiletCompliance}%</p><p className="text-xs text-gray-500">Cleanliness pass rate in visible sample</p></div><Badge tone={toiletCompliance >= 95 ? "green" : "yellow"}>{toiletCompliance >= 95 ? "On target" : "Needs attention"}</Badge></div>
          <Progress value={toiletCompliance} color={toiletCompliance >= 95 ? "bg-green-600" : "bg-amber-500"} />
          <div className="mt-4 space-y-3">{["Clean", "Needs Cleaning", "Unclean"].map((status) => { const count = toilets.filter((item) => item.cleanliness === status).length; return <div key={status} className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Badge tone={statusTone(status)}>{status}</Badge><span className="text-sm text-gray-600">Toilets</span></div><span className="text-sm font-bold text-gray-900">{count}</span></div>; })}</div>
        </Panel>
        <Panel title="Vehicle route snapshot" subtitle="Collection-point service progress across demo routes">
          <div className="mb-4 flex items-end justify-between"><div><p className="text-3xl font-bold text-gray-900">{routeCoverage}%</p><p className="text-xs text-gray-500">Verified points completed in sample</p></div><Badge tone={routeCoverage >= 95 ? "green" : "yellow"}>{donePoints} / {totalPoints} points</Badge></div>
          <Progress value={routeCoverage} color={routeCoverage >= 95 ? "bg-green-600" : "bg-blue-600"} />
          <div className="mt-4 space-y-3">{routes.map((route) => <div key={route.id}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="font-semibold text-gray-800">{route.id} · {route.sector}</span><span className="text-gray-500">{route.completed}/{route.points} points</span></div><Progress value={route.points ? route.completed / route.points * 100 : 0} color={route.status === "Breached" ? "bg-red-500" : route.completed === route.points ? "bg-green-600" : "bg-blue-600"} /></div>)}</div>
        </Panel>
      </div>
      <Panel title="Priority actions" subtitle="Issues requiring operational follow-up">
        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Issue</th><th className="px-3 py-3">Asset / Route</th><th className="px-3 py-3">Vendor</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{complaints.filter((item) => ["Overdue", "Resolved - Awaiting Verification", "Assigned"].includes(item.status)).map((item) => <tr key={item.id}><td className="px-3 py-3"><p className="font-semibold text-gray-900">{item.category}</p><p className="text-xs text-gray-500">{item.id} · {item.sector}</p></td><td className="px-3 py-3">{item.asset}</td><td className="px-3 py-3">{item.vendor}</td><td className="px-3 py-3"><Badge tone={statusTone(item.status)}>{item.status}</Badge></td><td className="px-3 py-3"><button onClick={() => setActiveTab("Complaints")} className="font-semibold text-blue-600 hover:underline">Review</button></td></tr>)}</tbody></table></div>
      </Panel>
    </div>}

    {activeTab === "Sanitation SLA" && <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><Metric label="Toilets in sample" value={toilets.length} note="Demo records only" tone="blue" /><Metric label="Clean at latest inspection" value={cleanToilets} note={`${toiletCompliance}% pass rate in sample`} tone="green" /><Metric label="Toilet-linked complaints" value={complaints.filter((c) => c.asset.startsWith("T-")).length} note="Across demo records" tone="amber" /></div>
      <Panel title="Toilet register & inspection status" subtitle="Filter by toilet ID, sector, location or vendor">
        <div className="overflow-x-auto"><table className="min-w-[1050px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Toilet / type</th><th className="px-3 py-3">Sector / location</th><th className="px-3 py-3">Responsible vendor</th><th className="px-3 py-3">Last inspection</th><th className="px-3 py-3">Cleanliness</th><th className="px-3 py-3">Water</th><th className="px-3 py-3">Complaints</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredToilets.map((item) => <tr key={item.id} className="hover:bg-gray-50"><td className="px-3 py-3"><p className="font-bold text-gray-900">{item.id}</p><p className="text-xs text-gray-500">{item.type}</p></td><td className="px-3 py-3"><p>{item.sector}</p><p className="text-xs text-gray-500">{item.location}</p></td><td className="px-3 py-3">{item.vendor}</td><td className="px-3 py-3">{item.lastInspection}<p className="text-xs text-gray-500">Next due {item.dueCleaning}</p></td><td className="px-3 py-3"><select aria-label={`Change cleanliness for ${item.id}`} value={item.cleanliness} onChange={(event) => updateToiletCleanliness(item.id, event.target.value)} className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"><option>Clean</option><option>Needs Cleaning</option><option>Unclean</option></select></td><td className="px-3 py-3"><Badge tone={item.water === "Available" ? "green" : item.water === "Low" ? "yellow" : "red"}>{item.water}</Badge></td><td className="px-3 py-3"><span className={cx("font-bold", item.complaints ? "text-amber-700" : "text-gray-500")}>{item.complaints}</span></td></tr>)}</tbody></table>{filteredToilets.length === 0 && <EmptyState>No toilets match this search.</EmptyState>}</div>
      </Panel>
      <Panel title="Sanitation SLA checks" subtitle="Suggested targets only; replace with approved contract terms">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{rules.filter((rule) => ["S-01", "S-02", "S-03", "S-04"].includes(rule.id)).map((rule) => <div key={rule.id} className="rounded-md border border-gray-200 bg-gray-50 p-3 shadow-md"><div className="flex items-start justify-between gap-2"><p className="font-semibold text-gray-900">{rule.service}</p><Badge tone={rule.severity === "Critical" ? "red" : rule.severity === "High" ? "yellow" : "blue"}>{rule.severity}</Badge></div><p className="mt-2 text-sm text-gray-600">Target: {rule.target}</p><p className="mt-1 text-xs text-gray-400">Rule {rule.id}</p></div>)}</div>
      </Panel>
    </div>}

    {activeTab === "Vehicle SLA" && <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Vehicles in sample" value={vehicles.length} note="Registered demo vehicles" tone="blue" /><Metric label="On route / completed" value={activeVehicles} note="Current demo statuses" tone="green" /><Metric label="Collection-point coverage" value={`${routeCoverage}%`} note={`${donePoints} of ${totalPoints} points complete`} tone="purple" /><Metric label="Breakdowns" value={vehicles.filter((v) => v.status === "Breakdown").length} note="Requires response / recovery" tone="red" /></div>
      <Panel title="Vehicle register & daily operation" subtitle="Actual kilometre values are illustrative; production data should come from approved GPS/odometer records">
        <div className="overflow-x-auto"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Vehicle / type</th><th className="px-3 py-3">Vendor / driver</th><th className="px-3 py-3">Route / sector</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Trips</th><th className="px-3 py-3">Distance (km)</th><th className="px-3 py-3">Points serviced</th><th className="px-3 py-3">Last update</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredVehicles.map((item) => <tr key={item.id} className="hover:bg-gray-50"><td className="px-3 py-3"><p className="font-bold text-gray-900">{item.id}</p><p className="text-xs text-gray-500">{item.type}</p></td><td className="px-3 py-3"><p>{item.vendor}</p><p className="text-xs text-gray-500">Driver: {item.driver}</p></td><td className="px-3 py-3"><p className="font-semibold">{item.route}</p><p className="text-xs text-gray-500">{item.sector}</p></td><td className="px-3 py-3"><Badge tone={statusTone(item.status)}>{item.status}</Badge></td><td className="px-3 py-3">{item.trips}</td><td className="px-3 py-3"><p className="font-semibold">{item.actualKm.toFixed(1)} km</p><p className="text-xs text-gray-500">Plan: {item.plannedKm} km</p></td><td className="px-3 py-3"><p className="font-semibold">{item.pointsDone}/{item.pointsTotal}</p><Progress value={item.pointsTotal ? item.pointsDone / item.pointsTotal * 100 : 0} color={item.pointsDone === item.pointsTotal ? "bg-green-600" : "bg-blue-600"} /></td><td className="px-3 py-3">{item.lastUpdate}</td></tr>)}</tbody></table>{filteredVehicles.length === 0 && <EmptyState>No vehicles match this search.</EmptyState>}</div>
      </Panel>
      <Panel title="Route & collection-point compliance" subtitle="A point should count as serviced only when the configured proof is recorded">
        <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Route</th><th className="px-3 py-3">Vehicle / vendor</th><th className="px-3 py-3">Collection points</th><th className="px-3 py-3">Planned / actual km</th><th className="px-3 py-3">Service window</th><th className="px-3 py-3">SLA status</th></tr></thead><tbody className="divide-y divide-gray-100">{routes.map((route) => <tr key={route.id}><td className="px-3 py-3"><p className="font-bold">{route.id}</p><p className="text-xs text-gray-500">{route.sector}</p></td><td className="px-3 py-3"><p>{route.vehicle}</p><p className="text-xs text-gray-500">{route.vendor}</p></td><td className="px-3 py-3"><p>{route.completed} / {route.points} completed</p><div className="mt-1 w-32"><Progress value={route.completed / route.points * 100} color={route.status === "Breached" ? "bg-red-500" : route.completed === route.points ? "bg-green-600" : "bg-blue-600"} /></div></td><td className="px-3 py-3">{route.plannedKm} / {route.actualKm.toFixed(1)} km</td><td className="px-3 py-3">{route.window}</td><td className="px-3 py-3"><Badge tone={statusTone(route.status)}>{route.status}</Badge></td></tr>)}</tbody></table></div>
      </Panel>
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><strong>Integration note:</strong> GPS tracking, geofencing, QR scans, weighbridge data and route deviation detection need backend/device integrations. This page currently displays sample values only.</div>
    </div>}

    {activeTab === "Complaints" && <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><Metric label="Open complaints" value={openComplaints.length} note="Not yet closed" tone="blue" /><Metric label="Overdue" value={overdueComplaints.length} note="Escalation should be reviewed" tone="red" /><Metric label="Awaiting verification" value={complaints.filter((c) => c.status === "Resolved - Awaiting Verification").length} note="Do not auto-close without proof" tone="amber" /></div>
      <Panel title="Complaint and exception register" subtitle="Status changes work in this demo only; a real deployment must save changes through the API">
        <div className="overflow-x-auto"><table className="min-w-[1100px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Complaint</th><th className="px-3 py-3">Asset / sector</th><th className="px-3 py-3">Vendor / assigned to</th><th className="px-3 py-3">Created / deadline</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Update status</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredComplaints.map((item) => <tr key={item.id} className="hover:bg-gray-50"><td className="px-3 py-3"><p className="font-bold text-gray-900">{item.id}</p><p className="text-xs text-gray-500">{item.category}</p></td><td className="px-3 py-3"><p>{item.asset}</p><p className="text-xs text-gray-500">{item.sector}</p></td><td className="px-3 py-3"><p>{item.vendor}</p><p className="text-xs text-gray-500">{item.assignedTo}</p></td><td className="px-3 py-3"><p>{item.created}</p><p className="text-xs text-gray-500">Due: {item.deadline}</p></td><td className="px-3 py-3"><Badge tone={item.priority === "Critical" ? "red" : item.priority === "High" ? "yellow" : "blue"}>{item.priority}</Badge></td><td className="px-3 py-3"><Badge tone={statusTone(item.status)}>{item.status}</Badge></td><td className="px-3 py-3"><select aria-label={`Update status ${item.id}`} value={item.status} onChange={(event) => updateComplaintStatus(item.id, event.target.value)} className="max-w-56 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"><option>Assigned</option><option>In Progress</option><option>Overdue</option><option>Resolved - Awaiting Verification</option><option>Verified / Closed</option></select></td></tr>)}</tbody></table>{filteredComplaints.length === 0 && <EmptyState>No complaints match this search.</EmptyState>}</div>
        <p className="mt-3 text-xs text-gray-500">Suggested workflow: New → Assigned → Acknowledged → In Progress → Resolution Submitted → Verified / Closed. Allow reopening when verification fails. Store timestamps for every transition.</p>
      </Panel>
      <Panel title="Escalation ladder" subtitle="Illustrative workflow; map the roles to your approved governance structure">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{[{ level: "L0", role: "Field worker / driver", action: "Report issue and begin immediate corrective action" }, { level: "L1", role: "Vendor supervisor", action: "Acknowledge and assign team" }, { level: "L2", role: "Vendor / service manager", action: "Resolve overdue issue or repeated failure" }, { level: "L3", role: "Control-room officer", action: "Review breach and require action plan" }, { level: "L4", role: "Mela Authority / contract manager", action: "Review persistent contractual non-compliance" }, { level: "L5", role: "Authorised contract administrator", action: "Apply approved contractual remedies where permitted" }].map((item) => <div key={item.level} className="flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 shadow-md"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-600">{item.level}</div><div><p className="font-semibold text-gray-900">{item.role}</p><p className="mt-1 text-xs text-gray-500">{item.action}</p></div></div>)}</div>
      </Panel>
    </div>}

    {activeTab === "Vendor Performance" && <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row"><select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"><option>All</option><option>Sanitation</option><option>Vehicles</option></select><p className="self-center text-xs text-gray-500">Scores below are illustrative; use your approved SLA formula for contractual scoring.</p></div>
      <Panel title="Vendor compliance scorecards" subtitle="Compare SLA compliance, assets, open items and overdue issues">
        <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Vendor</th><th className="px-3 py-3">Service</th><th className="px-3 py-3">Assets assigned</th><th className="px-3 py-3">Compliance score</th><th className="px-3 py-3">Open issues</th><th className="px-3 py-3">Overdue</th><th className="px-3 py-3">Trend</th><th className="px-3 py-3">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredVendors.map((vendor) => <tr key={vendor.name} className="hover:bg-gray-50"><td className="px-3 py-3 font-bold text-gray-900">{vendor.name}</td><td className="px-3 py-3"><Badge tone={vendor.service === "Sanitation" ? "green" : "blue"}>{vendor.service}</Badge></td><td className="px-3 py-3">{vendor.assets}</td><td className="px-3 py-3"><div className="flex min-w-36 items-center gap-2"><span className="w-10 font-bold">{vendor.compliance}%</span><div className="flex-1"><Progress value={vendor.compliance} color={vendor.compliance >= 95 ? "bg-green-600" : vendor.compliance >= 90 ? "bg-blue-600" : "bg-red-500"} /></div></div></td><td className="px-3 py-3">{vendor.open}</td><td className="px-3 py-3"><span className={vendor.overdue ? "font-bold text-red-700" : "text-gray-500"}>{vendor.overdue}</span></td><td className={cx("px-3 py-3 font-semibold", vendor.trend.startsWith("+") ? "text-green-700" : "text-red-700")}>{vendor.trend}</td><td className="px-3 py-3"><button onClick={() => { setSearch(vendor.name); setActiveTab("Complaints"); }} className="font-semibold text-blue-600 hover:underline">View issues</button></td></tr>)}</tbody></table>{filteredVendors.length === 0 && <EmptyState>No vendors match these filters.</EmptyState>}</div>
      </Panel>
      <Panel title="Recommended vendor score components" subtitle="Agree weights and exclusions in the contract before calculating a final score">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">{[{ name: "Service quality", detail: "Cleanliness inspections and verified service" }, { name: "Timeliness", detail: "Response, resolution and collection windows" }, { name: "Coverage", detail: "Scheduled toilets, routes and collection points" }, { name: "Record quality", detail: "Complete, timely and auditable evidence" }].map((item) => <div key={item.name} className="rounded-md border border-gray-200 bg-gray-50 p-3 shadow-md"><p className="font-bold text-gray-900">{item.name}</p><p className="mt-1 text-xs text-gray-500">{item.detail}</p></div>)}</div>
      </Panel>
    </div>}

    {activeTab === "SLA Configuration" && <div className="space-y-4">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><strong>Before production:</strong> these are proposed example targets, not verified contract clauses. Edit the values for this demo, then obtain approval and save them through your backend. The component does not automatically calculate live breaches or penalties.</div>
      <Panel title="SLA rule configuration" subtitle="Edit sample thresholds and enable or disable rules for this page session">
        <div className="overflow-x-auto"><table className="min-w-[1000px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3">Rule / service</th><th className="px-3 py-3">Threshold</th><th className="px-3 py-3">Unit</th><th className="px-3 py-3">Severity</th><th className="px-3 py-3">Enabled</th></tr></thead><tbody className="divide-y divide-gray-100">{rules.map((rule) => <tr key={rule.id}><td className="px-3 py-3"><p className="font-semibold text-gray-900">{rule.service}</p><p className="text-xs text-gray-500">{rule.id} · Current target: {rule.target}</p></td><td className="px-3 py-3"><input type="number" min="0" value={rule.threshold} onChange={(event) => updateRule(rule.id, "threshold", event.target.value)} className="w-24 rounded-md border border-gray-300 px-2 py-1.5" /></td><td className="px-3 py-3"><select value={rule.unit} onChange={(event) => updateRule(rule.id, "unit", event.target.value)} className="rounded-md border border-gray-300 bg-white px-2 py-1.5"><option value="%">%</option><option value="minutes">minutes</option><option value="hours">hours</option><option value="trips">trips</option></select></td><td className="px-3 py-3"><select value={rule.severity} onChange={(event) => updateRule(rule.id, "severity", event.target.value)} className="rounded-md border border-gray-300 bg-white px-2 py-1.5"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></td><td className="px-3 py-3"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={rule.enabled} onChange={(event) => updateRule(rule.id, "enabled", event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-700" /><span className="text-xs text-gray-600">{rule.enabled ? "Enabled" : "Disabled"}</span></label></td></tr>)}</tbody></table></div>
        <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => exportCsv("sla-rules-demo.csv", rules)} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">Export rules CSV</button><button onClick={() => { setRules(initialRules); showNotice("Demo SLA rules reset. No server data was changed."); }} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">Reset demo rules</button></div>
      </Panel>
      <Panel title="Recommended SLA calculation and audit requirements">
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600"><li>Keep a versioned record of every approved SLA target, its effective date, contract reference and approving authority.</li><li>Calculate complaint deadlines from server timestamps and the approved service calendar; do not rely on browser time.</li><li>Record every status change, notification, acknowledgement, verification, escalation and authorised exception.</li><li>Exclude cancelled or approved-exception records only according to the agreed SLA policy, with an audit reason.</li><li>Make vendor score formulas transparent, and keep sanitation and vehicle scores separate unless the contract defines a combined score.</li><li>Apply financial penalties or deductions only through approved contractual rules and authorised approval workflows.</li></ul>
      </Panel>
    </div>}

    <footer className="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-500 shadow-md">Demo disclaimer: all names, counts, IDs, timings, routes and scores in this component are sample values. State edits are temporary and reset on refresh. Production use requires API/database integration, role-based access, server-side SLA timers, GPS/collection evidence integration, notifications, audit logs and contract-approved targets.</footer>
  </main>;
}
