const express = require('express');
const { body } = require('express-validator');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

const employeeValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
];

// All employee routes require a logged-in user; write ops require admin role
router.use(protect);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', authorize('admin'), employeeValidation, createEmployee);
router.put('/:id', authorize('admin'), employeeValidation, updateEmployee);
router.delete('/:id', authorize('admin'), deleteEmployee);

module.exports = router;
