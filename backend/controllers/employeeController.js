const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

// @route  GET /api/employees
// @desc   List employees, with optional search/pagination
exports.getEmployees = async (req, res) => {
  try {
    const { search = '', department, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) query.department = department;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [employees, total] = await Promise.all([
      Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Employee.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching employees', error: err.message });
  }
};

// @route  GET /api/employees/:id
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching employee', error: err.message });
  }
};

// @route  POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const existing = await Employee.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An employee with this email already exists' });
    }

    const employee = await Employee.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error creating employee', error: err.message });
  }
};

// @route  PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating employee', error: err.message });
  }
};

// @route  DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted', data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting employee', error: err.message });
  }
};
