const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

// File path for storing employees
const employeesFilePath = path.join(__dirname, '../data/employees.txt');

// Load employees from file
const loadEmployees = () => {
  try {
    if (fs.existsSync(employeesFilePath)) {
      const data = fs.readFileSync(employeesFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading employees:', error);
  }
  
  // Return default employees if file doesn't exist
  const defaultEmployees = require('../data/employees');
  saveEmployees(defaultEmployees);
  return defaultEmployees;
};

// Save employees to file
const saveEmployees = (employees) => {
  try {
    fs.writeFileSync(employeesFilePath, JSON.stringify(employees, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving employees:', error);
  }
};

// Get all employees with filtering, searching, sorting, and pagination
router.get('/', authMiddleware, (req, res) => {
  try {
    const employees = loadEmployees();
    let filteredEmployees = [...employees];

    // Search by name, email, or role
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.role.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by department
    if (req.query.department && req.query.department !== 'All') {
      filteredEmployees = filteredEmployees.filter(
        emp => emp.department === req.query.department
      );
    }

    // Sort by joining date
    if (req.query.sortBy === 'joiningDate') {
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      filteredEmployees.sort((a, b) => {
        const dateA = new Date(a.joiningDate);
        const dateB = new Date(b.joiningDate);
        return (dateA - dateB) * sortOrder;
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    res.json({
      employees: paginatedEmployees,
      currentPage: page,
      totalPages: Math.ceil(filteredEmployees.length / limit),
      totalEmployees: filteredEmployees.length
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get employee by ID
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const employees = loadEmployees();
    const employee = employees.find(emp => emp.id === parseInt(req.params.id));
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get dashboard statistics
router.get('/stats/dashboard', authMiddleware, (req, res) => {
  try {
    const employees = loadEmployees();
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.employmentStatus === 'Active').length;
    const departments = [...new Set(employees.map(emp => emp.department))];
    const departmentsCount = departments.length;

    res.json({
      totalEmployees,
      activeEmployees,
      departmentsCount,
      departments
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add new employee
router.post('/', authMiddleware, (req, res) => {
  try {
    const employees = loadEmployees();
    const { name, email, role, department, employmentStatus, joiningDate } = req.body;

    // Validate required fields
    if (!name || !email || !role || !department || !employmentStatus || !joiningDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    if (employees.find(emp => emp.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate new ID
    const newId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;

    const newEmployee = {
      id: newId,
      name,
      email,
      role,
      department,
      employmentStatus,
      joiningDate
    };

    employees.push(newEmployee);
    saveEmployees(employees);

    res.status(201).json({
      message: 'Employee added successfully',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete employee
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const employees = loadEmployees();
    const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));

    if (employeeIndex === -1) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const deletedEmployee = employees.splice(employeeIndex, 1);
    saveEmployees(employees);

    res.json({
      message: 'Employee deleted successfully',
      employee: deletedEmployee[0]
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
