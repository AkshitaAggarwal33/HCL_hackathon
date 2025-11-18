import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage() {
  const { user, persist, token } = useAuth();
  const [form, setForm] = useState({ name: '', allergies: '', medications: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.role === 'patient') {
          const res = await api.get('/patient/profile');
          setForm({
            name: res.data.name || '',
            allergies: res.data.allergies || '',
            medications: res.data.medications || '',
          });
        } else {
          setForm({
            name: user.name || '',
            allergies: user.allergies || '',
            medications: user.medications || '',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      if (user?.role === 'patient') {
        const res = await api.put('/patient/profile', form);
        // update persisted auth user with new data, keep same token
        persist(res.data, token);
      } else {
        // no provider-specific update endpoint implemented — update local copy
        persist({ ...user, ...form }, token);
      }
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page">Loading profile...</div>;

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2>Profile</h2>
        <form className="form" onSubmit={handleSave}>
          <label>
            Name
            <input type="text" value={form.name} onChange={handleChange('name')} />
          </label>
          <label>
            Allergies
            <textarea rows={3} value={form.allergies} onChange={handleChange('allergies')} />
          </label>
          <label>
            Medications
            <textarea rows={3} value={form.medications} onChange={handleChange('medications')} />
          </label>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
