import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEmployee, createEmployee, updateEmployee } from '../api/employees';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  salary: '',
  status: 'active',
};

const EmployeeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchEmployee(id).then((data) =>
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          department: data.department,
          position: data.position,
          salary: data.salary,
          status: data.status,
        })
      );
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, salary: Number(form.salary) };
      if (isEdit) {
        await updateEmployee(id, payload);
      } else {
        await createEmployee(payload);
      }
      navigate('/employees');
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Failed to save employee';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ems-page">
      <h1>{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
      <form className="ems-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="form-row">
          <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
        </div>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
        <div className="form-row">
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
          <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <input
            name="salary"
            type="number"
            min="0"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
          />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="on-leave">On leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/employees')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Add employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
