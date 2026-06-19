import React from 'react';
import './EmployeeModal.css';

const EmployeeModal = ({ employee, onClose, darkMode }) => {
  if (!employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Employee Details</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{employee.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{employee.email}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Role:</span>
            <span className="detail-value">{employee.role}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{employee.department}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Employment Status:</span>
            <span className={`status-badge-modal ${employee.employmentStatus.toLowerCase()}`}>
              {employee.employmentStatus}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Joining Date:</span>
            <span className="detail-value">
              {new Date(employee.joiningDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
