import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGrievances, createGrievance, updateGrievance, deleteGrievance, searchGrievances } from '../../services/api';
import { LogOut, Plus, Search, Trash2, CheckCircle, Clock, Filter, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Academic' });

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const { data } = await getGrievances();
      setGrievances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchGrievances();
      return;
    }
    try {
      const { data } = await searchGrievances(searchTerm);
      setGrievances(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGrievance(formData);
      setFormData({ title: '', description: '', category: 'Academic' });
      setIsFormOpen(false);
      fetchGrievances();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating grievance');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
      await updateGrievance(id, { status: newStatus });
      fetchGrievances();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await deleteGrievance(id);
        fetchGrievances();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Student Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{user?.name}</span></p>
        </div>
        <button onClick={logout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="btn btn-primary">
          <Plus size={18} /> {isFormOpen ? 'Close Form' : 'New Grievance'}
        </button>
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: '300px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search grievances by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Search size={18} />
          </button>
        </form>
      </div>

      {isFormOpen && (
        <div className="glass-card fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Submit New Grievance</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Title</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</label>
              <select 
                className="input-field" 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ background: 'var(--bg-dark)' }}
              >
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
              <textarea 
                className="input-field" 
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Submit Grievance</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading grievances...</div>
      ) : grievances.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No grievances found. Try searching for something else or submit a new one.</p>
        </div>
      ) : (
        <div className="grievance-grid">
          {grievances.map((g) => (
            <div key={g._id} className="glass-card fade-in" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className={`badge ${g.status === 'Pending' ? 'badge-pending' : 'badge-resolved'}`} 
                      onClick={() => handleToggleStatus(g._id, g.status)}
                      style={{ cursor: 'pointer' }}>
                  {g.status === 'Pending' ? <Clock size={12} style={{ marginRight: '4px' }} /> : <CheckCircle size={12} style={{ marginRight: '4px' }} />}
                  {g.status}
                </span>
                <button onClick={() => handleDelete(g._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{g.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{g.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Filter size={14} /> {g.category}
                </span>
                <span>{new Date(g.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
