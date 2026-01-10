// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import "../App.css";

export default function AdminDashboard() {
  const [audience, setAudience] = useState("All Team Members");
  const [message, setMessage] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // All Modal States
  const [showManageClients, setShowManageClients] = useState(false);
  const [showManageStaff, setShowManageStaff] = useState(false);
  const [showFilingCenter, setShowFilingCenter] = useState(false);
  const [showFiledThisMonth, setShowFiledThisMonth] = useState(false);
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [showDownloadReports, setShowDownloadReports] = useState(false);
  const [showViewDocuments, setShowViewDocuments] = useState(false);
  const [showComplianceDetails, setShowComplianceDetails] = useState(false);

  // Calendar Navigation
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Sample Data
  const [clientsData, setClientsData] = useState([
    { gstin: "27AAACC1206D1ZM", name: "ABC Industries Pvt Ltd", regDate: "15 Jun 2022" },
    { gstin: "29AABCU9603R1ZB", name: "XYZ Traders", regDate: "02 Jan 2023" },
    { gstin: "06AAECF8579K1ZB", name: "Tech Solutions Ltd", regDate: "20 Mar 2021" },
    { gstin: "24AAHCB8281F1ZO", name: "Retail Mart", regDate: "10 Oct 2024" },
  ]);

  const [staffData, setStaffData] = useState([
    { name: "Rahul Sharma", role: "Senior Accountant", email: "rahul@sharma.co", status: "Active", lastActive: "2 hours ago" },
    { name: "Priya Mehta", role: "Auditor", email: "priya@sharma.co", status: "Active", lastActive: "Online now" },
    { name: "Amit Patel", role: "Junior Accountant", email: "amit@sharma.co", status: "Inactive", lastActive: "Yesterday" },
  ]);

  // Editing States
  const [editingClientIndex, setEditingClientIndex] = useState(null);
  const [editingStaffIndex, setEditingStaffIndex] = useState(null);
  const [tempClientData, setTempClientData] = useState({});
  const [tempStaffData, setTempStaffData] = useState({});

  // Static Data
  const filedThisMonthData = [
    { gstin: "06AAECF8579K1ZB", client: "Tech Solutions Ltd", return: "GSTR-1", filedDate: "11 Dec 2025" },
    { gstin: "27AAACC1206D1ZM", client: "ABC Industries Pvt Ltd", return: "GSTR-3B", filedDate: "20 Dec 2025" },
    { gstin: "29AABCU9603R1ZB", client: "XYZ Traders", return: "GSTR-1", filedDate: "11 Dec 2025" },
  ];

  const filingCenterData = [
    { gstin: "27AAACC1206D1ZM", client: "ABC Industries Pvt Ltd", return: "GSTR-1", filedDate: "Pending" },
    { gstin: "29AABCU9603R1ZB", client: "XYZ Traders", return: "GSTR-3B", filedDate: "-" },
    { gstin: "06AAECF8579K1ZB", client: "Tech Solutions Ltd", return: "GSTR-1", filedDate: "11 Dec 2025" },
  ];

  const documentsData = [
    { month: "December 2025", date: "11 Dec", name: "GSTR-1 Report - ABC Industries", type: "PDF" },
    { month: "December 2025", date: "20 Dec", name: "GSTR-3B Summary", type: "PDF" },
    { month: "November 2025", date: "20 Nov", name: "GSTR-3B Summary", type: "PDF" },
  ];

  const dueDates = [
    { date: 11, return: "GSTR-1", clients: 487, status: "Pending" },
    { date: 20, return: "GSTR-3B", clients: 1112, status: "In Progress" },
    { date: 25, return: "GSTR-1 (QRMP)", clients: 89, status: "Filed" },
    { date: 31, return: "GSTR-9 / 9C", clients: 23, status: "Overdue" },
  ];

  const showToast = (text, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  };

  const sendNotification = () => {
    if (!message.trim()) {
      showToast("Message cannot be empty!", "error");
      return;
    }
    showToast(`Sending to ${audience}...`, "info");
    setTimeout(() => {
      showToast("Notification sent successfully!", "success");
      setMessage("");
    }, 1500);
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleUpload = (closeModal) => {
    showToast("Files uploaded & processing started!", "success");
    closeModal(false);
  };

  // Client Editing
  const startEditingClient = (index) => {
    setEditingClientIndex(index);
    setTempClientData({ ...clientsData[index] });
  };
  const cancelEditingClient = () => {
    setEditingClientIndex(null);
    setTempClientData({});
  };
  const saveClient = (index) => {
    const updated = [...clientsData];
    updated[index] = tempClientData;
    setClientsData(updated);
    setEditingClientIndex(null);
    setTempClientData({});
    showToast("Client updated successfully!", "success");
  };
  const removeClient = (index) => {
    if (window.confirm("Are you sure you want to remove this client?")) {
      setClientsData(clientsData.filter((_, i) => i !== index));
      showToast("Client removed!", "info");
    }
  };

  // Staff Editing
  const startEditingStaff = (index) => {
    setEditingStaffIndex(index);
    setTempStaffData({ ...staffData[index] });
  };
  const cancelEditingStaff = () => {
    setEditingStaffIndex(null);
    setTempStaffData({});
  };
  const saveStaff = (index) => {
    const updated = [...staffData];
    updated[index] = { ...tempStaffData, status: tempStaffData.status || updated[index].status, lastActive: updated[index].lastActive };
    setStaffData(updated);
    setEditingStaffIndex(null);
    setTempStaffData({});
    showToast("Staff member updated successfully!", "success");
  };
  const removeStaff = (index) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      setStaffData(staffData.filter((_, i) => i !== index));
      showToast("Staff removed!", "info");
    }
  };

  return (
    <div className="main">
      {/* Header */}
      <div className="header admin-header">
        <div>
          <h1>SmartGST - Admin Panel</h1>
          <p className="firm-name">Sharma & Co Chartered Accountants</p>
          <p>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <div className="revenue">
          <strong>₹1.42 Lakh</strong> <span className="up">18% this month</span>
          <br />
          <small style={{ opacity: 0.9 }}>Yearly Plan Active till 14 Mar 2026</small>
        </div>
      </div>

      {/* Stats */}
      <div className="stats stats-admin">
        <div className="box clickable" onClick={() => setShowManageClients(true)}>
          <h3>1,248</h3><p>Total GST Clients</p>
        </div>
        <div className="box clickable" onClick={() => setShowFiledThisMonth(true)}>
          <h3>842</h3><p>GSTR Filed This Month</p>
        </div>
        <div className="box highlight clickable" onClick={() => setShowComplianceDetails(true)}>
          <h3>96.8%</h3><p>Compliance Score</p>
        </div>
        <div className="box clickable" onClick={() => setShowManageStaff(true)}>
          <h3>28</h3><p>Active Staff Members</p>
        </div>
      </div>

      {/* Quick Upload */}
      <div className="quick-upload">
        <h3>Upload Purchase Bills / Invoices</h3>
        <p>Upload PDF or images → Auto extract data & update GST ledger</p>
        <button onClick={() => setShowUploadModal(true)}>Upload PDF / Image Files</button>
      </div>

      <div className="grid">
        {/* Quick Actions */}
        <div className="card">
          <h3>Quick Actions</h3>
          <div className="btns">
            <button onClick={() => setShowManageClients(true)}>Manage Clients</button>
            <button onClick={() => setShowManageStaff(true)}>Manage Staff</button>
            <button onClick={() => setShowFilingCenter(true)}>GST Filing Center</button>
            <button onClick={() => setShowAddVoucher(true)}>Add Voucher / Invoice</button>
            <button onClick={() => setShowDownloadReports(true)}>Download Reports</button>
            <button onClick={() => setShowViewDocuments(true)}>View Documents</button>
          </div>

          <div className="notify">
            <h4>Send Team Notification</h4>
            <select value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option>All Team Members</option>
              <option>Accountants Only</option>
              <option>Auditors Only</option>
              <option>Specific Staff</option>
            </select>
            <textarea placeholder="Send reminder or update to your team..." value={message} onChange={(e) => setMessage(e.target.value)} rows="4" />
            <div className="send-btns">
              <button className="wa" onClick={sendNotification}>Send WhatsApp</button>
              <button className="em" onClick={sendNotification}>Send Email</button>
            </div>
          </div>
        </div>

        {/* Upcoming Due Dates */}
        <div className="card">
          <div className="tophead">
            <h3>Upcoming GST Due Dates</h3>
            <button className="top10" onClick={() => setShowCalendar(true)}>View Full Calendar</button>
          </div>
          <table className="recent-audits">
            <thead>
              <tr><th>GSTIN</th><th>Return</th><th>Due Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>27AAACC1206D1ZM</td><td>GSTR-1</td><td>11 Dec 2025</td><td style={{color:"#f59e0b",fontWeight:"bold"}}>Pending</td></tr>
              <tr><td>29AABCU9603R1ZB</td><td>GSTR-3B</td><td>20 Dec 2025</td><td style={{color:"#10b981",fontWeight:"bold"}}>Ready</td></tr>
              <tr><td>06AAECF8579K1ZB</td><td>GSTR-1</td><td>11 Dec 2025</td><td style={{color:"#10b981",fontWeight:"bold"}}>Filed</td></tr>
              <tr><td>24AAHCB8281F1ZO</td><td>GSTR-3B</td><td>20 Dec 2025</td><td style={{color:"#ef4444",fontWeight:"bold"}}>Missing Docs</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== ALL MODALS ==================== */}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: "#7c3aed", textAlign: "center", marginBottom: "20px" }}>Upload Bills / Invoices</h2>
            <p style={{ textAlign: "center", color: "#555", marginBottom: "20px" }}>Supported: PDF, JPG, PNG (Multiple files allowed)</p>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple style={{ width: "100%", padding: "25px", border: "3px dashed #7c3aed", borderRadius: "12px", background: "#faf5ff" }} />
            <div style={{ textAlign: "right", marginTop: "30px" }}>
              <button onClick={() => handleUpload(setShowUploadModal)} style={{ padding: "14px 40px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold" }}>
                Upload & Extract Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Calendar Modal */}
      {showCalendar && (
        <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <button onClick={goToPrevMonth} style={{ padding: "10px 20px", background: "#e9d5ff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>‹ Previous</button>
              <h2 style={{ color: "#7c3aed", fontSize: "2rem" }}>{monthNames[currentMonth]} {currentYear}</h2>
              <button onClick={goToNextMonth} style={{ padding: "10px 20px", background: "#e9d5ff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Next ›</button>
            </div>
            <table>
              <thead>
                <tr><th>Date</th><th>Return</th><th>Clients</th><th>Status</th></tr>
              </thead>
              <tbody>
                {dueDates.map((d, i) => (
                  <tr key={i}>
                    <td>{d.date} {monthNames[currentMonth]}</td>
                    <td>{d.return}</td>
                    <td>{d.clients}</td>
                    <td style={{ fontWeight: "bold", color: d.status === "Filed" ? "#10b981" : d.status === "Pending" ? "#f59e0b" : d.status === "Overdue" ? "#ef4444" : "#6366f1" }}>
                      {d.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button onClick={() => setShowCalendar(false)} style={{ padding: "14px 50px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px" }}>
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Clients */}
      {showManageClients && (
        <div className="modal-overlay" onClick={() => setShowManageClients(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Total GST Clients ({clientsData.length})</h2>
              <button className="close-drawer" onClick={() => setShowManageClients(false)}>×</button>
            </div>
            <table>
              <thead><tr><th>GSTIN</th><th>Client Name</th><th>Reg Date</th><th>Actions</th></tr></thead>
              <tbody>
                {clientsData.map((client, index) => (
                  <tr key={index}>
                    {editingClientIndex === index ? (
                      <>
                        <td><input type="text" value={tempClientData.gstin || ''} onChange={(e) => setTempClientData({...tempClientData, gstin: e.target.value})} style={{width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #ccc"}} /></td>
                        <td><input type="text" value={tempClientData.name || ''} onChange={(e) => setTempClientData({...tempClientData, name: e.target.value})} style={{width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #ccc"}} /></td>
                        <td><input type="text" value={tempClientData.regDate || ''} onChange={(e) => setTempClientData({...tempClientData, regDate: e.target.value})} style={{width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #ccc"}} /></td>
                        <td>
                          <button onClick={() => saveClient(index)} style={{marginRight:"8px", padding:"6px 12px", background:"#10b981", color:"white", border:"none", borderRadius:"8px"}}>Save</button>
                          <button onClick={cancelEditingClient} style={{padding:"6px 12px", background:"#6b7280", color:"white", border:"none", borderRadius:"8px"}}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{client.gstin}</td>
                        <td>{client.name}</td>
                        <td>{client.regDate}</td>
                        <td>
                          <button onClick={() => startEditingClient(index)} style={{marginRight:"8px", padding:"6px 12px", background:"#7c3aed", color:"white", border:"none", borderRadius:"8px"}}>Edit</button>
                          <button onClick={() => removeClient(index)} style={{padding:"6px 12px", background:"#ef4444", color:"white", border:"none", borderRadius:"8px"}}>Remove</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Staff */}
      {showManageStaff && (
        <div className="modal-overlay" onClick={() => setShowManageStaff(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Active Staff Members ({staffData.length})</h2>
              <button className="close-drawer" onClick={() => setShowManageStaff(false)}>×</button>
            </div>
            <table>
              <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Last Active</th><th>Actions</th></tr></thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={index}>
                    {editingStaffIndex === index ? (
                      <>
                        <td><input type="text" value={tempStaffData.name || ''} onChange={(e) => setTempStaffData({...tempStaffData, name: e.target.value})} style={{width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #ccc"}} /></td>
                        <td><input type="text" value={tempStaffData.role || ''} onChange={(e) => setTempStaffData({...tempStaffData, role: e.target.value})} style={{width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #ccc"}} /></td>
                        <td><input type="email" value={tempStaffData.email || ''} onChange={(e) => setTempStaffData({...tempStaffData, email: e.target.value})} style={{width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #ccc"}} /></td>
                        <td style={{color: staff.status === "Active" ? "#10b981" : "#ef4444", fontWeight:"bold"}}>{staff.status}</td>
                        <td>{staff.lastActive}</td>
                        <td>
                          <button onClick={() => saveStaff(index)} style={{marginRight:"8px", padding:"6px 12px", background:"#10b981", color:"white", border:"none", borderRadius:"8px"}}>Save</button>
                          <button onClick={cancelEditingStaff} style={{padding:"6px 12px", background:"#6b7280", color:"white", border:"none", borderRadius:"8px"}}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{staff.name}</td>
                        <td>{staff.role}</td>
                        <td>{staff.email}</td>
                        <td style={{color: staff.status === "Active" ? "#10b981" : "#ef4444", fontWeight:"bold"}}>{staff.status}</td>
                        <td>{staff.lastActive}</td>
                        <td>
                          <button onClick={() => startEditingStaff(index)} style={{marginRight:"8px", padding:"6px 12px", background:"#7c3aed", color:"white", border:"none", borderRadius:"8px"}}>Edit</button>
                          <button onClick={() => removeStaff(index)} style={{padding:"6px 12px", background:"#ef4444", color:"white", border:"none", borderRadius:"8px"}}>Remove</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GST Filing Center */}
      {showFilingCenter && (
        <div className="modal-overlay" onClick={() => setShowFilingCenter(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>GST Filing Center</h2>
              <button className="close-drawer" onClick={() => setShowFilingCenter(false)}>×</button>
            </div>
            <table>
              <thead><tr><th>GSTIN</th><th>Client</th><th>Return</th><th>Status / Filed Date</th></tr></thead>
              <tbody>
                {filingCenterData.map((f, i) => (
                  <tr key={i}>
                    <td>{f.gstin}</td>
                    <td>{f.client}</td>
                    <td>{f.return}</td>
                    <td>{f.filedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filed This Month */}
      {showFiledThisMonth && (
        <div className="modal-overlay" onClick={() => setShowFiledThisMonth(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>GSTR Filed This Month (842)</h2>
              <button className="close-drawer" onClick={() => setShowFiledThisMonth(false)}>×</button>
            </div>
            <table>
              <thead><tr><th>GSTIN</th><th>Client Name</th><th>Return</th><th>Filed Date</th></tr></thead>
              <tbody>
                {filedThisMonthData.map((f, i) => (
                  <tr key={i}>
                    <td>{f.gstin}</td>
                    <td>{f.client}</td>
                    <td>{f.return}</td>
                    <td>{f.filedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Voucher */}
      {showAddVoucher && (
        <div className="modal-overlay" onClick={() => setShowAddVoucher(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Add Voucher / Invoice</h2>
            <p>Upload PDF/JPG files</p>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple style={{width:"100%", padding:"20px", border:"2px dashed #7c3aed", borderRadius:"12px", margin:"20px 0"}} />
            <button onClick={() => handleUpload(setShowAddVoucher)} style={{padding:"14px 40px", background:"#7c3aed", color:"white", border:"none", borderRadius:"12px"}}>
              Submit & Extract
            </button>
          </div>
        </div>
      )}

      {/* Download Reports */}
      {showDownloadReports && (
        <div className="modal-overlay" onClick={() => setShowDownloadReports(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Download Reports</h2>
              <button className="close-drawer" onClick={() => setShowDownloadReports(false)}>×</button>
            </div>
            {!selectedMonth ? (
              <div>
                <p style={{textAlign:"center", marginBottom:"20px", color:"#555"}}>Select a month to download reports</p>
                <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", padding: "10px"}}>
                  {monthNames.map((month, index) => {
                    const year = currentYear - (currentMonth > index ? 1 : 0);
                    return (
                      <div key={month} onClick={() => setSelectedMonth({ name: month, index, year })}
                        style={{padding: "20px", background: "#f3e8ff", borderRadius: "12px", textAlign: "center", cursor: "pointer", fontWeight: "600", color: "#6b21a8", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", transition: "all 0.2s"}}
                        onMouseEnter={e => e.currentTarget.style.background = "#e9d5ff"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f3e8ff"}>
                        {month} {year}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px"}}>
                  <button onClick={() => setSelectedMonth(null)} style={{background:"none", border:"none", fontSize:"1.5rem", cursor:"pointer", color:"#7c3aed"}}>← Back</button>
                  <h3 style={{margin:0, color:"#7c3aed"}}>{selectedMonth.name} {selectedMonth.year}</h3>
                  <div style={{width:"40px"}}></div>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "12px", padding: "10px", maxHeight: "60vh", overflowY: "auto"}}>
                  {Array.from({ length: daysInMonth[selectedMonth.index] }, (_, i) => i + 1).map(day => {
                    const dateStr = `${day} ${selectedMonth.name.substring(0,3)} ${selectedMonth.year}`;
                    return (
                      <button key={day} onClick={() => {
                        showToast(`Downloading reports for ${dateStr}...`, "info");
                        setTimeout(() => showToast(`Reports for ${dateStr} downloaded!`, "success"), 1500);
                      }}
                      style={{padding: "16px", background: "#e9d5ff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", color: "#6b21a8", transition: "all 0.2s"}}
                      onMouseEnter={e => e.currentTarget.style.background = "#d8b4fe"}
                      onMouseLeave={e => e.currentTarget.style.background = "#e9d5ff"}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Documents */}
      {showViewDocuments && (
        <div className="modal-overlay" onClick={() => setShowViewDocuments(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>View Documents</h2>
              <button className="close-drawer" onClick={() => setShowViewDocuments(false)}>×</button>
            </div>
            <table>
              <thead><tr><th>Month</th><th>Date</th><th>Report Name</th><th>Type</th><th>Action</th></tr></thead>
              <tbody>
                {documentsData.map((d, i) => (
                  <tr key={i}>
                    <td>{d.month}</td>
                    <td>{d.date}</td>
                    <td>{d.name}</td>
                    <td>{d.type}</td>
                    <td>
                      <button onClick={() => showToast(`Downloading ${d.name}...`, "info")} style={{padding:"8px 16px", background:"#10b981", color:"white", border:"none", borderRadius:"8px"}}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Details */}
      {showComplianceDetails && (
        <div className="modal-overlay" onClick={() => setShowComplianceDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{textAlign:"center"}}>Compliance Score: 96.8%</h2>
            <div style={{textAlign:"center", margin:"40px 0"}}>
              <div style={{width:"200px", height:"200px", borderRadius:"50%", background:`conic-gradient(#10b981 0% 96.8%, #e5e7eb 96.8% 100%)`, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center"}}>
                <span style={{fontSize:"2.5rem", fontWeight:"bold", color:"#10b981"}}>96.8%</span>
              </div>
              <p style={{marginTop:"20px", fontSize:"1.2rem"}}>Excellent compliance!</p>
            </div>
            <p style={{textAlign:"center"}}>Monthly Trend</p>
            <div style={{height:"80px", background:"#f3f4f6", borderRadius:"12px", display:"flex", alignItems:"end", padding:"10px", gap:"8px"}}>
              <div style={{width:"20%", height:"80%", background:"#10b981"}}></div>
              <div style={{width:"20%", height:"85%", background:"#10b981"}}></div>
              <div style={{width:"20%", height:"96%", background:"#10b981"}}></div>
              <div style={{width:"20%", height:"90%", background:"#10b981"}}></div>
              <div style={{width:"20%", height:"88%", background:"#f59e0b"}}></div>
            </div>
            <div style={{textAlign:"center", marginTop:"30px"}}>
              <button onClick={() => setShowComplianceDetails(false)} style={{padding:"12px 40px", background:"#7c3aed", color:"white", border:"none", borderRadius:"12px"}}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}