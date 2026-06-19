import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../utils/api';
import EmployeeModal from './EmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departmentsCount: 0,
    departments: []
  });
  
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchAllEmployees();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, selectedDepartment, currentPage, sortOrder]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const fetchStats = async () => {
    try {
      const response = await employeeAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const response = await employeeAPI.getAll({
        page: 1,
        limit: 1000
      });
      setAllEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching all employees:', error);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getAll({
        search: searchTerm,
        department: selectedDepartment,
        page: currentPage,
        limit: 6,
        sortBy: 'joiningDate',
        sortOrder: sortOrder
      });
      
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentFilter = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const handleAddEmployee = () => {
    setShowAddModal(true);
  };

  const handleEmployeeAdded = () => {
    fetchStats();
    fetchEmployees();
    fetchAllEmployees();
    setShowAddModal(false);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchStats();
        fetchEmployees();
        fetchAllEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleDownload = () => {
    const employeeData = allEmployees.map(emp => 
      `Name: ${emp.name}\nEmail: ${emp.email}\nRole: ${emp.role}\nDepartment: ${emp.department}\nStatus: ${emp.employmentStatus}\nJoining Date: ${new Date(emp.joiningDate).toLocaleDateString()}\n${'='.repeat(50)}`
    ).join('\n\n');

    const content = `EMPLOYEE LIST\nGenerated: ${new Date().toLocaleString()}\nTotal Employees: ${stats.totalEmployees}\n${'='.repeat(50)}\n\n${employeeData}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index} className="highlight">{part}</mark> : part
    );
  };

  return (
    <div className={`modern-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">P</div>
            <span className="logo-text">PeopleHub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">MAIN</div>
            <button className="nav-item active">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-label">SETTINGS</div>
            <button className="nav-item" onClick={toggleDarkMode}>
              <span className="nav-icon">{darkMode ? '☀️' : '🌙'}</span>
              <span>Theme</span>
            </button>
            <button className="nav-item logout" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="user-profile">
            <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'Admin'}</div>
              <div className="user-role">HR Manager • PeopleHub</div>
            </div>
          </div>

          <div className="top-bar-actions">
            <button className="back-login-btn" onClick={() => navigate('/login')}>
              Back to Login
            </button>
            <button className="download-btn" onClick={handleDownload}>
              <span>⬇</span> Download
            </button>
          </div>
        </header>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-header">
            <div className="stats-info">
              <h2>{stats.totalEmployees} Employees</h2>
              <div className="stats-badges">
                <span className="badge badge-active">● Active {stats.activeEmployees}</span>
                <span className="badge badge-inactive">● Inactive {stats.totalEmployees - stats.activeEmployees}</span>
              </div>
            </div>
            <div className="stats-actions">
              <button className="btn-primary" onClick={handleAddEmployee}>
                <span>+</span> Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input-modern"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={handleDepartmentFilter}
                className="filter-select"
              >
                <option value="All">All Departments</option>
                {stats.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <button onClick={toggleSortOrder} className="sort-btn">
                {sortOrder === 'asc' ? '📅 Oldest First' : '📅 Newest First'}
              </button>
            </div>

            {/* Employee Cards Grid */}
            <div className="employee-grid">
              {loading ? (
                <div className="loading-state">Loading employees...</div>
              ) : employees.length === 0 ? (
                <div className="empty-state">No employees found</div>
              ) : (
                employees.map(employee => (
                  <div key={employee.id} className="employee-card">
                    <div className="card-header">
                      <div className="employee-avatar-wrapper">
                        <div className="employee-avatar">
                          {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <span className={`status-dot ${employee.employmentStatus.toLowerCase()}`}></span>
                      </div>
                      <button className="card-menu" onClick={() => handleViewDetails(employee)}>
                        ⋮
                      </button>
                    </div>

                    <div className="card-body">
                      <h3 className="employee-name">
                        {highlightText(employee.name, searchTerm)}
                      </h3>
                      <p className="employee-role">
                        {highlightText(employee.role, searchTerm)}
                      </p>

                      <div className="card-details">
                        <div className="detail-item">
                          <span className="detail-label">DEPARTMENT</span>
                          <span className="detail-value">{employee.department}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">JOINED DATE</span>
                          <span className="detail-value">
                            {new Date(employee.joiningDate).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="card-contact">
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          <span className="contact-text">{highlightText(employee.email, searchTerm)}</span>
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="btn-view" onClick={() => handleViewDetails(employee)}>
                          View Details
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteEmployee(employee.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-modern">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  ← Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`page-number ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next →
                </button>
              </div>
            )}
      </main>

      {showModal && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setShowModal(false)}
          darkMode={darkMode}
        />
      )}

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleEmployeeAdded}
          existingDepartments={stats.departments}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Dashboard;
