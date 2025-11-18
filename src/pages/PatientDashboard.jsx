import { useEffect, useState } from 'react';
import api from '../api/axios.js';

function PatientDashboard() {
  const [goal, setGoal] = useState({ steps: 0, water: 0, sleep: 0, activeMinutes: 0 });
  const [reminder, setReminder] = useState('');
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/patient/dashboard');
        if (res.data.goal) {
          setGoal({
            steps: res.data.goal.steps || 0,
            water: res.data.goal.water || 0,
            sleep: res.data.goal.sleep || 0,
            activeMinutes: res.data.goal.activeMinutes || 0,
          });
        }
        setReminder(res.data.reminderMessage || '');
        setTip(res.data.tipOfTheDay || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleChange = (field) => (e) => {
    setGoal((prev) => ({ ...prev, [field]: Number(e.target.value) || 0 }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.post('/patient/goals', goal);
      setSuccess("Today's goals have been saved.");
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goals');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page">Loading dashboard...</div>;

  return (
    <div className="page grid">
      <div className="card">
        <h2>Today's Wellness Goals</h2>
        <form className="form" onSubmit={handleSave}>
          <div className="grid-2">
            <label>
              Steps
              <input type="number" min="0" value={goal.steps} onChange={handleChange('steps')} />
            </label>
            <label>
              Water (glasses)
              <input type="number" min="0" value={goal.water} onChange={handleChange('water')} />
            </label>
            <label>
              Sleep (hours)
              <input type="number" min="0" step="0.5" value={goal.sleep} onChange={handleChange('sleep')} />
            </label>
            <label>
              Active Minutes
              <input type="number" min="0" value={goal.activeMinutes} onChange={handleChange('activeMinutes')} />
            </label>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Goals'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Reminder</h3>
        <p>{reminder}</p>
      </div>

      <div className="card">
        <h3>Tip of the Day</h3>
        <p>{tip}</p>
      </div>
    </div>
  );
}

export default PatientDashboard;
