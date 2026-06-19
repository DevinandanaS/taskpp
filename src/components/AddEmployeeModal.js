import React, { useState } from 'react';
import { employeeAPI } from '../utils/api';
import './AddEmployeeModal.css';

const AddEmployeeModal = ({ onClose, onSuccess, existingDepartments, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    employmentStatus: 'Active',
    joiningDate: new Date().toISOString().split('T')[0]
  });
  const [customDepartment, setCustomDepartment] = useState('');
  const [useCustomDepartment, setUseCustomDepartment] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const department = useCustomDepartment ? customDepartment : formData.department;

    if (!formData.name || !formData.email || !formData.role || !department) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      await employeeAPI.add({
        ...formData,
        department
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content add-modal ${darkMode ? 'dark-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Employee</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="role">Role *</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="department">Department *</label>
              {!useCustomDepartment ? (
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {existingDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                  <option value="custom">+ Add New Department</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  placeholder="Enter department name"
                  required
                />
              )}
              {formData.department === 'custom' && !useCustomDepartment && setUseCustomDepartment(true)}
            </div>
          </div>

          {useCustomDepartment && (
            <button
              type="button"
              className="back-to-select"
              onClick={() => {
                setUseCustomDepartment(false);
                setCustomDepartment('');
                setFormData({ ...formData, department: '' });
              }}
            >
              ← Back to existing departments
            </button>
          )}

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="employmentStatus">Employment Status *</label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="joiningDate">Joining Date *</label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
