const express = require('express');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const Joi = require('joi');
const winston = require('winston');

const router = express.Router();
const EXCEL_FILE = path.join(__dirname, '../employees.xlsx');
const SHEET_NAME = 'Employees';

// Configure logger for this module
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'employee-routes' },
  transports: [
    new winston.transports.File({ filename: 'employee.log' }),
  ],
});

// Validation schemas
const employeeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  department: Joi.string().min(2).max(50).required()
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  department: Joi.string().min(2).max(50)
});

// Validation middleware
const validateEmployee = (req, res, next) => {
  const { error } = employeeSchema.validate(req.body);
  if (error) {
    logger.warn('Validation error:', { error: error.details[0].message, body: req.body });
    return res.status(400).json({ 
      error: 'Validation error', 
      message: error.details[0].message 
    });
  }
  next();
};

const validateUpdateEmployee = (req, res, next) => {
  const { error } = updateEmployeeSchema.validate(req.body);
  if (error) {
    logger.warn('Update validation error:', { error: error.details[0].message, body: req.body });
    return res.status(400).json({ 
      error: 'Validation error', 
      message: error.details[0].message 
    });
  }
  next();
};

function readEmployees() {
  try {
    if (!fs.existsSync(EXCEL_FILE)) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
      XLSX.writeFile(wb, EXCEL_FILE);
      logger.info('Created new Excel file');
      return [];
    }
    const wb = XLSX.readFile(EXCEL_FILE);
    const ws = wb.Sheets[SHEET_NAME];
    const employees = ws ? XLSX.utils.sheet_to_json(ws) : [];
    logger.info(`Read ${employees.length} employees from Excel file`);
    return employees;
  } catch (error) {
    logger.error('Error reading employees:', error);
    throw new Error('Failed to read employee data');
  }
}

function writeEmployees(data) {
  try {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, EXCEL_FILE);
    logger.info(`Successfully wrote ${data.length} employees to Excel file`);
  } catch (error) {
    logger.error('Error writing employees:', error);
    throw new Error('Failed to write employee data');
  }
}

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = readEmployees();
    res.json(employees);
  } catch (error) {
    logger.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employees = readEmployees();
    const emp = employees.find(e => String(e.id) === id);
    
    if (!emp) {
      logger.warn(`Employee not found with ID: ${id}`);
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(emp);
  } catch (error) {
    logger.error('Error fetching employee by ID:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', validateEmployee, async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const employees = readEmployees();
    
    // Check for duplicate email
    const existingEmployee = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    if (existingEmployee) {
      logger.warn('Attempt to create employee with duplicate email:', { email });
      return res.status(409).json({ error: 'Employee with this email already exists' });
    }
    
    const id = employees.length ? Math.max(...employees.map(e => Number(e.id))) + 1 : 1;
    const newEmp = { id, name, email, department };
    employees.push(newEmp);
    writeEmployees(employees);
    
    logger.info('Created new employee:', { id, name, email, department });
    res.status(201).json(newEmp);
  } catch (error) {
    logger.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', validateUpdateEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department } = req.body;
    const employees = readEmployees();
    const idx = employees.findIndex(e => String(e.id) === id);
    
    if (idx === -1) {
      logger.warn(`Employee not found for update with ID: ${id}`);
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Check for duplicate email (excluding current employee)
    if (email) {
      const existingEmployee = employees.find(emp => 
        emp.email.toLowerCase() === email.toLowerCase() && String(emp.id) !== id
      );
      if (existingEmployee) {
        logger.warn('Attempt to update employee with duplicate email:', { email, id });
        return res.status(409).json({ error: 'Employee with this email already exists' });
      }
    }
    
    const updatedEmp = { 
      ...employees[idx], 
      ...(name && { name }), 
      ...(email && { email }), 
      ...(department && { department }) 
    };
    employees[idx] = updatedEmp;
    writeEmployees(employees);
    
    logger.info('Updated employee:', { id, name: updatedEmp.name, email: updatedEmp.email, department: updatedEmp.department });
    res.json(updatedEmp);
  } catch (error) {
    logger.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let employees = readEmployees();
    const idx = employees.findIndex(e => String(e.id) === id);
    
    if (idx === -1) {
      logger.warn(`Employee not found for deletion with ID: ${id}`);
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const removed = employees.splice(idx, 1);
    writeEmployees(employees);
    
    logger.info('Deleted employee:', { id, name: removed[0].name, email: removed[0].email });
    res.json({ message: 'Employee deleted successfully', employee: removed[0] });
  } catch (error) {
    logger.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router; 