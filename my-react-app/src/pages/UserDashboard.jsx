import React, { useState, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiArrowLeft, HiX, HiHome, HiMail, HiPhone } from "react-icons/hi";

import {
  HiLockClosed,      // ← add this
  HiCreditCard,
  HiUserGroup,
  HiDocumentText,
  HiFolder,
  HiChartBar,
  HiBell,
  HiCog,
  HiMoon,
  HiSun,
  HiLogout,
  HiPlus,
  HiDocumentAdd,
  HiUpload,
  HiDownload,
  HiTrash,
  HiPencil,
  HiCheckCircle,
  HiUser,
  HiCalendar,
  HiRefresh,
} from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as XLSX from "xlsx"; 

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);




function UserDashboard() {
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  const navigate = useNavigate();
    useEffect(() => {
      
      const token = localStorage.getItem("token");
      if (!token) {
         navigate("/");
      }
    }, [navigate]);
      

  

  const location = useLocation();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
    toast.success(`Dark mode ${!darkMode ? "enabled" : "disabled"}!`);
  };
  

 const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser
    ? JSON.parse(savedUser)
    : { name: "Guest", role: "User", company: "" };
     
});


  const [editProfileForm, setEditProfileForm] = useState({ ...user });

  const handleEditProfileChange = (e) => {
    setEditProfileForm({ ...editProfileForm, [e.target.name]: e.target.value });
  };

  const saveEditedProfile = () => {
    setUser(editProfileForm);
    localStorage.setItem("user", JSON.stringify(editProfileForm));  
    toast.success("Profile updated successfully!");
    setShowEditProfileModal(false);
    setShowUserDropdown(false);
  };

  const menuItems = [
  { icon: <HiHome className="sidebar-icon" />, text: "Dashboard", link: "/user" },
  { icon: <HiUserGroup className="sidebar-icon" />, text: "My Clients", link: "/user/clients" },
  // { icon: <HiDocumentText className="sidebar-icon" />, text: "Vouchers", link: "/user/vouchers" },
  { icon: <HiFolder className="sidebar-icon" />, text: "GSTR Filed", link: "/user/returns" },
  // { icon: <HiFolder className="sidebar-icon" />, text: "Documents", link: "/user/documents" },
  // { icon: <HiChartBar className="sidebar-icon" />, text: "Reports", link: "/user/reports" },
  { icon: <HiBell className="sidebar-icon" />, text: "Notifications", link: "/user/notifications" },
];

  // Dummy data for GST Returns - sample clients with filing status
  const gstFilingData = [
    { sl: 1, name: "MODERN MASTER PUBLICATION", mobile: "8439393333", filingType: "Monthly", gstin: "09QACPS3544H1Z4", dateOfFiling: "2025-11-20"  },
    { sl: 2, name: "M/s BHARAT KHADI UDYOG", mobile: "8279909897", filingType: "Monthly", gstin: "09AYCPA3837B1ZX", dateOfFiling: ""  },
    { sl: 3, name: "N S TRADERS", mobile: "9811984956", filingType: "Monthly", gstin: "09BKBPS9165E1ZS", dateOfFiling: "2025-11-18" },
    { sl: 4, name: "NEERAJ AGENCIES", mobile: "6395749804", filingType: "Monthly", gstin: "09BRXPR8342B1Z6", dateOfFiling: "", },
    { sl: 5, name: "WOOD CRAFT FURNITURE", mobile: "9897024060", filingType: "Monthly", gstin: "09DILPS7916D1ZR", dateOfFiling: "2025-11-21" },
    { sl: 6, name: "SHIFA HANDLOOM", mobile: "9870766390", filingType: "Monthly", gstin: "09COYPM9918R1ZA", dateOfFiling: ""   },
    { sl: 7, name: "I R TEXTILES", mobile: "8979344241", filingType: "Monthly", gstin: "09ABBPI9410Q1Z9", dateOfFiling: "2025-11-19" },
    { sl: 8, name: "META TRADING COMPANY", mobile: "8126645576", filingType: "Monthly", gstin: "09DQWPA8816B1ZL", dateOfFiling: ""  },
    // Add more dummy data to make it longer
  ];

  const [selectedReturnType, setSelectedReturnType] = useState("GSTR1");
  const [selectedMonth, setSelectedMonth] = useState("Nov-2025");
  const [filingList, setFilingList] = useState(gstFilingData);
  const [filterView, setFilterView] = useState("all");

  const handleGo = () => {
    // Simulate fetching data for selected month and return type
    toast.success(`Data loaded for ${selectedReturnType} - ${selectedMonth}`);
    // Here you can filter or load new data based on month/type
  };

  const handleGetLatest = () => {
    toast.success("Latest data fetched from GSTN!");
  };

  const handleDownloadPDF = () => {
    toast.success("PDF downloaded!");
    // Actual download logic can be added here
  };

  const filteredFilingList = filingList.filter(item => {
    if (filterView === "filed") return item.status === "Filed";
    if (filterView === "not_filed") return item.status === "Not Filed";
    return true;
  });

  const filedCount = filingList.filter(item => item.status === "Filed").length;
  const notFiledCount = filingList.filter(item => item.status === "Not Filed").length;

  const pendingVouchersData = [
    { id: 1, clientName: "Client A", company: "ABC Corp", gstin: "27AAACC1001Z1", pan: "ABCDE1234F", mobile: "9876543210", voucherName: "Voucher #001", pendingSince: "2025-12-20" },
    { id: 2, clientName: "Client B", company: "XYZ Ltd", gstin: "27AAACC1002Z2", pan: "ABCDE1235G", mobile: "9876543211", voucherName: "Voucher #002", pendingSince: "2025-12-22" },
    { id: 3, clientName: "Client C", company: "Global Traders", gstin: "27AAACC1003Z3", pan: "ABCDE1236H", mobile: "9876543212", voucherName: "Voucher #003", pendingSince: "2025-12-23" },
    { id: 4, clientName: "Client D", company: "Tech Solutions", gstin: "27AAACC1004Z4", pan: "ABCDE1237I", mobile: "9876543213", voucherName: "Voucher #004", pendingSince: "2025-12-24" },
    { id: 5, clientName: "Client E", company: "Retail King", gstin: "27AAACC1005Z5", pan: "ABCDE1238J", mobile: "9876543214", voucherName: "Voucher #005", pendingSince: "2025-12-25" },
    { id: 6, clientName: "Client F", company: "Company 6", gstin: "27AAACC1006Z6", pan: "ABCDE1239K", mobile: "9876543215", voucherName: "Voucher #006", pendingSince: "2025-12-26" },
    { id: 7, clientName: "Client G", company: "Company 7", gstin: "27AAACC1007Z7", pan: "ABCDE1240L", mobile: "9876543216", voucherName: "Voucher #007", pendingSince: "2025-12-27" },
  ];

  const returnsDueData = [
    { id: 1, clientName: "Client A", company: "ABC Corp", gstin: "27AAACC1001Z1", returnType: "GSTR-3B", dueDate: "2025-12-28" },
    { id: 2, clientName: "Client B", company: "XYZ Ltd", gstin: "27AAACC1002Z2", returnType: "GSTR-1", dueDate: "2025-12-27" },
    { id: 3, clientName: "Client C", company: "Global Traders", gstin: "27AAACC1003Z3", returnType: "GSTR-7", dueDate: "2025-12-29" },
    { id: 4, clientName: "Client D", company: "Tech Solutions", gstin: "27AAACC1004Z4", returnType: "GSTR-3B", dueDate: "2025-12-26" },
    { id: 5, clientName: "Client E", company: "Retail King", gstin: "27AAACC1005Z5", returnType: "GSTR-1", dueDate: "2025-12-25" },
    { id: 6, clientName: "Client F", company: "Company 6", gstin: "27AAACC1006Z6", returnType: "GSTR-7", dueDate: "2025-12-30" },
    { id: 7, clientName: "Client G", company: "Company 7", gstin: "27AAACC1007Z7", returnType: "GSTR-3B", dueDate: "2025-12-31" },
  ];

  const clientsNeedingAttentionData = [
    { id: 1, company: "ABC Corp", issue: "Missing documents for Q4" },
    { id: 2, company: "XYZ Ltd", issue: "Overdue payment" },
    { id: 3, company: "Global Traders", issue: "GST reconciliation pending" },
    { id: 4, company: "Tech Solutions", issue: "Audit query unresolved" },
    { id: 5, company: "Retail King", issue: "ITC claim discrepancy" },
    { id: 6, company: "Company 6", issue: "Return filing delay" },
    { id: 7, company: "Company 7", issue: "Tax notice received" },
    { id: 8, company: "Company 8", issue: "Vendor verification pending" },
    { id: 9, company: "Company 9", issue: "Invoice mismatch" },
    { id: 10, company: "Company 10", issue: "Compliance check required" },
    { id: 11, company: "Company 11", issue: "Bank reconciliation pending" },
    { id: 12, company: "Company 12", issue: "Expense report overdue" },
  ];

  const itcAvailableData = [
    { id: 1, clientName: "Client A", company: "ABC Corp", gstin: "27AAACC1001Z1", pan: "ABCDE1234F", mobile: "9876543210", amount: "₹1.2 Cr" },
    { id: 2, clientName: "Client B", company: "XYZ Ltd", gstin: "27AAACC1002Z2", pan: "ABCDE1235G", mobile: "9876543211", amount: "₹0.8 Cr" },
    { id: 3, clientName: "Client C", company: "Global Traders", gstin: "27AAACC1003Z3", pan: "ABCDE1236H", mobile: "9876543212", amount: "₹0.9 Cr" },
    { id: 4, clientName: "Client D", company: "Tech Solutions", gstin: "27AAACC1004Z4", pan: "ABCDE1237I", mobile: "9876543213", amount: "₹0.5 Cr" },
    { id: 5, clientName: "Client E", company: "Retail King", gstin: "27AAACC1005Z5", pan: "ABCDE1238J", mobile: "9876543214", amount: "₹0.4 Cr" },
    { id: 6, clientName: "Client F", company: "Company 6", gstin: "27AAACC1006Z6", pan: "ABCDE1239K", mobile: "9876543215", amount: "₹0.6 Cr" },
    { id: 7, clientName: "Client G", company: "Company 7", gstin: "27AAACC1007Z7", pan: "ABCDE1240L", mobile: "9876543216", amount: "₹0.7 Cr" },
  ];

  const [allClients, setAllClients] = useState(
  Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Client ${i + 1}`,
    company: `Company ${i + 1} Pvt Ltd`,
    gstin: `27AAACC${1000 + i}Z${i % 10}`,
    pan: `ABCDE${1234 + i}F`,
    mobile: `98765${String(i + 1).padStart(5, "0")}`,
    aadhaar: `1234-5678-${String(i + 1).padStart(4, "0")}`,
    address: `Address Line ${i + 1}, City`,
    pincode: `4000${i + 1}`,
    email: `client${i + 1}@example.com`,
    state: "Maharashtra",
    registrationType: i % 3 === 0 ? "Composition" : "Regular",
    status: i % 5 === 0 ? "inactive" : "active",
    registrationDate: `202${(i % 5) + 1}-0${(i % 9) + 1}-01`,
  }))
);
  // New states for Premium Add Client Modal
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const todayDate = new Date().toISOString().split("T")[0];
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    company: "",
    gstin: "",
    pan: "",
    aadhaar: "",
    mobile: "",
    address: "",
    pincode: "",
    registrationDate: todayDate,
  });
  
const addClient = (newClient) => {
  setAllClients((prev) => {
    const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
    const clientToAdd = {
      ...newClient,
      id: newId,
      registrationType: newClient.registrationType || "Regular",
      state: newClient.state || "Maharashtra",
      email: newClient.email || `client${newId}@example.com`,
      status: "active",
    };
    return [...prev, clientToAdd];
  });
};
  const handleClientChange = (e) => {
    setNewClientForm({ ...newClientForm, [e.target.name]: e.target.value });
  };

const submitNewClient = () => {
  if (!newClientForm.name || !newClientForm.company || !newClientForm.gstin || !newClientForm.mobile) {
    toast.error("Please fill Name, Company, GSTIN and Mobile");
    return;
  }
  if (newClientForm.gstin.length !== 15) {
    toast.error("GSTIN must be 15 characters");
    return;
  }
  if (newClientForm.mobile.length !== 10) {
    toast.error("Mobile must be 10 digits");
    return;
  }

  addClient({newClientForm ,name: newClientForm.name.trim(),
    company: newClientForm.company.trim(),
    gstin: newClientForm.gstin.toUpperCase().trim(),
    status: "active"});
    addClient(clientData);
    toast.success("New Client Added Successfully! (Active Status)");
  toast.success("Client added successfully with Active status!");
  setShowAddClientModal(false);
  setNewClientForm({
    name: "", company: "", gstin: "", pan: "", aadhaar: "", mobile: "", address: "", pincode: "", registrationDate: todayDate
  });

  // This fixes the navigation issue
  setTimeout(() => {
    navigate("/user/clients");
  }, 1000);
};


  const activeClients = allClients.filter(c => c.status === "active");

  const [showActiveClientsModal, setShowActiveClientsModal] = useState(false);
  const [showPendingVouchersModal, setShowPendingVouchersModal] = useState(false);
  const [showReturnsDueModal, setShowReturnsDueModal] = useState(false);
  const [showITCAvailableModal, setShowITCAvailableModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showUploadBillModal, setShowUploadBillModal] = useState(false);
  const [showCreateVoucherModal, setShowCreateVoucherModal] = useState(false);
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const modalCardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    width: "750px",
    maxWidth: "95%",
    maxHeight: "85vh",
    padding: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const ContactModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowContactModal(false)}>
      <div style={{ ...modalCardStyle, width: "500px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#7c3aed" }}>Contact Us</h3>
          <button onClick={() => setShowContactModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ lineHeight: "2.2" }}>
          <p style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <HiMail style={{ fontSize: "1.6rem", color: "#7c3aed" }} />
            <strong>Email:</strong>
            <a href="mailto:support@relyonsoft.com" style={{ color: "#7c3aed", textDecoration: "none", marginLeft: "10px", fontSize: "1.1rem" }}>
              support@relyonsoft.com
            </a>
          </p>
          <p style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <HiPhone style={{ fontSize: "1.6rem", color: "#7c3aed" }} />
            <strong>Call:</strong>
            <span style={{ marginLeft: "10px", fontSize: "1.1rem", fontWeight: "600" }}>
              080-69002100 / 080-23002100
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  const EditProfileModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowEditProfileModal(false)}>
      <div style={{ ...modalCardStyle, width: "550px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#7c3aed" }}>Edit Profile</h3>
          <button onClick={() => setShowEditProfileModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Name</label>
          <input name="name" value={editProfileForm.name} onChange={handleEditProfileChange} style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "8px" }} />

          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Date of Birth</label>
          <input name="dob" type="date" value={editProfileForm.dob} onChange={handleEditProfileChange} style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "8px" }} />

          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Gender</label>
          <select name="gender" value={editProfileForm.gender} onChange={handleEditProfileChange} style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Company</label>
          <input name="company" value={editProfileForm.company} onChange={handleEditProfileChange} style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "8px" }} />

          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email</label>
          <input name="email" type="email" value={editProfileForm.email} onChange={handleEditProfileChange} style={{ width: "100%", padding: "12px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "8px" }} />

          <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
            <button onClick={saveEditedProfile} style={{ background: "#7c3aed", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
              Save Changes
            </button>
            <button onClick={() => setShowEditProfileModal(false)} style={{ background: "#eee", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ActiveClientsModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowActiveClientsModal(false)}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#7c3aed" }}>Active Clients ({activeClients.length})</h3>
          <button onClick={() => setShowActiveClientsModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th style={{ padding: "14px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "14px", textAlign: "left" }}>GSTIN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>PAN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {activeClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                  <td style={{ padding: "14px" }}>{client.name}</td>
                  <td style={{ padding: "14px" }}>{client.gstin}</td>
                  <td style={{ padding: "14px" }}>{client.pan}</td>
                  <td style={{ padding: "14px" }}>{client.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


const ClientGSTDashboardModal = ({ client, onClose }) => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("Manually");
  const [activeAnnualSubTab, setActiveAnnualSubTab] = useState("GSTR-9");

  // New states for Import flow
  const [importStep, setImportStep] = useState("list"); // "list" | "upload"
  const [selectedImportType, setSelectedImportType] = useState(null); // e.g. "Bulk New File Creation for GST"

  // Dynamic client data - controls the top header card
  const [dynamicClient, setDynamicClient] = useState({
    gstin: client?.gstin || "09ABMCS5888A1ZU",
    company: client?.company || "SALVIA GRAFIX PRIVATE LIMITED",
    registrationDate: "10-Feb-2020",
    status: "Active",
  });

  // Editable form state - used in Client Detail tab
  const [formData, setFormData] = useState({
    name: "SALVIA GRAFIX PRIVATE LIMITED",
    address: "Shop No. 13, First Floor, Royal Plaza, Haj...",
    place: "Meerut",
    pin: "250002",
    state: "Uttar Pradesh",
    mobile: "+91 7500411329",
    email: "adv.raj7777@gmail.com",
    phone: "",
    tradeName: "SALVIA GRAFIX PRIVATE LIMITED",
    businessType: "Proprietorship",
    status: "Select",
    gstin: "09ABMCS5888A1ZU",
    regDate: "06-02-2024",
    tan: "",
    pan: "ABMCS5888A",
    cin: "",
    fileNo: "",
    responsiblePerson: "VIKRAM SINGH",
    designation: "",
    alternateMobile: "+91",
    gstUserId: "silva.grafix",
    taxPayerType: "Normal",
    uploadType: "GST",
    lutNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    setDynamicClient({
      gstin: formData.gstin,
      company: formData.name,
      registrationDate: formData.regDate,
      status: "Active",
    });
    alert("Client details updated successfully! Changes are now visible in the header card.");
  };

  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

  const menuItems = [
    "Dashboard",
    "Client Detail",
    "gstr-1",
    "gstr-1A",
    "gstr 3b",
    "IMS",
    "cmp-08",
    "gstr 2A",
    "gstr 2B",
    "gstr 2",
    "Annual Return",
    "Refund",
    "Payment",
    "Reports",
  ];

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  // Excel Template Download (unchanged)
  const downloadClientTemplate = () => {
    const notes = [
      ["Note"],
      ["1.If mandatory fields are not entered, then the record will not be imported"],
      ["2.File Name which already exist will not be imported."],
      ["3.Enter valid GSTIN"],
      ["4.Default B2B and Credit Debit Note will enable in Option settings."],
      ["5.To Enter Date Of Registration enter in DDMMYYYY format (02/Jan/2017)"],
      ["6.If no branches, a parent file will be created"],
      [""],
    ];
    const headers = [[
      "File Name *",
      "Assessee Name *",
      "GSTIN *",
      "Mobile *",
      "Status *",
      "Business Type",
      "Address",
      "Responsible Person",
      "TAN",
      "Designation",
      "Trade Name",
      "Place",
      "State *",
      "PIN",
      "File No",
      "Email",
      "Date of Registration (dd/mm/yyyy) *",
      "PAN",
      "User ID *",
      "Password",
      "Financial Year (yyyy-yyyy) *",
      "SEZ",
      "Tax Payer Type",
      "Return Type (If Tax payer type is normal)",
      "Branch Name",
      "Branch address"
    ]];
    const data = [...notes, ...headers];
    const ws = XLSX.utils.aoa_to_sheet(data);
    for (let i = 0; i < 7; i++) {
      const cell = ws[XLSX.utils.encode_cell({ r: i, c: 0 })];
      if (cell) {
        cell.s = {
          font: { color: { rgb: "FF0000" }, bold: true },
          alignment: { wrapText: true },
        };
      }
    }
    const headerRow = 8;
    for (let c = 0; c < headers[0].length; c++) {
      const addr = XLSX.utils.encode_cell({ r: headerRow, c });
      if (ws[addr]) {
        ws[addr].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" },
        };
      }
    }
    ws["!cols"] = headers[0].map(() => ({ wch: 28 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Master");
    XLSX.writeFile(wb, "Client_Master_Template.xlsx");
  };

  // Import Options List (Second Image)
  const ImportOptionsList = () => {
    const options = [
      { title: "Bulk New File Creation for GST", hasTemplate: true },
      { title: "GST Bulk New File creation using GSTN", hasTemplate: true },
      { title: "Bulk New File and Deductor Creation for TDS", hasTemplate: true },
      { title: "Bulk Client and Assessee creation from ITR Json - ZIP Only", hasTemplate: false },
      { title: "Bulk New File Creation for Income Tax ( Excel )", hasTemplate: true },
      { title: "Transfer Income Tax Data From Previous Year", hasTemplate: false, singleButton: true },
    ];

    return (
      <div style={{ padding: "20px", background: "#f8fafc" }}>
        <div style={{ background: "#ffffff", borderRadius: "12px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          {options.map((opt, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                marginBottom: idx < options.length - 1 ? "20px" : "0",
                background: "#f9fafb",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1e293b" }}>
                {opt.title}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                {opt.singleButton ? (
                  <button
                    style={{
                      background: "#2dd4bf",
                      color: "white",
                      padding: "10px 28px",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    TRANSFER
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedImportType(opt.title);
                        setImportStep("upload");
                      }}
                      style={{
                        background: "#2dd4bf",
                        color: "white",
                        padding: "10px 28px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      IMPORT
                    </button>
                    {opt.hasTemplate && (
                      <button
                        onClick={downloadClientTemplate}
                        style={{
                          background: "#1e40af",
                          color: "white",
                          padding: "10px 28px",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        TEMPLATE
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // File Upload Screen (First Image)
  const FileUploadScreen = () => {
    return (
      <div style={{ padding: "20px", background: "#f8fafc" }}>
        <div style={{ background: "#ffffff", borderRadius: "12px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: "0 0 32px 0", fontSize: "1.6rem", fontWeight: "700", color: "#1e293b" }}>
            Import Template
          </h2>
          <div style={{ marginBottom: "32px", color: "#475569", fontSize: "1rem" }}>
            Step 1 : Upload File
          </div>

          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "12px",
              padding: "80px 40px",
              textAlign: "center",
              background: "#f8fafc",
              marginBottom: "32px",
            }}
          >
            <p style={{ color: "#14b8a6", fontSize: "1.2rem", margin: "0 0 20px 0" }}>
              Browse or Drag and Drop File here
            </p>
            <div style={{ fontSize: "2.5rem", color: "#94a3b8" }}>↓</div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              style={{
                background: "#1e40af",
                color: "white",
                padding: "12px 40px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ↻ UPLOAD
            </button>
            <button
              style={{
                background: "#f59e0b",
                color: "white",
                padding: "12px 40px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              CLEAR
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Reusable GSTR Layout - Modified Import Tab
  const GSTRLayout = ({ title }) => (
    <div style={{ padding: "20px", background: "#f8fafc" }}>
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700", color: "#7c3aed" }}>
            {title}
          </h2>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <select style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem" }}>
              <option>FY 2024-25</option>
              <option>FY 2025-26</option>
            </select>
            <select style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem" }}>
              <option>Jan-2025</option>
              <option>Feb-2025</option>
              <option>Mar-2025</option>
              <option>Apr-2025</option>
              <option>May-2025</option>
              <option>Jun-2025</option>
              <option>Jul-2025</option>
              <option>Aug-2025</option>
              <option>Sep-2025</option>
              <option>Oct-2025</option>
              <option>Nov-2025</option>
              <option>Dec-2025</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "2px solid #e2e8f0" }}>
          {["Manually", "Import", "Summary"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                if (tab === "Import") {
                  setImportStep("list"); // Always start from list when clicking Import tab
                  setSelectedImportType(null);
                }
              }}
              style={{
                padding: "12px 28px",
                background: activeSubTab === tab ? "#7c3aed" : "transparent",
                color: activeSubTab === tab ? "white" : "#475569",
                border: "none",
                borderRadius: "10px 10px 0 0",
                fontSize: "1.1rem",
                fontWeight: activeSubTab === tab ? "600" : "500",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Import Tab - New Flow */}
        {activeSubTab === "Import" && (
          <>
            {importStep === "list" && <ImportOptionsList />}
            {importStep === "upload" && <FileUploadScreen />}
          </>
        )}

        {/* Summary Tab - Unchanged */}
        {activeSubTab === "Summary" && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
              <div style={{ background: "#fef3c7", padding: "24px", borderRadius: "12px", marginBottom: "40px", borderLeft: "5px solid #f59e0b" }}>
                <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#92400e" }}>Note :</p>
                <ol style={{ margin: 0, paddingLeft: "24px", textAlign: "left", color: "#92400e" }}>
                  <li>Total Amount is calculated by considering B2C-Small Amendments Details</li>
                  <li>Total Amount is setting off by considering Credit And Debit Note Amount</li>
                </ol>
              </div>
              <button style={{ background: "#16a34a", color: "white", padding: "16px 48px", border: "none", borderRadius: "12px", fontSize: "1.2rem", fontWeight: "600", boxShadow: "0 8px 25px rgba(22,163,74,0.3)" }}>
                Download Excel
              </button>
            </div>
          </div>
        )}

        {/* Manually Tab - Unchanged */}
        {activeSubTab === "Manually" && (
          <div style={{ textAlign: "center", padding: "100px 20px", color: "#64748b" }}>
            <h3 style={{ fontSize: "1.8rem" }}>Manual Entry - Coming Soon</h3>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeMenu === "Dashboard") {
      return (
        <div style={{ padding: "20px", background: "#f8fafc" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#0d9488",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              Returns / Ledger Status
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <select
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "0.95rem",
                  background: "white",
                }}
              >
                <option>2024-25</option>
                <option>2025-26</option>
              </select>
              <div style={{ fontSize: "0.9rem", color: "#059669", fontWeight: "600" }}>
                Last Update: 03-Jan-2026
              </div>
              <button
                style={{
                  background: "#10b981",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px repeat(12, 1fr)",
              gap: "6px",
              marginBottom: "12px",
              fontWeight: "700",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ paddingLeft: "8px" }}>Return</div>
            {months.map((m) => (
              <div
                key={m}
                style={{
                  textAlign: "center",
                  padding: "6px 0",
                  background: "#e0e7ff",
                  borderRadius: "6px",
                  color: "#4338ca",
                }}
              >
                {m}
              </div>
            ))}
          </div>
          {[
            { name: "GSTR-1", filed: 9 },
            { name: "GSTR-1A", filed: 0 },
            { name: "GSTR-3B", filed: 8 },
            { name: "TDS/TCS", filed: 8 },
          ].map((ret) => (
            <div
              key={ret.name}
              style={{
                display: "grid",
                gridTemplateColumns: "100px repeat(12, 1fr)",
                gap: "6px",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  color: "#0d9488",
                  fontSize: "0.9rem",
                  paddingLeft: "8px",
                }}
              >
                {ret.name}
                <br />
                <a
                  href="#"
                  style={{ fontSize: "0.75rem", color: "#2563eb", textDecoration: "underline" }}
                >
                  All Download →
                </a>
              </div>
              {Array.from({ length: 12 }, (_, i) => {
                const filed = i < ret.filed;
                const isCurrentPeriod = i >= 9;
                const arn = filed
                  ? `AA09${String(i + 4).padStart(2, "0")}24R${String(i + 1).padStart(3, "0")}`
                  : isCurrentPeriod
                  ? ""
                  : "Pending";
                return (
                  <div
                    key={i}
                    style={{
                      background: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      padding: "8px 4px",
                      textAlign: "center",
                      fontSize: "0.78rem",
                      minHeight: "68px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "3px",
                    }}
                  >
                    {filed ? (
                      <>
                        <span style={{ color: "#059669", fontWeight: "700", fontSize: "0.8rem" }}>
                          Filed
                        </span>
                        <span style={{ color: "#666", fontSize: "0.68rem" }}>ARN:</span>
                        <span style={{ color: "#333", fontWeight: "600", fontSize: "0.72rem" }}>
                          {arn}
                        </span>
                        <a
                          href="#"
                          style={{
                            color: "#2563eb",
                            fontSize: "0.7rem",
                            textDecoration: "underline",
                            marginTop: "4px",
                          }}
                        >
                          Download
                        </a>
                      </>
                    ) : isCurrentPeriod ? (
                      <>
                        <span style={{ color: "#dc2626", fontWeight: "700" }}>Due</span>
                        <span style={{ color: "#999", fontSize: "0.7rem" }}>Not Filed</span>
                      </>
                    ) : (
                      <>
                        <span style={{ color: "#dc2626", fontWeight: "700" }}>Not Filed</span>
                        <span style={{ color: "#666", fontSize: "0.68rem" }}>ARN: {arn}</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", margin: "20px 0", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <strong>GSTR-9:</strong>{" "}
              <span
                style={{
                  background: "#fde68a",
                  color: "#92400e",
                  padding: "6px 16px",
                  borderRadius: "30px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                Due
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <strong>GSTR-9C:</strong>{" "}
              <span
                style={{
                  background: "#fde68a",
                  color: "#92400e",
                  padding: "6px 16px",
                  borderRadius: "30px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                Due
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <strong>IMS:</strong>
              <button
                style={{
                  marginLeft: "10px",
                  background: "#3b82f6",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                File
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button
              style={{
                background: "#f97316",
                color: "#fff",
                padding: "12px 36px",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              PDF Download
            </button>
            <button
              style={{
                background: "#16a34a",
                color: "#fff",
                padding: "12px 36px",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginLeft: "20px",
              }}
            >
              Excel Download
            </button>
          </div>
          <div style={{ marginTop: "30px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700", color: "#1f2937" }}>
                Ledger Summary
              </h2>
              <button
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                Update
              </button>
            </div>
            <div style={{ display: "flex", gap: "20px", marginBottom: "30px", overflowX: "auto" }}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  minWidth: "500px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    background: "#a21caf",
                    color: "#fff",
                    padding: "10px 14px",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                  Electronic Ledger Balances
                </div>
                <div style={{ padding: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "600" }}>
                    <span>Cash Balance</span>
                    <strong>₹58,756.00</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "600" }}>
                    <span>Credit Balance</span>
                    <strong>₹36,845.00</strong>
                  </div>
                </div>
                <div
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  Balance of Electronic Credit Ledger
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#ecfdf5" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "8px", textAlign: "center" }}>IGST</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>CGST</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>SGST</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>CESS</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px", textAlign: "center" }}>₹25,165</td>
                      <td style={{ padding: "10px", textAlign: "center" }}>₹12,324</td>
                      <td style={{ padding: "10px", textAlign: "center" }}>₹5,632</td>
                      <td style={{ padding: "10px", textAlign: "center" }}>₹15,635</td>
                      <td style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>₹58,756</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  minWidth: "400px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    background: "#a21caf",
                    color: "#fff",
                    padding: "10px 14px",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                  Turnover Balances
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "12px" }}>Turnover Estimated</td>
                      <td style={{ textAlign: "right" }}>₹1,25,65,635.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px" }}>Aggregate Turnover</td>
                      <td style={{ textAlign: "right" }}>₹1,25,65,635.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
              <div
                style={{
                  flex: "1 1 340px",
                  maxWidth: "420px",
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    background: "#a21caf",
                    color: "#fff",
                    padding: "10px 14px",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                  Liability Ledger
                </div>
                <div style={{ padding: "16px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                    <tbody>
                      <tr>
                        <td>Liability (GSTR-1)</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹10,25,365.25</td>
                      </tr>
                      <tr>
                        <td>Liability (GSTR-3B)</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹10,20,365.25</td>
                      </tr>
                      <tr style={{ color: "red", fontWeight: "700" }}>
                        <td style={{ color: "red" }}>Difference</td>
                        <td style={{ textAlign: "right", color: "red" }}>₹5,000.00</td>
                      </tr>
                      <tr>
                        <td>ITC (GSTR-2B)</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹11,11,265.50</td>
                      </tr>
                      <tr>
                        <td>ITC (GSTR-3B)</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹11,10,265.50</td>
                      </tr>
                      <tr style={{ color: "#f97316", fontWeight: "700" }}>
                        <td style={{ color: "orange" }}>Difference</td>
                        <td style={{ textAlign: "right", color: "orange" }}>-₹1,000.00</td>
                      </tr>
                      <tr>
                        <td>ITC (GSTR-2A)</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹11,11,265.50</td>
                      </tr>
                      <tr>
                        <td>ITC (GSTR-3B)</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹11,10,265.50</td>
                      </tr>
                      <tr style={{ color: "#16a34a", fontWeight: "700" }}>
                        <td style={{ color: "green" }}>Difference</td>
                        <td style={{ textAlign: "right", color: "green" }}>₹0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                style={{
                  flex: "2 1 500px",
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    background: "#a21caf",
                    color: "#fff",
                    padding: "10px 14px",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                  Payment of Demand
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    fontSize: "0.9rem",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Date: 10-05-2024 | Order ID: <strong>ZD09012545845G</strong> | Total: <strong>₹1,31,122.00</strong>
                </div>
                <div style={{ padding: "16px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", background: "#fef2f2" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Act</th>
                        <th style={{ textAlign: "right" }}>IGST</th>
                        <th style={{ textAlign: "right" }}>CGST</th>
                        <th style={{ textAlign: "right" }}>SGST</th>
                        <th style={{ textAlign: "right" }}>CESS</th>
                        <th style={{ textAlign: "right" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Tax</td>
                        <td style={{ textAlign: "right" }}>₹65,635</td>
                        <td style={{ textAlign: "right" }}>₹5,825</td>
                        <td style={{ textAlign: "right" }}>₹5,825</td>
                        <td style={{ textAlign: "right" }}>₹0</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹77,285</td>
                      </tr>
                      <tr>
                        <td>Interest</td>
                        <td style={{ textAlign: "right" }}>₹12,125</td>
                        <td style={{ textAlign: "right" }}>₹856</td>
                        <td style={{ textAlign: "right" }}>₹856</td>
                        <td style={{ textAlign: "right" }}>₹0</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹13,837</td>
                      </tr>
                      <tr>
                        <td>Penalty</td>
                        <td style={{ textAlign: "right" }}>₹20,000</td>
                        <td style={{ textAlign: "right" }}>₹10,000</td>
                        <td style={{ textAlign: "right" }}>₹10,000</td>
                        <td style={{ textAlign: "right" }}>₹0</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹40,000</td>
                      </tr>
                      <tr style={{ fontWeight: "700", background: "#fee2e2" }}>
                        <td>Total</td>
                        <td style={{ textAlign: "right" }}>₹97,760</td>
                        <td style={{ textAlign: "right" }}>₹16,681</td>
                        <td style={{ textAlign: "right" }}>₹16,681</td>
                        <td style={{ textAlign: "right" }}>₹0</td>
                        <td style={{ textAlign: "right" }}>₹1,31,122</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                style={{
                  background: "#f97316",
                  color: "#fff",
                  padding: "12px 36px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                PDF Download
              </button>
              <button
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  padding: "12px 36px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginLeft: "30px",
                }}
              >
                Excel Download
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeMenu === "Client Detail") {
      return (
        <div style={{ padding: "20px", background: "#f8fafc" }}>
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                padding: "16px",
                background: "#f0f9ff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", color: "#1f2937" }}>
                Client Details
              </h3>
              <button
                style={{
                  background: "#10b981",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Get Data From GSTN
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 20px 0", color: "#0d9488", fontWeight: "700", fontSize: "1.1rem" }}>
                  Personal Details
                </h4>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                    Name <span style={{ color: "red" }}>(required)</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Place</label>
                  <input
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>PIN</label>
                  <input
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                    State <span style={{ color: "red" }}>(required)</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option>Uttar Pradesh</option>
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Mobile Number</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Email Id</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>
              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 20px 0", color: "#0d9488", fontWeight: "700", fontSize: "1.1rem" }}>
                  Business Details
                </h4>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Trade Name</label>
                  <input
                    name="tradeName"
                    value={formData.tradeName}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option>Proprietorship</option>
                    <option>Partnership</option>
                    <option>Private Limited</option>
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option>Select</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                    GSTIN <span style={{ color: "red" }}>(required)</span>
                  </label>
                  <input
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                    Registration Date <span style={{ color: "red" }}>(required)</span>
                  </label>
                  <input
                    name="regDate"
                    value={formData.regDate}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>TAN</label>
                  <input
                    name="tan"
                    value={formData.tan}
                    onChange={handleInputChange}
                    placeholder="TAN"
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>PAN</label>
                  <input
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>CIN Number</label>
                  <input
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                    placeholder="CIN Number"
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>
              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 20px 0", color: "#0d9488", fontWeight: "700", fontSize: "1.1rem" }}>
                  Other Details
                </h4>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>File No</label>
                  <input
                    name="fileNo"
                    value={formData.fileNo}
                    onChange={handleInputChange}
                    placeholder="File No"
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Responsible Person</label>
                  <input
                    name="responsiblePerson"
                    value={formData.responsiblePerson}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Designation</label>
                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Designation"
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>Alternate Mobile</label>
                  <input
                    name="alternateMobile"
                    value={formData.alternateMobile}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                    GST User ID <span style={{ color: "red" }}>(required)</span>
                  </label>
                  <input
                    name="gstUserId"
                    value={formData.gstUserId}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                    Tax Payer Type <span style={{ color: "red" }}>(required)</span>
                  </label>
                  <select
                    name="taxPayerType"
                    value={formData.taxPayerType}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option>Normal</option>
                    <option>Composition</option>
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                    Upload Type <span style={{ color: "red" }}>(required)</span>
                  </label>
                  <select
                    name="uploadType"
                    value={formData.uploadType}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option>GST</option>
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>LUT Number</label>
                  <input
                    name="lutNumber"
                    value={formData.lutNumber}
                    onChange={handleInputChange}
                    placeholder="LUT Number"
                    style={{ width: "100%", padding: "10px", marginTop: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", marginTop: "30px" }}>
              <button
                onClick={handleUpdate}
                style={{
                  background: "#16a34a",
                  color: "white",
                  padding: "12px 36px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      );
    }

    const regularGstrTabs = [
      "gstr-1",
      "gstr-1A",
      "gstr 3b",
      "IMS",
      "cmp-08",
      "gstr 2A",
      "gstr 2B",
      "gstr 2",
    ];

    if (regularGstrTabs.includes(activeMenu)) {
      const displayTitle = activeMenu
        .toUpperCase()
        .replace("GSTR ", "GSTR-")
        .replace(" 3B", " 3B")
        .replace("CMP-08", "CMP-08");
      return <GSTRLayout title={displayTitle} />;
    }

    if (activeMenu === "Annual Return") {
      return (
        <div style={{ padding: "20px", background: "#f8fafc" }}>
          <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "2px solid #e2e8f0" }}>
              {["GSTR-9", "GSTR-9C"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveAnnualSubTab(tab)}
                  style={{
                    padding: "12px 28px",
                    background: activeAnnualSubTab === tab ? "#7c3aed" : "transparent",
                    color: activeAnnualSubTab === tab ? "white" : "#475569",
                    border: "none",
                    borderRadius: "10px 10px 0 0",
                    fontSize: "1.1rem",
                    fontWeight: activeAnnualSubTab === tab ? "600" : "500",
                    cursor: "pointer",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <GSTRLayout title={activeAnnualSubTab} />
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: "80px 40px", textAlign: "center", color: "#64748b" }}>
        <h2 style={{ fontSize: "2rem", color: "#7c3aed", marginBottom: "20px" }}>
          {activeMenu.toUpperCase().replace(/-/g, " ")}
        </h2>
        <p style={{ fontSize: "1.3rem" }}>This section is under development.</p>
      </div>
    );
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div
        style={{
          width: "1350px",
          maxWidth: "96%",
          height: "85vh",
          background: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Segoe UI', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0d9488, #089178)",
            color: "white",
            padding: "14px 28px",
            fontSize: "0.95rem",
            fontWeight: "600",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            GSTIN: <strong>{dynamicClient.gstin}</strong> |
            Reg Date: <strong>{dynamicClient.registrationDate}</strong> |
            Name: <strong>{dynamicClient.company}</strong> |
            Status: <strong style={{ color: "#a7f3d0" }}>{dynamicClient.status}</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span style={{ background: "#dc2626", padding: "6px 14px", borderRadius: "30px", fontWeight: "600", fontSize: "0.9rem" }}>
              Regular
            </span>
            <a
              href="https://services.gst.gov.in/services/login"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", textDecoration: "underline", fontWeight: "500" }}
            >
              Go to GST Portal →
            </a>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "white", fontSize: "1.6rem", cursor: "pointer" }}
            >
              <HiX />
            </button>
          </div>
        </div>

        <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0 16px", overflowX: "auto" }}>
          <div style={{ display: "inline-flex", gap: "4px", padding: "10px 0" }}>
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveMenu(item);
                  setActiveSubTab("Manually");
                  if (item === "Annual Return") {
                    setActiveAnnualSubTab("GSTR-9");
                  }
                }}
                onMouseEnter={() => setHoveredMenu(item)}
                onMouseLeave={() => setHoveredMenu(null)}
                style={{
                  padding: "12px 20px",
                  background:
                    activeMenu === item
                      ? "#7c3aed"
                      : hoveredMenu === item
                      ? "#9f7aea"
                      : "transparent",
                  color: activeMenu === item || hoveredMenu === item ? "white" : "#475569",
                  border: "none",
                  borderRadius: "10px 10px 0 0",
                  fontSize: "0.95rem",
                  fontWeight: activeMenu === item ? "600" : "500",
                  cursor: "pointer",
                  minWidth: "110px",
                  transition: "all 0.3s ease",
                }}
              >
                {item.toUpperCase().replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};




  const PendingVouchersModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowPendingVouchersModal(false)}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#7c3aed" }}>Pending Vouchers ({pendingVouchersData.length})</h3>
          <button onClick={() => setShowPendingVouchersModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0ff" }}>
                <th style={{ padding: "14px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "14px", textAlign: "left" }}>GSTIN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>PAN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Mobile</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Pending Date</th>
              </tr>
            </thead>
            <tbody>
              {pendingVouchersData.map((voucher) => (
                <tr key={voucher.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "14px" }}>{voucher.clientName}</td>
                  <td style={{ padding: "14px" }}>{voucher.gstin}</td>
                  <td style={{ padding: "14px" }}>{voucher.pan}</td>
                  <td style={{ padding: "14px" }}>{voucher.mobile}</td>
                  <td style={{ padding: "14px" }}>{voucher.pendingSince}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ReturnsDueModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowReturnsDueModal(false)}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#7c3aed" }}>Due This Week ({returnsDueData.length})</h3>
          <button onClick={() => setShowReturnsDueModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0ff" }}>
                <th style={{ padding: "14px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "14px", textAlign: "left" }}>GSTIN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>GST Type</th>
              </tr>
            </thead>
            <tbody>
              {returnsDueData.map((ret) => (
                <tr key={ret.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "14px" }}>{ret.clientName}</td>
                  <td style={{ padding: "14px" }}>{ret.gstin}</td>
                  <td style={{ padding: "14px" }}>{ret.returnType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ITCAvailableModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowITCAvailableModal(false)}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#7c3aed" }}>ITC Available</h3>
          <button onClick={() => setShowITCAvailableModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0ff" }}>
                <th style={{ padding: "14px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Company</th>
                <th style={{ padding: "14px", textAlign: "left" }}>GSTIN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>PAN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Mobile</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {itcAvailableData.map((itc) => (
                <tr key={itc.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "14px" }}>{itc.clientName}</td>
                  <td style={{ padding: "14px" }}>{itc.company}</td>
                  <td style={{ padding: "14px" }}>{itc.gstin}</td>
                  <td style={{ padding: "14px" }}>{itc.pan}</td>
                  <td style={{ padding: "14px" }}>{itc.mobile}</td>
                  <td style={{ padding: "14px" }}>{itc.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const [clientViewMode, setClientViewMode] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);

  const filteredClients = allClients.filter((c) => {
    if (clientViewMode === "active") return c.status === "active";
    if (clientViewMode === "inactive") return c.status === "inactive";
    return true;
  });

  const activateClient = (id) => {
    setAllClients(allClients.map((c) => (c.id === id ? { ...c, status: "active" } : c)));
    toast.success("Client activated successfully!");
    
  };

  const deactivateClient = (id) => {
    setAllClients(allClients.map((c) => (c.id === id ? { ...c, status: "inactive" } : c)));
    toast.success("Client deactivated!");
   
  };

  const deleteClient = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this client?")) {
      setAllClients(allClients.filter((c) => c.id !== id));
      toast.success("Client deleted permanently!");
      setSelectedClient(null);
    }
  };


  const ClientDetailCard = () => (
    <div style={modalOverlayStyle} onClick={() => setSelectedClient(null)}>
      <div style={{ ...modalCardStyle, width: "500px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Client Details</h3>
          <button onClick={() => setSelectedClient(null)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ marginBottom: "15px" }}><strong>Name:</strong> {selectedClient.name}</div>
        <div style={{ marginBottom: "15px" }}><strong>Company:</strong> {selectedClient.company}</div>
        <div style={{ marginBottom: "15px" }}><strong>GSTIN:</strong> {selectedClient.gstin}</div>
        <div style={{ marginBottom: "15px" }}><strong>PAN:</strong> {selectedClient.pan}</div>
        <div style={{ marginBottom: "20px" }}><strong>Mobile:</strong> {selectedClient.mobile}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <button style={{ background: "#7c3aed" }}>
            <HiPencil style={{ marginRight: "8px" }} /> Edit
          </button>
          {selectedClient.status === "active" ? (
            <button onClick={() => deactivateClient(selectedClient.id)} style={{ background: "#f59e0b" }}>
              Deactivate
            </button>
          ) : (
            <button onClick={() => activateClient(selectedClient.id)} style={{ background: "#22c55e" }}>
              <HiCheckCircle style={{ marginRight: "8px" }} /> Activate
            </button>
          )}
          <button onClick={() => deleteClient(selectedClient.id)} style={{ background: "#ef4444" }}>
            <HiTrash style={{ marginRight: "8px" }} /> Delete
          </button>
          <button onClick={() => setSelectedClient(null)} style={{ background: "#ccc" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

const ClientsPage = ({
  allClients,
  clientViewMode,
  setClientViewMode,
  selectedClient,
  setSelectedClient,
  activateClient,
  deactivateClient,
  deleteClient,
}) => {
  const filteredClients = allClients.filter((c) => {
    if (clientViewMode === "active") return c.status === "active";
    if (clientViewMode === "inactive") return c.status === "inactive";
    return true;
  });

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#7c3aed" }}>My Clients ({allClients.length})</h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setClientViewMode("all")}
              style={{
                padding: "10px 20px",
                background: clientViewMode === "all" ? "#7c3aed" : "#f0f0f0",
                color: clientViewMode === "all" ? "white" : "#333",
                border: "none",
                borderRadius: "8px",
              }}
            >
              All ({allClients.length})
            </button>
            <button
              onClick={() => setClientViewMode("active")}
              style={{
                padding: "10px 20px",
                background: clientViewMode === "active" ? "#22c55e" : "#f0f0f0",
                color: clientViewMode === "active" ? "white" : "#333",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Active ({allClients.filter((c) => c.status === "active").length})
            </button>
            <button
              onClick={() => setClientViewMode("inactive")}
              style={{
                padding: "10px 20px",
                background: clientViewMode === "inactive" ? "#ef4444" : "#f0f0f0",
                color: clientViewMode === "inactive" ? "white" : "#333",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Inactive ({allClients.filter((c) => c.status === "inactive").length})
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "15px", textAlign: "left" }}>Company</th>
                <th style={{ padding: "15px", textAlign: "left" }}>GSTIN</th>
                <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "15px", textAlign: "left" }}>Actions</th>
                <th style={{ padding: "15px", textAlign: "left" }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px" }}>{client.name}</td>
                  <td style={{ padding: "15px" }}>{client.company}</td>
                  <td style={{ padding: "15px" }}>{client.gstin}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "8px 16px",
                        borderRadius: "30px",
                        background: client.status === "active" ? "#d4edda" : "#fee2e2",
                        color: client.status === "active" ? "#166534" : "#991b1b",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient({ ...client, showFullDashboard: false });
                      }}
                      style={{ background: "transparent", border: "none", color: "#7c3aed", fontWeight: "600", cursor: "pointer" }}
                    >
                      View Details →
                    </button>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <button
                      onClick={() => setSelectedClient({ ...client, showFullDashboard: true })}
                      style={{
                        background: "#7c3aed",
                        color: "white",
                        padding: "12px 28px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Small Details Modal */}
        {selectedClient && !selectedClient.showFullDashboard && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
            onClick={() => setSelectedClient(null)}
          >
            <div
              style={{
                background: "#fff",
                width: "500px",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ margin: 0 }}>Client Details</h3>
                <button onClick={() => setSelectedClient(null)} style={{ background: "none", border: "none", fontSize: "1.8rem" }}>
                  <HiX />
                </button>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Name:</strong> {selectedClient.name}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Company:</strong> {selectedClient.company}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>GSTIN:</strong> {selectedClient.gstin}
              </div>
              <div style={{ marginBottom: "30px" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    marginLeft: "10px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    background: selectedClient.status === "active" ? "#d4edda" : "#fee2e2",
                    color: selectedClient.status === "active" ? "#166534" : "#991b1b",
                  }}
                >
                  {selectedClient.status.toUpperCase()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                {selectedClient.status === "active" ? (
                  <button
                    onClick={() => {
                      deactivateClient(selectedClient.id);
                      setSelectedClient(null);
                    }}
                    style={{ background: "#f59e0b", color: "white", padding: "12px 24px", borderRadius: "8px" }}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      activateClient(selectedClient.id);
                      setSelectedClient(null);
                    }}
                    style={{ background: "#22c55e", color: "white", padding: "12px 24px", borderRadius: "8px" }}
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteClient(selectedClient.id);
                    setSelectedClient(null);
                  }}
                  style={{ background: "#ef4444", color: "white", padding: "12px 24px", borderRadius: "8px" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedClient(null)}
                  style={{ background: "#e5e7eb", padding: "12px 24px", borderRadius: "8px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full GST Dashboard Modal */}
        {selectedClient && selectedClient.showFullDashboard && (
          <ClientGSTDashboardModal client={selectedClient} onClose={() => setSelectedClient(null)} />
        )}
      </div>
    </div>
  );
};


  const [invoices, setInvoices] = useState([]);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    name: "",
    company: "",
    gstin: "",
    mobile: "",
    pan: "",
    amount: "",
    date: "",
  });

  const handleNewInvoiceChange = (e) => {
    setNewInvoiceForm({ ...newInvoiceForm, [e.target.name]: e.target.value });
  };

  const addNewInvoice = () => {
    if (!newInvoiceForm.name || !newInvoiceForm.company || !newInvoiceForm.gstin || !newInvoiceForm.mobile || !newInvoiceForm.pan || !newInvoiceForm.amount || !newInvoiceForm.date) {
      toast.error("Please fill all fields");
      return;
    }
    const newId = invoices.length + 1;
    setInvoices([...invoices, { id: newId, ...newInvoiceForm }]);
    setNewInvoiceForm({
      name: "",
      company: "",
      gstin: "",
      mobile: "",
      pan: "",
      amount: "",
      date: "",
    });
    toast.success("Invoice added!");
  };

  const NewInvoiceModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowNewInvoiceModal(false)}>
      <div style={{ ...modalCardStyle, width: "850px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Add New Sales Invoice</h3>
          <button onClick={() => setShowNewInvoiceModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <div style={{ display: "flex", gap: "20px", flex: 1, overflowY: "auto" }}>
          <div style={{ flex: 1 }}>
            <input name="name" placeholder="Name" value={newInvoiceForm.name} onChange={handleNewInvoiceChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
            <input name="company" placeholder="Company" value={newInvoiceForm.company} onChange={handleNewInvoiceChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
            <input name="gstin" placeholder="GSTIN" value={newInvoiceForm.gstin} onChange={handleNewInvoiceChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
            <input name="mobile" placeholder="Mobile" value={newInvoiceForm.mobile} onChange={handleNewInvoiceChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
            <input name="pan" placeholder="PAN" value={newInvoiceForm.pan} onChange={handleNewInvoiceChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
            <input name="amount" placeholder="Amount" value={newInvoiceForm.amount} onChange={handleNewInvoiceChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
            <input name="date" type="date" value={newInvoiceForm.date} onChange={handleNewInvoiceChange} style={{ width: "100%", marginBottom: "20px", padding: "10px" }} />
            <button onClick={addNewInvoice}>Add Invoice</button>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Added Invoices</h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f0f0f0" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Amount</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "12px" }}>{inv.name}</td>
                      <td style={{ padding: "12px" }}>{inv.amount}</td>
                      <td style={{ padding: "12px" }}>{inv.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleBillUpload = (e) => {
    if (e.target.files.length > 0) {
      toast.success("Purchase bill uploaded successfully!");
      setShowUploadBillModal(false);
    }
  };

  const UploadBillModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowUploadBillModal(false)}>
      <div style={{ ...modalCardStyle, width: "500px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Upload Purchase Bill</h3>
          <button onClick={() => setShowUploadBillModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <input type="file" accept=".pdf" onChange={handleBillUpload} style={{ width: "100%", marginBottom: "20px" }} />
        <button onClick={() => setShowUploadBillModal(false)} style={{ background: "#ccc" }}>Cancel</button>
      </div>
    </div>
  );

  const [newVoucherForm, setNewVoucherForm] = useState({
    name: "",
    company: "",
    gstin: "",
    mobile: "",
    pan: "",
    amount: "",
    date: "",
  });

  const handleNewVoucherChange = (e) => {
    setNewVoucherForm({ ...newVoucherForm, [e.target.name]: e.target.value });
  };

  const addNewVoucher = () => {
    if (!newVoucherForm.name || !newVoucherForm.company || !newVoucherForm.gstin || !newVoucherForm.mobile || !newVoucherForm.pan || !newVoucherForm.amount || !newVoucherForm.date) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Voucher created!");
    setShowCreateVoucherModal(false);
  };

  const CreateVoucherModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowCreateVoucherModal(false)}>
      <div style={{ ...modalCardStyle, width: "500px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Create Voucher</h3>
          <button onClick={() => setShowCreateVoucherModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <input name="name" placeholder="Name" value={newVoucherForm.name} onChange={handleNewVoucherChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
        <input name="company" placeholder="Company" value={newVoucherForm.company} onChange={handleNewVoucherChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
        <input name="gstin" placeholder="GSTIN" value={newVoucherForm.gstin} onChange={handleNewVoucherChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
        <input name="mobile" placeholder="Mobile" value={newVoucherForm.mobile} onChange={handleNewVoucherChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
        <input name="pan" placeholder="PAN" value={newVoucherForm.pan} onChange={handleNewVoucherChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
        <input name="amount" placeholder="Amount" value={newVoucherForm.amount} onChange={handleNewVoucherChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
        <input name="date" type="date" value={newVoucherForm.date} onChange={handleNewVoucherChange} style={{ width: "100%", marginBottom: "20px", padding: "10px" }} />
        <button onClick={addNewVoucher}>Create Voucher</button>
      </div>
    </div>
  );
  

  const [reminderForm, setReminderForm] = useState({
    clientId: "",
    method: "email",
    message: "",
  });

  const handleReminderChange = (e) => {
    setReminderForm({ ...reminderForm, [e.target.name]: e.target.value });
  };

  const sendReminder = () => {
    if (!reminderForm.clientId || !reminderForm.method || !reminderForm.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Reminder sent!");
    setShowSendReminderModal(false);
  };

  const SendReminderModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowSendReminderModal(false)}>
      <div style={{ ...modalCardStyle, width: "500px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Send Reminder</h3>
          <button onClick={() => setShowSendReminderModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <select name="clientId" value={reminderForm.clientId} onChange={handleReminderChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }}>
          <option value="">Select Client</option>
          {allClients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        <select name="method" value={reminderForm.method} onChange={handleReminderChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }}>
          <option value="email">Email</option>
          <option value="whatsapp">Whatsapp</option>
          <option value="sms">SMS</option>
        </select>
        <textarea name="message" placeholder="Message" value={reminderForm.message} onChange={handleReminderChange} style={{ width: "100%", marginBottom: "20px", padding: "10px", height: "100px" }} />
        <button onClick={sendReminder}>Send</button>
      </div>
    </div>
  );

  const [reportForm, setReportForm] = useState({
    type: "GSTR-3B",
    fromDate: "",
    toDate: "",
  });

  const handleReportChange = (e) => {
    setReportForm({ ...reportForm, [e.target.name]: e.target.value });
  };

  const generateQuickReport = () => {
    if (!reportForm.type || !reportForm.fromDate || !reportForm.toDate) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Report generated!");
    setShowGenerateReportModal(false);
  };

  const GenerateReportModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowGenerateReportModal(false)}>
      <div style={{ ...modalCardStyle, width: "500px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Generate Report</h3>
          <button onClick={() => setShowGenerateReportModal(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}>
            <HiX />
          </button>
        </div>
        <select name="type" value={reportForm.type} onChange={handleReportChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }}>
          <option value="GSTR-3B">GSTR-3B</option>
          <option value="GSTR-1">GSTR-1</option>
          <option value="GSTR-7">GSTR-7</option>
        </select>
        <label>From Date: </label>
        <input name="fromDate" type="date" value={reportForm.fromDate} onChange={handleReportChange} style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
        <label>To Date: </label>
        <input name="toDate" type="date" value={reportForm.toDate} onChange={handleReportChange} style={{ width: "100%", marginBottom: "20px", padding: "10px" }} />
        <button onClick={generateQuickReport}>Generate</button>
      </div>
    </div>
  );
  
const DashboardHome = ({ allClients, addClient, navigate }) => {
  const today = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const year = today.getFullYear();
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(year, selectedMonth, 1).getDay();
  const calendarCells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const growthData = {
      labels: ["Jan","Feb","Mar","Apr","May","Jun"],
      datasets: [{
        data: [520, 540, 580, 620, 660, 710],
        borderColor: "#1fa971",
        backgroundColor: "rgba(31,169,113,0.15)",
        tension: 0.4,
        fill: true // ab error nahi aayega
      }],
    };
  const pieData = {
    labels: ["Regular","Composition","Deductor","ECO","ISD"],
    datasets: [{ data: [428,165,34,2,11], backgroundColor: ["#1f2a70","#1fa971","#f4b400","#e55353","#8e44ad"] }]
  };
  const trendData = {
    labels: ["2020","2021","2022","2023","2024"],
    datasets: [{ data: [200,320,450,610,750], backgroundColor: "#1f2a70" }]
  };

  const card = { background: "#fff", borderRadius: "12px", padding: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" };
  const chartCard = { ...card, height: "300px", overflow: "hidden", display: "flex", flexDirection: "column" };
  const chartWrap = { flex: 1, position: "relative" };
  const headerCell = { background: "linear-gradient(90deg,#1f2a70,#3b4cc0)", color: "#fff", padding: "14px", fontWeight: "700", textAlign: "center" };

  // Add Client Modal State
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    gstin: "",
    pan: "",
    aadhaar: "",
    mobile: "",
    address: "",
    pincode: "",
    registrationDate: today.toISOString().split("T")[0], // default today
  });
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewClient(prev => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmitClient = () => {
  // Validation (same rahegi)
  if (!newClient.name?.trim() || !newClient.company?.trim() || !newClient.gstin?.trim() || !newClient.mobile?.trim()) {
    toast.error("Name, Company, GSTIN aur Mobile required hain!");
    return;
  }
  if (newClient.gstin.length !== 15) {
    toast.error("GSTIN 15 characters ka hona chahiye!");
    return;
  }
  if (newClient.mobile.length !== 10 || !/^\d{10}$/.test(newClient.mobile)) {
    toast.error("Mobile 10 digits ka hona chahiye!");
    return;
  }

  const clientData = {
    name: newClient.name.trim(),
    company: newClient.company.trim(),
    gstin: newClient.gstin.trim().toUpperCase(),
    pan: newClient.pan?.trim().toUpperCase() || "",
    mobile: newClient.mobile.trim(),
    aadhaar: newClient.aadhaar?.trim() || "",
    address: newClient.address?.trim() || "",
    pincode: newClient.pincode?.trim() || "",
    registrationDate: newClient.registrationDate || new Date().toISOString().split("T")[0],
  };

  // Add client
  addClient(clientData);

  // Success message
  toast.success("Client successfully added!");

  // Close modal and reset form
  setShowAddClientModal(true);
  setNewClient({
    name: "",
    company: "",
    gstin: "",
    pan: "",
    aadhaar: "",
    mobile: "",
    address: "",
    pincode: "",
    registrationDate: today.toISOString().split("T")[0],
  });

  // Ek hi baar redirect karo (safe delay ke saath)
  setTimeout(() => {
    navigate("/user/clients");
  }, 500);
};

  return (
    <div style={{ padding: "20px", maxWidth: "100%", overflowX: "hidden" }}>
      {/* Calendar & Status - unchanged */}
      <div style={{ display: "grid", gridTemplateColumns: "40% 60%", gap: "20px" }}>
        <div style={card}>
          <h3>Due Dates of GST Returns – {months[selectedMonth]} {year}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px", marginTop: "10px" }}>
            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d => (
              <div key={d} style={{ textAlign: "center", fontWeight: 600 }}>{d}</div>
            ))}
            {calendarCells.map((day, i) => (
              <div
                key={i}
                style={{
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "8px",
                  background: day === today.getDate() && selectedMonth === today.getMonth() ? "#1f2a70" : "#f3f5fa",
                  color: day === today.getDate() && selectedMonth === today.getMonth() ? "#fff" : "#000",
                }}
              >
                {day || ""}
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <h3>GST Return Filing Status</h3>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} style={{ padding: "8px 12px", borderRadius: "8px" }}>
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          {[
            ["GSTR-1",365,210], ["GSTR-1A",365,210], ["GSTR-3B",300,275],
            ["GSTR-7",300,275], ["GSTR-8",300,275], ["CMP-08",300,275],
          ].map(([type, filed, pending]) => (
            <div key={type} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: "10px", marginBottom: "8px" }}>
              <strong>{type}</strong>
              <div style={{ background: "#e8f7f0", padding: "6px", borderRadius: "6px" }}>Filed - {filed}</div>
              <div style={{ background: "#fdeaea", padding: "6px", borderRadius: "6px" }}>Pending - {pending}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginTop: "20px" }}>
        <div style={chartCard}><h4>Business Growth</h4><div style={chartWrap}><Line data={growthData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>
        <div style={chartCard}><h4 style={{ textAlign: "center" }}>Client Types</h4><div style={chartWrap}><Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} /></div></div>
        <div style={chartCard}><h4 style={{ textAlign: "center" }}>Growth Trend</h4><div style={chartWrap}><Bar data={trendData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></div>
      </div>

      {/* Types of Clients Table */}
      <div style={{ ...card, marginTop: "30px" }}>
        <h2 style={{ marginBottom: "16px", color: "#1f2a70" }}>Types of Clients</h2>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr 2fr 2fr" }}>
          <div style={headerCell}>Type</div>
          <div style={headerCell}>No. of Clients</div>
          <div style={headerCell}>Open List</div>
          <div style={headerCell}>Add Client</div>
        </div>

        {[
          { label: "Tax Payer (Regular)", count: allClients.filter(c => c.registrationType === "Regular").length },
          { label: "Tax Payer (Composition)", count: allClients.filter(c => c.registrationType === "Composition").length },
          { label: "Tax Deductor", count: 34 },
          { label: "Tax Collector (ECO)", count: 2 },
          { label: "Input Service Distributor (ISD)", count: 11 },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 2fr 2fr 2fr",
              alignItems: "center",
              borderBottom: "1px solid #e5e7eb",
              padding: "14px 0",
            }}
          >
            <div>{row.label}</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>{row.count}</div>
           <div style={{ textAlign: "center" }}>
  <button
    onClick={() => navigate("/user/clients")}
    style={{
      background: "#1f2a70",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: "500",
    }}
  >
    Open List
  </button>
</div>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowAddClientModal(true)}
                style={{ background: "#22c55e", color: "#fff", padding: "8px 14px", borderRadius: "8px", border: "none", fontWeight: "600" }}
              >
                <HiPlus style={{ marginRight: "6px", display: "inline" }} /> Add Client
              </button>
            </div>
          </div>
        ))}
      </div>
        {showAddClientModal && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }} onClick={() => setShowAddClientModal(true)}>
            <div style={{
              background: "white",
              borderRadius: "24px",
              width: "900px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
            }} onClick={e => e.stopPropagation()}>
              <div style={{
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                padding: "30px",
                borderRadius: "24px 24px 0 0",
                color: "white",
                textAlign: "center"
              }}>
                <h2 style={{ margin: 0, fontSize: "2rem" }}>Add New Client</h2>
                <p>Client will be added with Active status</p>
              </div>
              <div style={{ padding: "40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                      Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input name="name" value={newClientForm.name} onChange={handleClientChange}
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                      Company Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input name="company" value={newClientForm.company} onChange={handleClientChange}
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                      GSTIN <span style={{ color: "red" }}>*</span>
                    </label>
                    <input name="gstin" value={newClientForm.gstin} onChange={handleClientChange} maxLength="15"
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                      Mobile <span style={{ color: "red" }}>*</span>
                    </label>
                    <input name="mobile" value={newClientForm.mobile} onChange={handleClientChange} maxLength="10"
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>PAN</label>
                    <input name="pan" value={newClientForm.pan} onChange={handleClientChange}
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Registration Date</label>
                    <input type="date" name="registrationDate" value={newClientForm.registrationDate} onChange={handleClientChange}
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Aadhaar</label>
                    <input name="aadhaar" value={newClientForm.aadhaar} onChange={handleClientChange}
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Pincode</label>
                    <input name="pincode" value={newClientForm.pincode} onChange={handleClientChange}
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Address</label>
                    <textarea name="address" value={newClientForm.address} onChange={handleClientChange} rows="3"
                      style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }}></textarea>
                  </div>
                </div>
                <div style={{ textAlign: "right", marginTop: "30px" }}>
                  <button onClick={() => setShowAddClientModal(true)}
                    style={{ padding: "12px 30px", marginRight: "15px", background: "#ddd", border: "none", borderRadius: "10px" }}>
                    Cancel
                  </button>
                  <button onClick={submitNewClient}
                    style={{ padding: "12px 40px", background: "#7c3aed", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold" }}>
                    Submit Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
    const VouchersPage = () => {
    const [activeTab, setActiveTab] = useState("vouchers"); // default tab

    const tabTitles = {
      vouchers: "Vouchers",
      sales: "Sales Invoice",
      purchase: "Purchase Bill",
      receipt: "Receipt",
      payment: "Payment",
    };

    const handleUpload = (e) => {
      if (e.target.files.length > 0) {
        toast.success(`${tabTitles[activeTab]} uploaded successfully!`);
      }
    };

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = "data:application/pdf;base64,..."; // replace with real base64 if needed
      link.download = `sample_${activeTab}.pdf`;
      link.click();
      toast.success(`Sample ${tabTitles[activeTab]} downloaded!`);
    };

    return (
      <div className="full-width-page">
        <div className="card">
          <h2 style={{ marginBottom: "30px", color: "#7c3aed" }}>
            Document Management
          </h2>

          {/* Tab Buttons */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
            gap: "12px", 
            marginBottom: "40px" 
          }}>
            {["vouchers", "sales", "purchase", "receipt", "payment"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "16px",
                  background: activeTab === tab ? "#7c3aed" : "#e0e0e0",
                  color: activeTab === tab ? "white" : "#333",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: activeTab === tab ? "0 6px 20px rgba(124,58,237,0.3)" : "none",
                }}
              >
                {tabTitles[tab]}
              </button>
            ))}
          </div>

          {/* Upload & Download Section - Changes based on active tab */}
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "24px", fontSize: "1.6rem", color: "#333" }}>
              Upload {tabTitles[activeTab]}
            </h3>

            <div style={{ marginBottom: "30px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
              <label style={{ display: "block", marginBottom: "12px", fontWeight: "600" }}>
                Upload {tabTitles[activeTab]} (PDF only):
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px dashed #7c3aed",
                  borderRadius: "12px",
                  background: "#f8f4ff",
                  cursor: "pointer",
                }}
              />
            </div>

            <button
              onClick={handleDownload}
              style={{
                background: "#7c3aed",
                color: "white",
                padding: "16px 36px",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 6px 20px rgba(124,58,237,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <HiDownload style={{ fontSize: "1.4rem" }} />
              Download Sample {tabTitles[activeTab]} PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GSTReturnsPage = () => {
  const [selectedReturn, setSelectedReturn] = useState("GSTR-1");
  const [filterView, setFilterView] = useState("all");

  // Realistic GST Filing Data
  const gstFilingData = [
    { sl: 1, name: "MODERN MASTER PUBLICATION", gstin: "09QACPS3544H1Z4", filingType: "Monthly", turnover: "₹45,20,000", taxLiability: "₹8,13,600", status: "Filed", dateOfFiling: "2025-11-20" },
    { sl: 2, name: "M/s BHARAT KHADI UDYOG", gstin: "09AYCPA3837B1ZX", filingType: "Monthly", turnover: "₹32,10,500", taxLiability: "₹5,77,890", status: "Not Filed", dateOfFiling: "" },
    { sl: 3, name: "N S TRADERS", gstin: "09BKBPS9165E1ZS", filingType: "Monthly", turnover: "₹68,45,000", taxLiability: "₹12,32,100", status: "Filed", dateOfFiling: "2025-11-18" },
    { sl: 4, name: "NEERAJ AGENCIES", gstin: "09BRXPR8342B1Z6", filingType: "Monthly", turnover: "₹19,80,000", taxLiability: "₹3,56,400", status: "Not Filed", dateOfFiling: "" },
    { sl: 5, name: "WOOD CRAFT FURNITURE", gstin: "09DILPS7916D1ZR", filingType: "Monthly", turnover: "₹55,30,000", taxLiability: "₹9,95,400", status: "Filed", dateOfFiling: "2025-11-21" },
    { sl: 6, name: "SHIFA HANDLOOM", gstin: "09COYPM9918R1ZA", filingType: "Quarterly", turnover: "₹28,70,000", taxLiability: "₹5,16,600", status: "Not Filed", dateOfFiling: "" },
    { sl: 7, name: "I R TEXTILES", gstin: "09ABBPI9410Q1Z9", filingType: "Monthly", turnover: "₹41,25,000", taxLiability: "₹7,42,500", status: "Filed", dateOfFiling: "2025-11-19" },
    { sl: 8, name: "META TRADING COMPANY", gstin: "09DQWPA8816B1ZL", filingType: "Monthly", turnover: "₹73,15,000", taxLiability: "₹13,16,700", status: "Not Filed", dateOfFiling: "" },
    { sl: 9, name: "KRISHNA ENTERPRISES", gstin: "09AXZPK5678L1Z2", filingType: "Monthly", turnover: "₹61,40,000", taxLiability: "₹11,05,200", status: "Filed", dateOfFiling: "2025-11-17" },
    { sl: 10, name: "SINGH BROTHERS", gstin: "09BHFPS4321M1Z5", filingType: "Quarterly", turnover: "₹22,50,000", taxLiability: "₹4,05,000", status: "Filed", dateOfFiling: "2025-11-15" },
  ];

  // Filter data based on Filed / Not Filed / All
  const filteredData = gstFilingData.filter(item => {
    if (filterView === "filed") return item.status === "Filed";
    if (filterView === "not_filed") return item.status === "Not Filed";
    return true;
  });

  // Download as Excel using SheetJS (already popular & lightweight)
  const downloadExcel = () => {
    // We'll use a CDN version of SheetJS in index.html (add this once)
    if (typeof XLSX === "undefined") {
      toast.error("Excel library not loaded. Please refresh.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedReturn);

    // Styling header
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "7c3aed" } },
        alignment: { horizontal: "center" }
      };
    }

    XLSX.writeFile(workbook, `${selectedReturn}_Filing_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
    toast.success("Excel report downloaded successfully!");
  };

  return (
    <div className="full-width-page">
      <div className="card">
        <h2 style={{ color: "#7c3aed", marginBottom: "30px" }}>GST Returns Filing Status</h2>

        {/* Return Type Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap" }}>
          {["GSTR-1", "GSTR-3B", "GSTR-7"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedReturn(type)}
              style={{
                padding: "14px 24px",
                background: selectedReturn === type ? "#7c3aed" : "#e0e0e0",
                color: selectedReturn === type ? "white" : "#333",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: selectedReturn === type ? "0 6px 20px rgba(124,58,237,0.3)" : "none",
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setFilterView("all")} style={{ padding: "10px 20px", background: filterView === "all" ? "#7c3aed" : "#f0f0f0", color: filterView === "all" ? "white" : "#333", border: "none", borderRadius: "8px" }}>
            All ({gstFilingData.length})
          </button>
          <button onClick={() => setFilterView("filed")} style={{ padding: "10px 20px", background: filterView === "filed" ? "#22c55e" : "#f0f0f0", color: filterView === "filed" ? "white" : "#333", border: "none", borderRadius: "8px" }}>
            Filed ({gstFilingData.filter(i => i.status === "Filed").length})
          </button>
          <button onClick={() => setFilterView("not_filed")} style={{ padding: "10px 20px", background: filterView === "not_filed" ? "#ef4444" : "#f0f0f0", color: filterView === "not_filed" ? "white" : "#333", border: "none", borderRadius: "8px" }}>
            Not Filed ({gstFilingData.filter(i => i.status === "Not Filed").length})
          </button>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: "auto", marginBottom: "30px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#7c3aed", color: "white" }}>
                <th style={{ padding: "14px", textAlign: "left" }}>Sl No</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Client Name</th>
                <th style={{ padding: "14px", textAlign: "left" }}>GSTIN</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Filing Type</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Turnover</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Tax Liability</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "14px", textAlign: "left" }}>Filing Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.sl} style={{ background: item.status === "Filed" ? "#f0fdf4" : "#fef2f2", borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "14px" }}>{item.sl}</td>
                  <td style={{ padding: "14px", fontWeight: "500" }}>{item.name}</td>
                  <td style={{ padding: "14px" }}>{item.gstin}</td>
                  <td style={{ padding: "14px" }}>{item.filingType}</td>
                  <td style={{ padding: "14px" }}>{item.turnover}</td>
                  <td style={{ padding: "14px" }}>{item.taxLiability}</td>
                  <td style={{ padding: "14px" }}>
                    <span style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      background: item.status === "Filed" ? "#d4edda" : "#f8d7da",
                      color: item.status === "Filed" ? "#155724" : "#721c24",
                      fontWeight: "600"
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px" }}>{item.dateOfFiling || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Download Excel Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={downloadExcel}
            style={{
              background: "#10b981",
              color: "white",
              padding: "16px 40px",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.2rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 8px 25px rgba(16,185,129,0.3)",
            }}
          >
            <HiDownload style={{ fontSize: "1.6rem" }} />
            Download Excel Report
          </button>
        </div>
      </div>
    </div>
  );
};

  const DocumentsPage = () => {
    const handleUpload = () => toast.success("Document uploaded successfully!");
    const handleDownload = () => toast.success("Document downloaded!");
    return (
      <div className="full-width-page">
        <div className="card">
          <h2>Documents</h2>
          <div style={{ marginBottom: "20px" }}>
            <label>Upload Document: </label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} />
          </div>
          <button onClick={handleDownload}>
            <HiDownload style={{ marginRight: "8px" }} />
            Download Sample Document
          </button>
        </div>
      </div>
    );
  };

  const [selectedReport, setSelectedReport] = useState(null);
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerateReport = () => {
    if (!reportFromDate || !reportToDate) {
      toast.error("Please select from and to dates");
      return;
    }
    toast.success(`${selectedReport} report generated!`);
    setGeneratedReport({
      type: selectedReport,
      content: `Dummy data for ${selectedReport} from ${reportFromDate} to ${reportToDate}. Entries: 50, Total: ₹5 Cr.`,
    });
  };

 const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [filterView, setFilterView] = useState("all");

  const filteredFilingList = filingList.filter(item => {
    if (filterView === "filed") return item.status === "Filed";
    if (filterView === "not_filed") return item.status === "Not Filed";
    return true;
  });

  const filedCount = filingList.filter(item => item.status === "Filed").length;
  const notFiledCount = filingList.filter(item => item.status === "Not Filed").length;

  const handleGenerateReport = () => {
    if (!reportFromDate || !reportToDate) {
      toast.error("Please select both From and To dates");
      return;
    }
    if (new Date(reportFromDate) > new Date(reportToDate)) {
      toast.error("From date cannot be after To date");
      return;
    }

    let title = "";
    let content = "";

    switch (selectedReport) {
      case "GSTR-1 Summary Report":
        title = "GSTR-1 Outward Supplies Summary";
        content = `GSTR-1 Summary Report\nPeriod: ${reportFromDate} to ${reportToDate}\n\n`;
        content += `Total Taxable Value: ₹4,85,20,000\n`;
        content += `Total IGST: ₹87,33,600\n`;
        content += `Total CGST + SGST: ₹87,33,600\n`;
        content += `Total Invoices: 1,248\n`;
        content += `B2B: 892 | B2C: 356\n`;
        content += `Credit/Debit Notes: 48\n`;
        content += `Exports: ₹28,70,000\n`;
        content += `Nil Rated/Exempt: ₹12,50,000\n\n`;
        content += `Status: Ready for Filing`;
        break;

      case "GSTR-3B Summary Report":
        title = "GSTR-3B Monthly Return Summary";
        content = `GSTR-3B Summary Report\nPeriod: ${reportFromDate} to ${reportToDate}\n\n`;
        content += `Outward Supplies: ₹4,85,20,000\n`;
        content += `Tax Liability:\n`;
        content += `  • IGST: ₹87,33,600\n`;
        content += `  • CGST: ₹43,66,800\n`;
        content += `  • SGST: ₹43,66,800\n`;
        content += `Total Tax Payable: ₹1,74,67,200\n\n`;
        content += `ITC Claimed: ₹1,36,80,000\n`;
        content += `Net Tax Payable: ₹37,87,200\n`;
        content += `Cash Paid: ₹15,00,000\n`;
        content += `ITC Utilized: ₹22,87,200\n\n`;
        content += `Status: Draft Saved`;
        break;

      case "Input Tax Credit (ITC) Ledger":
        title = "Input Tax Credit (ITC) Ledger";
        content = `ITC Ledger Report\nPeriod: ${reportFromDate} to ${reportToDate}\n\n`;
        content += `Opening ITC Balance: ₹2,20,50,000\n`;
        content += `ITC Added This Period: ₹1,36,80,000\n`;
        content += `ITC Reversed: ₹8,40,000\n`;
        content += `ITC Utilized: ₹98,73,000\n\n`;
        content += `Closing Balance:\n`;
        content += `  • IGST: ₹1,28,50,000\n`;
        content += `  • CGST: ₹61,33,500\n`;
        content += `  • SGST: ₹61,33,500\n`;
        content += `Total Unutilized ITC: ₹2,51,17,000\n\n`;
        content += `Reconciliation: 98.7% Matched with 2A`;
        break;

      case "GSTR-7 Reconciliation Report":
        title = "GSTR-7 TDS Reconciliation";
        content = `GSTR-7 TDS Report\nPeriod: ${reportFromDate} to ${reportToDate}\n\n`;
        content += `Total TDS Deducted: ₹18,45,000\n`;
        content += `TDS Certificates Received: 142\n`;
        content += `TDS Paid to Govt: ₹18,45,000\n`;
        content += `TDS Credit Claimed: ₹18,45,000\n`;
        content += `Pending Credit: ₹0\n\n`;
        content += `Discrepancies: None\n`;
        content += `Compliance: 100% Filed`;
        break;

      case "Annual Return (GSTR-9) Preview":
        title = "GSTR-9 Annual Return Preview (FY 2024-25)";
        content = `GSTR-9 Annual Return Preview\nFinancial Year: 2024-25\n\n`;
        content += `Total Turnover: ₹58,22,40,000\n`;
        content += `Taxable Supplies: ₹52,10,50,000\n`;
        content += `Total Tax Paid: ₹10,48,03,200\n`;
        content += `ITC Claimed: ₹7,85,00,000\n`;
        content += `ITC Reversed: ₹45,00,000\n`;
        content += `Net Liability: ₹2,18,03,200\n\n`;
        content += `Reconciliation Status:\n`;
        content += `  • GSTR-1 vs Books: 99.8%\n`;
        content += `  • GSTR-3B vs Books: 99.6%\n`;
        content += `  • 2A vs Claimed ITC: 98.9%\n\n`;
        content += `Draft Ready for Final Review`;
        break;

      case "Sales & Purchase Register":
        title = "Sales & Purchase Register Summary";
        content = `Sales & Purchase Register\nPeriod: ${reportFromDate} to ${reportToDate}\n\n`;
        content += `SALES SUMMARY\n`;
        content += `Taxable Sales: ₹4,85,20,000\n`;
        content += `Exempt/Nil Rated: ₹12,50,000\n`;
        content += `Exports: ₹28,70,000\n`;
        content += `Total Sales: ₹5,26,40,000\n\n`;
        content += `PURCHASE SUMMARY\n`;
        content += `Taxable Purchases: ₹3,85,50,000\n`;
        content += `ITC Eligible: ₹69,39,000\n`;
        content += `RCM Purchases: ₹15,80,000\n`;
        content += `Imports: ₹22,40,000\n`;
        content += `Total Purchases: ₹4,23,70,000`;
        break;

      default:
        content = "Report data will appear here after generation.";
    }

    setGeneratedReport({
      type: title || selectedReport,
      content: content,
    });

    toast.success(`${selectedReport} generated successfully!`);
  };

  const handleDownloadReport = () => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${generatedReport.type.replace(/[^a-z0-9]/gi, '_')}_${reportFromDate}_to_${reportToDate}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  const isGSTR1or3B = selectedReport && (selectedReport.includes("GSTR-1") || selectedReport.includes("GSTR-3B"));

  return (
    <div className="full-width-page">
      <div className="card">
        <h2 style={{ color: "#7c3aed", marginBottom: "30px" }}>Reports</h2>

        {/* Report Buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "18px",
          marginBottom: "40px"
        }}>
          {[
            "GSTR-1 Summary Report",
            "GSTR-3B Summary Report",
            "Input Tax Credit (ITC) Ledger",
            "GSTR-7 Reconciliation Report",
            "Annual Return (GSTR-9) Preview",
            "Sales & Purchase Register",
          ].map((report) => ( 
            <button
              key={report}
              onClick={() => {
                setSelectedReport(report);
                setGeneratedReport(null);
                setFilterView("all");
              }}
              style={{
                padding: "20px",
                textAlign: "left",
                background: selectedReport === report ? "#7c3aed" : "#f0f0ff",
                color: selectedReport === report ? "white" : "#333",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: selectedReport === report ? "700" : "500",
                boxShadow: selectedReport === report ? "0 10px 30px rgba(124,58,237,0.3)" : "0 4px 15px rgba(0,0,0,0.05)",
                transform: selectedReport === report ? "translateY(-6px)" : "none",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (selectedReport !== report) {
                  e.currentTarget.style.background = "#e0d4ff";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }
              }}
              onMouseOut={(e) => {
                if (selectedReport !== report) {
                  e.currentTarget.style.background = "#f0f0ff";
                  e.currentTarget.style.transform = "none";
                }
              }}
            >
            
              {report}
            </button>
          ))}
        </div>

        {/* Selected Report Section */}
        {selectedReport && (
          <div style={{
            padding: "35px",
            background: "#f8f9ff",
            borderRadius: "18px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ color: "#7c3aed", marginBottom: "30px", fontSize: "1.8rem" }}>
              {selectedReport}
            </h3>

            <div style={{ display: "flex", gap: "30px", marginBottom: "35px", flexWrap: "wrap" }}>
              <div>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>From Date</label>
                <input
                  type="date"
                  value={reportFromDate}
                  onChange={(e) => setReportFromDate(e.target.value)}
                  style={{ padding: "14px", border: "1px solid #ddd", borderRadius: "10px", width: "220px", fontSize: "1rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>To Date</label>
                <input
                  type="date"
                  value={reportToDate}
                  onChange={(e) => setReportToDate(e.target.value)}
                  style={{ padding: "14px", border: "1px solid #ddd", borderRadius: "10px", width: "220px", fontSize: "1rem" }}
                />
              </div>
            </div>

            {/* Filters for GSTR-1 & GSTR-3B */}
            {isGSTR1or3B && (
              <div style={{ marginBottom: "30px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={() => setFilterView("all")}
                  style={{ padding: "12px 20px", background: filterView === "all" ? "#7c3aed" : "#e0e0e0", color: filterView === "all" ? "white" : "#333", border: "none", borderRadius: "10px", fontWeight: "600" }}>
                  All ({filingList.length})
                </button>
                <button onClick={() => setFilterView("filed")}
                  style={{ padding: "12px 20px", background: filterView === "filed" ? "#22c55e" : "#e0e0e0", color: filterView === "filed" ? "white" : "#333", border: "none", borderRadius: "10px", fontWeight: "600" }}>
                  Filed ({filedCount})
                </button>
                <button onClick={() => setFilterView("not_filed")}
                  style={{ padding: "12px 20px", background: filterView === "not_filed" ? "#ef4444" : "#e0e0e0", color: filterView === "not_filed" ? "white" : "#333", border: "none", borderRadius: "10px", fontWeight: "600" }}>
                  Not Filed ({notFiledCount})
                </button>
              </div>
            )}

            <button
              onClick={handleGenerateReport}
              style={{
                background: "#7c3aed",
                color: "white",
                padding: "16px 50px",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.2rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(124,58,237,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Generate Report
            </button>

            {/* Generated Report */}
            {generatedReport && (
              <div style={{ marginTop: "40px" }}>
                <h4 style={{ color: "#7c3aed", marginBottom: "20px", fontSize: "1.5rem" }}>
                  {generatedReport.type}
                </h4>
                <div style={{
                  background: "white",
                  padding: "35px",
                  borderRadius: "16px",
                  border: "1px solid #eee",
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  lineHeight: "1.9",
                  maxHeight: "520px",
                  overflowY: "auto",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                }}>
                  {generatedReport.content}
                </div>

                <div style={{ textAlign: "center", marginTop: "35px" }}>
                  <button
                    onClick={handleDownloadReport}
                    style={{
                      background: "#10b981",
                      color: "white",
                      padding: "18px 50px",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "14px",
                      boxShadow: "0 8px 25px rgba(16,185,129,0.3)",
                    }}
                  >
                    <HiDownload style={{ fontSize: "1.8rem" }} />
                    Download Report
                  </button>
                </div>
              </div>
            )}

            {/* Live Preview Table */}
            {isGSTR1or3B && !generatedReport && (
              <div style={{ marginTop: "40px", overflowX: "auto" }}>
                <h4 style={{ marginBottom: "20px", color: "#7c3aed" }}>Live Client Filing Preview</h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f0f0ff" }}>
                      <th style={{ padding: "16px", textAlign: "left" }}>Client Name</th>
                      <th style={{ padding: "16px", textAlign: "left" }}>GSTIN</th>
                      <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFilingList.map((item) => (
                      <tr key={item.sl} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "16px" }}>{item.name}</td>
                        <td style={{ padding: "16px" }}>{item.gstin}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "8px 16px",
                            borderRadius: "30px",
                            fontWeight: "600",
                            background: item.status === "Filed" ? "#d4edda" : "#f8d7da",
                            color: item.status === "Filed" ? "#155724" : "#721c24",
                          }}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
  const NotificationsPage = () => (
    <div className="full-width-page">
      <div className="card">
        <h2>Notifications</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ padding: "15px 0", borderBottom: "1px solid #eee" }}>GSTR-3B due for ABC Corp in 3 days</li>
          <li style={{ padding: "15px 0", borderBottom: "1px solid #eee" }}>New voucher uploaded for XYZ Ltd</li>
          <li style={{ padding: "15px 0", borderBottom: "1px solid #eee" }}>GSTR-7 reconciled successfully for Dec 2025</li>
          <li style={{ padding: "15px 0", borderBottom: "1px solid #eee" }}>Reminder: Missing documents from Tech Solutions</li>
        </ul>
      </div>
    </div>
  );

  

  // Notification preferences state
  

  

  const [selectedSetting, setSelectedSetting] = useState("profile");

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

 

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast.error("All fields are required!");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("New password and confirmation do not match!");
      return;
    }
    if (passwordForm.newPass.length < 6) {
      toast.error("New password must be at least 6 characters!");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    whatsapp: true,
    dueReminders: true,
    voucherAlerts: true,
    reportAlerts: false,
  });

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} notifications ${!notifications[key] ? "enabled" : "disabled"}`);
  };
  const SettingsPage = () => (
  <div className="full-width-page" style={{ padding: "20px" }}>
    <div style={{
      maxWidth: "1100px",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{ background: "#7c3aed", padding: "30px", textAlign: "center", color: "white" }}>
        <h2 style={{ fontSize: "2rem", margin: 0, fontWeight: "700" }}>Settings</h2>
        <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Manage your profile, security, notifications, and plan</p>
      </div>

      <div style={{ display: "flex" }}>
        {/* Compact Sidebar - Takes less space */}
        <div style={{ 
          width: "240px", 
          background: "#f9fafb", 
          padding: "20px 15px",
          borderRight: "1px solid #eee"
        }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { key: "profile", icon: HiUser, label: "Edit Profile" },
              { key: "password", icon: HiLockClosed, label: "Change Password" },
              { key: "notifications", icon: HiBell, label: "Notifications" },
              { key: "billing", icon: HiCreditCard, label: "Billing & Plan" },
            ].map(item => (
              <li key={item.key} style={{ marginBottom: "8px" }}>
                <button
                  onClick={() => setSelectedSetting(item.key)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: selectedSetting === item.key ? "#7c3aed" : "transparent",
                    color: selectedSetting === item.key ? "white" : "#444",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: selectedSetting === item.key ? "600" : "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    if (selectedSetting !== item.key) e.currentTarget.style.background = "#e0d4ff";
                  }}
                  onMouseOut={(e) => {
                    if (selectedSetting !== item.key) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <item.icon style={{ fontSize: "1.3rem" }} />
                 
                  {item.label}
                </button>
              </li>
            ))}

            <li style={{ marginTop: "40px" }}>
              <button
                onClick={() => {
                  toast.success("Logged out successfully!");
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                <HiLogout /> Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: "40px 50px" }}>
          {selectedSetting === "profile" && (
            <div>
              <h3 style={{ fontSize: "1.7rem", color: "#333", marginBottom: "30px" }}>Edit Profile</h3>
              <div style={{ maxWidth: "550px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>Name</label>
                  <input
                    name="name"
                    value={editProfileForm.name || ""}
                    onChange={handleEditProfileChange}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem" }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    value={editProfileForm.dob || ""}
                    onChange={handleEditProfileChange}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem" }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>Gender</label>
                  <select
                    name="gender"
                    value={editProfileForm.gender || ""}
                    onChange={handleEditProfileChange}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem" }}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>Company</label>
                  <input
                    name="company"
                    value={editProfileForm.company || ""}
                    onChange={handleEditProfileChange}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem" }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>GSTIN</label>
                  <input
                    name="gstin"
                    value={editProfileForm.gstin || ""}
                    onChange={handleEditProfileChange}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem" }}
                  />
                </div>
                <div style={{ marginBottom: "30px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={editProfileForm.email || ""}
                    onChange={handleEditProfileChange}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "1rem" }}
                  />
                </div>
                <button
                  onClick={saveEditedProfile}
                  style={{
                    background: "#7c3aed",
                    color: "white",
                    padding: "14px 40px",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {selectedSetting === "password" && (
            <div>
              <h3 style={{ fontSize: "1.7rem", color: "#333", marginBottom: "30px" }}>Change Password</h3>
              <div style={{ maxWidth: "500px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd" }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd" }}
                  />
                </div>
                <div style={{ marginBottom: "30px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#444" }}>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd" }}
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  style={{
                    background: "#7c3aed",
                    color: "white",
                    padding: "14px 40px",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {selectedSetting === "notifications" && (
            <div>
              <h3 style={{ fontSize: "1.7rem", color: "#333", marginBottom: "30px" }}>Notification Preferences</h3>
              <div style={{ maxWidth: "650px" }}>
                <div style={{ background: "#f0f8ff", padding: "25px", borderRadius: "14px", marginBottom: "25px" }}>
                  <h4 style={{ margin: "0 0 20px 0", color: "#1e40af", fontSize: "1.2rem" }}>Communication Channels</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "500" }}>Email Notifications</span>
                    <input type="checkbox" checked={notifications.email} onChange={() => toggleNotification("email")} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "500" }}>SMS Alerts</span>
                    <input type="checkbox" checked={notifications.sms} onChange={() => toggleNotification("sms")} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "500" }}>WhatsApp Messages</span>
                    <input type="checkbox" checked={notifications.whatsapp} onChange={() => toggleNotification("whatsapp")} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                </div>

                <div style={{ background: "#f0fdf4", padding: "25px", borderRadius: "14px" }}>
                  <h4 style={{ margin: "0 0 20px 0", color: "#166534", fontSize: "1.2rem" }}>Alert Types</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "500" }}>Return Due Reminders</span>
                    <input type="checkbox" checked={notifications.dueReminders} onChange={() => toggleNotification("dueReminders")} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "500" }}>Pending Voucher Alerts</span>
                    <input type="checkbox" checked={notifications.voucherAlerts} onChange={() => toggleNotification("voucherAlerts")} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "500" }}>Monthly Report Summary</span>
                    <input type="checkbox" checked={notifications.reportAlerts} onChange={() => toggleNotification("reportAlerts")} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSetting === "billing" && (
            <div>
              <h3 style={{ fontSize: "1.7rem", color: "#333", marginBottom: "30px" }}>Billing & Subscription Plan</h3>
              <div style={{ background: "#f0f5ff", padding: "30px", borderRadius: "16px", maxWidth: "700px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.5rem", color: "#7c3aed" }}>Current Plan: <strong>Professional</strong></h4>
                    <p style={{ margin: "10px 0", color: "#555" }}>Valid until: <strong>December 31, 2026</strong></p>
                  </div>
                  <span style={{ padding: "12px 24px", background: "#d4edda", color: "#155724", borderRadius: "30px", fontSize: "1rem", fontWeight: "600" }}>
                    Active
                  </span>
                </div>

                <h5 style={{ margin: "25px 0 15px 0", color: "#333" }}>Plan Features</h5>
                <ul style={{ paddingLeft: "25px", lineHeight: "2", color: "#444", fontSize: "1.05rem" }}>
                  <li>Unlimited Clients</li>
                  <li>50 GB Document Storage</li>
                  <li>GSTR-1, 3B, 7 Filing Support</li>
                  <li>Priority Email & Phone Support</li>
                  <li>Advanced Reports & Analytics</li>
                  <li>Multi-User Access</li>
                </ul>

                <div style={{ display: "flex", gap: "20px", margin: "35px 0" }}>
                  <button style={{ padding: "16px 35px", background: "#10b981", color: "white", border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer" }}>
                    Renew Plan
                  </button>
                  <button style={{ padding: "16px 35px", background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer" }}>
                    Upgrade to Enterprise
                  </button>
                </div>

                <div style={{ paddingTop: "25px", borderTop: "1px solid #ddd" }}>
                  <h5 style={{ margin: "0 0 10px 0" }}>Last Payment</h5>
                  <p style={{ margin: 0, color: "#555" }}>₹24,999 - Paid on January 1, 2025</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

let pageContent;

switch (location.pathname) {
  case "/user":
    pageContent = (
      <DashboardHome
        allClients={allClients}
        addClient={addClient}   
        navigate={navigate} 
      />
    );
    break;

case "/user/clients":
  pageContent = (
    <ClientsPage
      allClients={allClients}
      clientViewMode={clientViewMode}
      setClientViewMode={setClientViewMode}
      selectedClient={selectedClient}
      setSelectedClient={setSelectedClient}
      activateClient={activateClient}
      deactivateClient={deactivateClient}
      deleteClient={deleteClient}
    />
  );
  break;

  case "/user/vouchers":
    pageContent = <VouchersPage />;
    break;

  case "/user/returns":
    pageContent = <GSTReturnsPage />;
    break;

  case "/user/documents":
    pageContent = <DocumentsPage />;
    break;

  case "/user/reports":
    pageContent = <ReportsPage />;
    break;

  case "/user/notifications":
    pageContent = <NotificationsPage />;
    break;

  case "/user/settings":
    pageContent = <SettingsPage />;
    break;

  default:
    pageContent = (
      <DashboardHome
        allClients={allClients}
        addClient={addClient}
        navigate={navigate}
      />
    );
}


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src="/tax.jpg" alt="SmartGST" style={{ width: "140px", filter: "brightness(1.3)" }} />
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            {sidebarCollapsed ? <HiMenu /> : <HiArrowLeft />}
          </button>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li className="sidebar-item" key={index}>
              <Link to={item.link} className="sidebar-link">
                
                <span className="sidebar-text">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className={`dashboard-main ${sidebarCollapsed ? "collapsed" : ""}`}>
        <header className="dashboard-navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: "#0d048a", borderBottom: "1px solid #eee" }}>
          <div className="company-info">
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.6rem" , color:"white" }}>{user.company}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ width: "10px", height: "10px", background: "#22c55e", borderRadius: "50%", display: "inline-block" }}></span>
              <span style={{ fontSize: "0.95rem" }}>Status: Active</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "25px", position: "relative" }}>
            <button className="dark-toggle" onClick={toggleDarkMode} style={{ background: "none", border: "none", fontSize: "1.6rem", cursor: "pointer" }}>
              {darkMode ? <HiSun /> : <HiMoon />}
            </button>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    background: "blue",
                    color: "black",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  {user.name?.charAt(0)}
                </div>

                <div style={{ textAlign: "left" }}>
                  <div>{user.name}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                    {user.role}
                  </div>
                </div>
              </button>

              {showUserDropdown && (
                <div style={{
                  position: "absolute",
                  top: "65px",
                  right: 0,
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  width: "240px",
                  zIndex: 1000,
                  overflow: "hidden",
                  border: "1px solid #eee",
                }}>
                  <button
                    onClick={() => {
                      setEditProfileForm({ ...user });
                      setShowEditProfileModal(true);
                      setShowUserDropdown(false);
                    }}
                    style={{ width: "100%", padding: "14px 18px", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}
                  >
                    <HiUser style={{ fontSize: "1.2rem" }} /> Edit Profile
                  </button>
                  <Link
                    to="/user/settings"
                    onClick={() => setShowUserDropdown(false)}
                    style={{ display: "block", padding: "14px 18px", textDecoration: "none", color: "#333", display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}
                  >
                    <HiCog style={{ fontSize: "1.2rem" }} /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowContactModal(true);
                      setShowUserDropdown(false);
                    }}
                    style={{ width: "100%", padding: "14px 18px", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}
                  >
                    <HiPhone style={{ fontSize: "1.2rem" }} /> Contact Us
                  </button>
                  <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #eee" }} />
                  <button
                    onClick={() => {
                      toast.success("Logged out successfully!");
                      setShowUserDropdown(false);
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      navigate("/login");

                      // Add real logout logic here
                    }}
                    style={{ width: "100%", padding: "14px 18px", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", gap: "12px", fontSize: "1rem" }}
                  >
                    <HiLogout style={{ fontSize: "1.2rem" }} /> Logout
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </header>
        
        <div className="dashboard-content">
          {pageContent}
        </div>
      </main>
      {showContactModal && <ContactModal />}
      {showEditProfileModal && <EditProfileModal />}
    </>
  );
}
export default UserDashboard;

