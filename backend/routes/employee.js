const express = require('express');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const router = express.Router();
const EXCEL_FILE = path.join(__dirname, '../employees.xlsx');
const SHEET_NAME = 'Employees';

function readEmployees() {
  if (!fs.existsSync(EXCEL_FILE)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, EXCEL_FILE);
    return [];
  }
  const wb = XLSX.readFile(EXCEL_FILE);
  const ws = wb.Sheets[SHEET_NAME];
  return ws ? XLSX.utils.sheet_to_json(ws) : [];
}

function writeEmployees(data) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, EXCEL_FILE);
}

// Get all employees
router.get('/', (req, res) => {
  const employees = readEmployees();
  res.json(employees);
});

// Get employee by ID
router.get('/:id', (req, res) => {
  const employees = readEmployees();
  const emp = employees.find(e => String(e.id) === req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  res.json(emp);
});

// Create employee
router.post('/', (req, res) => {
  const { name, email, department } = req.body;
  if (!name || !email || !department) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const employees = readEmployees();
  const id = employees.length ? Math.max(...employees.map(e => Number(e.id))) + 1 : 1;
  const newEmp = { id, name, email, department };
  employees.push(newEmp);
  writeEmployees(employees);
  res.status(201).json(newEmp);
});

// Update employee
router.put('/:id', (req, res) => {
  const { name, email, department } = req.body;
  const employees = readEmployees();
  const idx = employees.findIndex(e => String(e.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Employee not found' });
  employees[idx] = { ...employees[idx], name, email, department };
  writeEmployees(employees);
  res.json(employees[idx]);
});

// Delete employee
router.delete('/:id', (req, res) => {
  let employees = readEmployees();
  const idx = employees.findIndex(e => String(e.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Employee not found' });
  const removed = employees.splice(idx, 1);
  writeEmployees(employees);
  res.json({ message: 'Employee deleted', employee: removed[0] });
});

module.exports = router; 