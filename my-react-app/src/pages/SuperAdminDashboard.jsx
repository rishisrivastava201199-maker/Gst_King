// src/App.jsx - Updated: Removed Quick Bulk Actions, Filters, and sped up toast
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "../App.css";

// Mock Data (Expanded)
const mockFirms = [
  { id: 1, name: "Sharma & Co", regDate: "2023-01-15", active: true, clients: 1248, activeSince: "2023-01-15", plan: "Pro", apiUsage: "1.2M calls", revenue: "₹1.42L" },
  { id: 2, name: "Gupta Associates", regDate: "2022-05-20", active: true, clients: 987, activeSince: "2022-05-20", plan: "Enterprise", apiUsage: "980K calls", revenue: "₹1.18L" },
  { id: 3, name: "Rajeshwari Tax", regDate: "2021-11-10", active: false, clients: 842, activeSince: null, plan: "Pro", apiUsage: "750K calls", revenue: "₹98k" },
  { id: 4, name: "Verma Consultants", regDate: "2023-03-05", active: true, clients: 765, activeSince: "2023-03-05", plan: "Basic", apiUsage: "620K calls", revenue: "₹89k" },
  { id: 5, name: "Singh Brothers", regDate: "2022-09-18", active: true, clients: 698, activeSince: "2022-09-18", plan: "Pro", apiUsage: "580K calls", revenue: "₹76k" },
  { id: 6, name: "Patel Advisors", regDate: "2024-02-22", active: false, clients: 550, activeSince: null, plan: "Basic", apiUsage: "450K calls", revenue: "₹65k" },
  { id: 7, name: "Khan & Partners", regDate: "2021-07-30", active: true, clients: 620, activeSince: "2021-07-30", plan: "Enterprise", apiUsage: "700K calls", revenue: "₹82k" },
  { id: 8, name: "Agarwal Ltd", regDate: "2023-04-12", active: true, clients: 450, activeSince: "2023-04-12", plan: "Pro", apiUsage: "400K calls", revenue: "₹55k" },
  { id: 9, name: "Mehta Group", regDate: "2022-12-01", active: false, clients: 300, activeSince: null, plan: "Basic", apiUsage: "250K calls", revenue: "₹40k" },
  { id: 10, name: "Reddy Consultants", regDate: "2024-01-05", active: true, clients: 800, activeSince: "2024-01-05", plan: "Enterprise", apiUsage: "850K calls", revenue: "₹95k" },
  { id: 11, name: "Chopra & Sons", regDate: "2021-06-15", active: true, clients: 950, activeSince: "2021-06-15", plan: "Pro", apiUsage: "900K calls", revenue: "₹1.05L" },
  { id: 12, name: "Das Associates", regDate: "2023-08-20", active: false, clients: 400, activeSince: null, plan: "Basic", apiUsage: "350K calls", revenue: "₹50k" },
  { id: 13, name: "Fernandez Tax", regDate: "2022-03-10", active: true, clients: 1100, activeSince: "2022-03-10", plan: "Enterprise", apiUsage: "1.1M calls", revenue: "₹1.25L" },
  { id: 14, name: "Iyer Advisors", regDate: "2024-05-25", active: true, clients: 600, activeSince: "2024-05-25", plan: "Pro", apiUsage: "550K calls", revenue: "₹70k" },
  { id: 15, name: "Joshi Partners", regDate: "2021-09-05", active: false, clients: 500, activeSince: null, plan: "Basic", apiUsage: "450K calls", revenue: "₹60k" },
  { id: 16, name: "Kapoor & Co", regDate: "2023-11-15", active: true, clients: 1200, activeSince: "2023-11-15", plan: "Enterprise", apiUsage: "1.15M calls", revenue: "₹1.35L" },
  { id: 17, name: "Lalwani Group", regDate: "2022-07-22", active: true, clients: 700, activeSince: "2022-07-22", plan: "Pro", apiUsage: "650K calls", revenue: "₹80k" },
  { id: 18, name: "Malhotra Consultants", regDate: "2024-03-01", active: false, clients: 350, activeSince: null, plan: "Basic", apiUsage: "300K calls", revenue: "₹45k" },
  { id: 19, name: "Nair Tax", regDate: "2021-12-10", active: true, clients: 850, activeSince: "2021-12-10", plan: "Enterprise", apiUsage: "800K calls", revenue: "₹1.00L" },
  { id: 20, name: "Oberoi Advisors", regDate: "2023-02-18", active: true, clients: 1000, activeSince: "2023-02-18", plan: "Pro", apiUsage: "950K calls", revenue: "₹1.10L" },
  // Add more if needed for larger pagination demo
];

// Mock clients based on firms
const mockClients = mockFirms.flatMap(firm => 
  Array.from({ length: firm.clients }, (_, i) => ({
    id: `${firm.id}-${i + 1}`,
    name: `Client ${i + 1} of ${firm.name}`,
    regDate: firm.regDate,
    firm: firm.name,
  }))
);

// Mock API logs with status for success/failure
const mockApiLogs = [
  { id: 1, api: "/gst/verify", timestamp: "2025-12-17 10:15:23", timeTaken: "250ms", speed: "Fast", status: "Success" },
  { id: 2, api: "/gst/file", timestamp: "2025-12-17 10:20:45", timeTaken: "420ms", speed: "Medium", status: "Success" },
  { id: 3, api: "/gst/status", timestamp: "2025-12-17 10:25:12", timeTaken: "150ms", speed: "Fast", status: "Success" },
  { id: 4, api: "/gst/verify", timestamp: "2025-12-17 10:30:34", timeTaken: "800ms", speed: "Slow", status: "Failed" },
  { id: 5, api: "/gst/file", timestamp: "2025-12-17 10:35:56", timeTaken: "300ms", speed: "Fast", status: "Success" },
  { id: 6, api: "/gst/status", timestamp: "2025-12-17 10:40:12", timeTaken: "950ms", speed: "Slow", status: "Failed" },
  { id: 7, api: "/gst/verify", timestamp: "2025-12-17 10:45:34", timeTaken: "200ms", speed: "Fast", status: "Success" },
  // Add more logs as needed
];

// Mock reports data for View All Reports
const mockReports = [
  { id: 1, name: "Monthly Revenue Report", date: "2025-12-01", type: "PDF", data: "Revenue details..." },
  { id: 2, name: "API Usage Summary", date: "2025-12-05", type: "PDF", data: "API calls overview..." },
  { id: 3, name: "Firm Activity Log", date: "2025-12-10", type: "PDF", data: "Firm actions..." },
  // Add more
];

// Mock Security Alerts
const mockSecurityAlerts = [
  { id: 1, type: "Suspicious Login", time: "2025-12-17 09:45:00", ip: "192.168.1.100", description: "Unrecognized device from unknown location" },
  { id: 2, type: "API Rate Limit Exceeded", time: "2025-12-17 10:05:00", ip: "192.168.1.101", description: "Excessive calls from single IP" },
  { id: 3, type: "Invalid API Key", time: "2025-12-17 10:15:00", ip: "192.168.1.102", description: "Attempted access with expired key" },
  { id: 4, type: "Data Breach Attempt", time: "2025-12-17 10:25:00", ip: "192.168.1.103", description: "SQL injection detected" },
  { id: 5, type: "Unauthorized Access", time: "2025-12-17 10:35:00", ip: "192.168.1.104", description: "Failed admin login attempts" },
  { id: 6, type: "DDoS Alert", time: "2025-12-17 10:45:00", ip: "Multiple", description: "High traffic from various sources" },
  { id: 7, type: "Malware Detection", time: "2025-12-17 10:55:00", ip: "192.168.1.105", description: "Suspicious file upload" },
];

export default function App() {
  const [audience, setAudience] = useState("All CA Firms");
  const [message, setMessage] = useState("");
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addFirmModalOpen, setAddFirmModalOpen] = useState(false);
  const [manageFirmsModalOpen, setManageFirmsModalOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [apiMonitorModalOpen, setApiMonitorModalOpen] = useState(false);
  const [allFirmsModalOpen, setAllFirmsModalOpen] = useState(false);
  const [top10ModalOpen, setTop10ModalOpen] = useState(false);
  const [apiDetailsModalOpen, setApiDetailsModalOpen] = useState(false);
  const [newFirm, setNewFirm] = useState({ name: "", email: "", plan: "Basic", apiKey: "", password: "" });
  const [firmsPage, setFirmsPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const firmsPerPage = 10;

  const showToast = (text, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const sendMessage = () => {
    if (!message.trim()) {
      showToast("Message cannot be empty!", "error");
      return;
    }
    showToast(`Sending to ${audience}...`, "info");
    setTimeout(() => {
      showToast("Message sent successfully!", "success");
      setMessage("");
    }, 500); // Sped up from 1500 to 500ms
  };

  // Calculate stats from mock data
  const totalFirms = mockFirms.length;
  const activeFirms = mockFirms.filter(f => f.active).length;
  const totalClients = mockFirms.reduce((sum, f) => sum + f.clients, 0);

  const handleStatClick = (type) => {
    setSelectedStat(type);
    setSearchQuery("");
  };

  const getFilteredData = () => {
    let data = [];
    let columns = [];
    if (selectedStat === "totalFirms") {
      data = mockFirms;
      columns = ["Name", "Registration Date"];
    } else if (selectedStat === "activeFirms") {
      data = mockFirms.filter(f => f.active);
      columns = ["Name", "Active Since", "Clients"];
    } else if (selectedStat === "totalClients") {
      data = mockClients;
      columns = ["Name", "Firm", "Registration Date"];
    }

    if (searchQuery) {
      data = data.filter(item => 
        Object.values(item).some(val => 
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return { data, columns };
  };

  const { data: statData, columns: statColumns } = getFilteredData();

  // Add New Firm Handler
  const handleAddFirm = () => {
    if (!newFirm.name || !newFirm.email || !newFirm.plan || !newFirm.apiKey || !newFirm.password) {
      showToast("All fields are required!", "error");
      return;
    }
    showToast("New Firm Added Successfully!", "success");
    setAddFirmModalOpen(false);
    setNewFirm({ name: "", email: "", plan: "Basic", apiKey: "", password: "" });
  };

  // Pagination for All Firms Modal
  const paginatedFirms = mockFirms.slice((firmsPage - 1) * firmsPerPage, firmsPage * firmsPerPage);
  const totalPages = Math.ceil(mockFirms.length / firmsPerPage);

  // Top 10 Firms - Sorted by clients descending
  const top10Firms = [...mockFirms].sort((a, b) => b.clients - a.clients).slice(0, 10);

  // API Stats Calculations
  const successCount = mockApiLogs.filter(log => log.status === "Success").length;
  const failureCount = mockApiLogs.length - successCount;
  const successRate = ((successCount / mockApiLogs.length) * 100).toFixed(1);
  const failedApis = mockApiLogs.filter(log => log.status === "Failed");
  const avgResponse = mockApiLogs.reduce((sum, log) => sum + parseInt(log.timeTaken), 0) / mockApiLogs.length + "ms";

  // Pie Chart Data for Success Rate
  const pieData = [
    { name: 'Success', value: parseFloat(successRate) },
    { name: 'Failure', value: 100 - parseFloat(successRate) },
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="main">
      {/* Header - Removed filters */}
      <div className="header admin-header">
        <div>
          <h1>SmartGST - Super Admin Panel</h1>
          <p className="firm-name">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="header-right">
          <div className="revenue">
            <strong>₹84.6 Lakh</strong> <span className="up">↑ 28%</span>
          </div>
        </div>
      </div>

      {/* Removed Quick Upload */}

      {/* Stats */}
      <div className="stats stats-admin">
        <div className="box clickable" onClick={() => handleStatClick("totalFirms")}>
          <h3>{totalFirms}</h3><p>Total CA Firms</p>
        </div>
        <div className="box clickable" onClick={() => handleStatClick("activeFirms")}>
          <h3>{activeFirms}</h3><p>Active</p>
        </div>
        <div className="box highlight clickable" onClick={() => handleStatClick("totalClients")}>
          <h3>{totalClients.toLocaleString()}</h3><p>Total Clients</p>
        </div>
        <div className="box clickable" onClick={() => setApiDetailsModalOpen(true)}>
          <h3>4.82M</h3><p>API Calls Today</p>
        </div>
      </div>

      <div className="grid">
        {/* Quick Actions + Notification */}
        <div className="card">
          <h3>Quick Actions</h3>
          <div className="btns">
            <button onClick={() => setAddFirmModalOpen(true)}>Add New CA Firm</button>
            <button onClick={() => setManageFirmsModalOpen(true)}>Manage Firms</button>
            <button onClick={() => setReportsModalOpen(true)}>View All Reports</button>
            <button onClick={() => setApiMonitorModalOpen(true)}>API Monitor</button>
          </div>
          <div className="notify">
            <h4>Send Global Notification</h4>
            <select value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option>All CA Firms</option>
              <option>Active Only</option>
              <option>Expired Only</option>
              <option>Inactive Firms</option>
            </select>
            <textarea
              placeholder="Type message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
            />
            <div className="send-btns">
              <button className="wa" onClick={sendMessage}>Send WhatsApp</button>
              <button className="em" onClick={sendMessage}>Send Email</button>
            </div>
          </div>
        </div>

        {/* Firms Table (Top 5 shown) */}
        <div className="card wide">
          <div className="tophead">
            <h3>Firms</h3>
            <div>
              <button className="top10" onClick={() => setTop10ModalOpen(true)}>
                View Top 10 →
              </button>
              <button className="top10" style={{marginLeft: '10px'}} onClick={() => setAllFirmsModalOpen(true)}>
                All Firms →
              </button>
            </div>
          </div>
          <table className="recent-audits">
            <thead>
              <tr><th>#</th><th>Firm Name</th><th>Clients</th><th>Revenue/Mo</th></tr>
            </thead>
            <tbody>
              {mockFirms.slice(0, 5).map((firm, index) => (
                <tr
                  key={firm.id}
                  className="clickable"
                  onClick={() => setSelectedFirm(firm)}
                >
                  <td>{index + 1}</td>
                  <td>{firm.name}</td>
                  <td>{firm.clients.toLocaleString()}</td>
                  <td>{firm.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Selected Firm Drawer */}
          {selectedFirm && (
            <div className="drawer">
              <div className="drawer-header">
                <h3>{selectedFirm.name}</h3>
                <button className="close-drawer" onClick={() => setSelectedFirm(null)}>×</button>
              </div>
              <div className="drawer-content">
                <p><strong>Plan:</strong> <span style={{color: '#7c3aed', fontWeight: 'bold'}}>{selectedFirm.plan}</span></p>
                <p><strong>Clients:</strong> {selectedFirm.clients.toLocaleString()}</p>
                <p><strong>Monthly Revenue:</strong> {selectedFirm.revenue}</p>
                <p><strong>API Usage:</strong> {selectedFirm.apiUsage}</p>
                <p><strong>Reg Date:</strong> {selectedFirm.regDate}</p>
                <p><strong>Active:</strong> {selectedFirm.active ? 'Yes' : 'No'}</p>
              </div>
              <div className="drawer-btns">
                <button className="danger" onClick={() => showToast("Firm Disabled", "error")}>
                  Disable Firm
                </button>
                <button onClick={() => showToast("API Key Reset", "info")}>
                  Reset API Key
                </button>
                <button className="secondary" onClick={() => setSelectedFirm(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Firm Modal */}
      {addFirmModalOpen && (
        <div className="modal-overlay" onClick={() => setAddFirmModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New CA Firm</h3>
              <button className="close-drawer" onClick={() => setAddFirmModalOpen(false)}>×</button>
            </div>
            <div className="form">
              <label>Firm Name</label>
              <input value={newFirm.name} onChange={(e) => setNewFirm({...newFirm, name: e.target.value})} />
              <label>Email</label>
              <input type="email" value={newFirm.email} onChange={(e) => setNewFirm({...newFirm, email: e.target.value})} />
              <label>Plan</label>
              <select value={newFirm.plan} onChange={(e) => setNewFirm({...newFirm, plan: e.target.value})}>
                <option>Basic</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
              
              <label>Password</label>
              <input type="password" value={newFirm.password} onChange={(e) => setNewFirm({...newFirm, password: e.target.value})} />
              <button onClick={handleAddFirm}>Add Firm</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Firms Modal */}
      {manageFirmsModalOpen && (
        <div className="modal-overlay" onClick={() => setManageFirmsModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Firms</h3>
              <button className="close-drawer" onClick={() => setManageFirmsModalOpen(false)}>×</button>
            </div>
            
            <table className="recent-audits">
              <thead>
                <tr><th>Name</th><th>Plan</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {mockFirms.map(firm => (
                  <tr key={firm.id}>
                    <td>{firm.name}</td>
                    <td>{firm.plan}</td>
                    <td>
                      <button onClick={() => showToast(`Edit ${firm.name}`)}>Edit</button>
                      <button className="danger" onClick={() => showToast(`Disable ${firm.name}`, "error")}>Disable</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View All Reports Modal */}
      {reportsModalOpen && (
        <div className="modal-overlay" onClick={() => setReportsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>View All Reports</h3>
              <button className="close-drawer" onClick={() => setReportsModalOpen(false)}>×</button>
            </div>
            <table className="recent-audits">
              <thead>
                <tr><th>Report Name</th><th>Date</th><th>Type</th><th>Action</th></tr>
              </thead>
              <tbody>
                {mockReports.map(report => (
                  <tr key={report.id}>
                    <td>{report.name}</td>
                    <td>{report.date}</td>
                    <td>{report.type}</td>
                    <td><button onClick={() => showToast(`Downloading ${report.name}.pdf`)}>Download PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API Monitor Modal with Chart */}
      {apiMonitorModalOpen && (
        <div className="modal-overlay" onClick={() => setApiMonitorModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>API Monitor</h3>
              <button className="close-drawer" onClick={() => setApiMonitorModalOpen(false)}>×</button>
            </div>
            <div style={{ height: "300px", marginBottom: "20px" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ textAlign: "center", marginTop: "-150px" }}>
                <h2>{successRate}%</h2>
                <p>Success Rate</p>
              </div>
            </div>
            <p>Avg Response: {avgResponse} | Failures: {failureCount}</p>
            <h4>Failed APIs:</h4>
            <ul>
              {failedApis.map(log => (
                <li key={log.id}>{log.api} at {log.timestamp} ({log.timeTaken})</li>
              ))}
            </ul>
            <table className="recent-audits">
              <thead>
                <tr><th>API Endpoint</th><th>Timestamp</th><th>Time Taken</th><th>Speed</th><th>Status</th></tr>
              </thead>
              <tbody>
                {mockApiLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.api}</td>
                    <td>{log.timestamp}</td>
                    <td>{log.timeTaken}</td>
                    <td>{log.speed}</td>
                    <td>{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Firms Modal with Pagination and Search */}
      {allFirmsModalOpen && (
        <div className="modal-overlay" onClick={() => setAllFirmsModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>All Firms</h3>
              <button className="close-drawer" onClick={() => setAllFirmsModalOpen(false)}>×</button>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search firms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <table className="recent-audits">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Clients</th><th>Revenue</th><th>Plan</th></tr>
              </thead>
              <tbody>
                {paginatedFirms
                  .filter(firm => firm.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(firm => (
                    <tr key={firm.id} className="clickable" onClick={() => setSelectedFirm(firm)}>
                      <td>{firm.id}</td>
                      <td>{firm.name}</td>
                      <td>{firm.clients.toLocaleString()}</td>
                      <td>{firm.revenue}</td>
                      <td>{firm.plan}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="pagination">
              <button disabled={firmsPage === 1} onClick={() => setFirmsPage(p => p - 1)}>Prev</button>
              <span>Page {firmsPage} of {totalPages}</span>
              <button disabled={firmsPage === totalPages} onClick={() => setFirmsPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Top 10 Firms Modal */}
      {top10ModalOpen && (
        <div className="modal-overlay" onClick={() => setTop10ModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Top 10 Firms (by Clients)</h3>
              <button className="close-drawer" onClick={() => setTop10ModalOpen(false)}>×</button>
            </div>
            <table className="recent-audits">
              <thead>
                <tr><th>#</th><th>Name</th><th>Clients</th><th>Revenue</th><th>Plan</th></tr>
              </thead>
              <tbody>
                {top10Firms.map((firm, index) => (
                  <tr key={firm.id} className="clickable" onClick={() => setSelectedFirm(firm)}>
                    <td>{index + 1}</td>
                    <td>{firm.name}</td>
                    <td>{firm.clients.toLocaleString()}</td>
                    <td>{firm.revenue}</td>
                    <td>{firm.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stat Details Modal */}
      {selectedStat && (
        <div className="modal-overlay" onClick={() => setSelectedStat(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedStat === "totalFirms" ? "All CA Firms" :
                 selectedStat === "activeFirms" ? "Active Firms" :
                 "Total Clients"}
              </h3>
              <button className="close-drawer" onClick={() => setSelectedStat(null)}>×</button>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <table className="recent-audits">
              <thead>
                <tr>
                  {statColumns.map((col, i) => <th key={i}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {statData.map((item, idx) => (
                  <tr key={idx}>
                    {selectedStat === "totalFirms" && (
                      <>
                        <td>{item.name}</td>
                        <td>{item.regDate}</td>
                      </>
                    )}
                    {selectedStat === "activeFirms" && (
                      <>
                        <td>{item.name}</td>
                        <td>{item.activeSince || "N/A"}</td>
                        <td>{item.clients}</td>
                      </>
                    )}
                    {selectedStat === "totalClients" && (
                      <>
                        <td>{item.name}</td>
                        <td>{item.firm}</td>
                        <td>{item.regDate}</td>
                      </>
                    )}
                  </tr>
                ))}
                {statData.length === 0 && (
                  <tr><td colSpan={statColumns.length}>No results found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}