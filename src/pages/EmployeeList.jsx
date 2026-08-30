import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchEmployees, deleteEmployee } from '../api/employees';

const EmployeeList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  const load = async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchEmployees({ search: searchTerm, limit: 50 });
      setEmployees(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee record? This cannot be undone.')) return;
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="ems-page">
      <header className="ems-header">
        <div>
          <h1>Employee Management System</h1>
          <p>
            Logged in as <strong>{user?.name}</strong> ({user?.role})
          </p>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          Log out
        </button>
      </header>

      <div className="ems-toolbar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {isAdmin && (
          <Link to="/employees/new" className="btn-primary">
            + Add Employee
          </Link>
        )}
      </div>

      {!isAdmin && (
        <p className="notice">You're viewing in read-only mode. Only admins can add, edit, or delete records.</p>
      )}
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="ems-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6}>No employees found.</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>₹{Number(emp.salary).toLocaleString()}</td>
                  <td>
                    <span className={`status status-${emp.status}`}>{emp.status}</span>
                  </td>
                  {isAdmin && (
                    <td className="actions">
                      <Link to={`/employees/${emp._id}/edit`}>Edit</Link>
                      <button onClick={() => handleDelete(emp._id)} className="link-danger">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
