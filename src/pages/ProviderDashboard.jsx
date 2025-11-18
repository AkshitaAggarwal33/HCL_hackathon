import { useEffect, useState } from 'react';
import api from '../api/axios.js';

function ProviderDashboard() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/provider/patients');
        setPatients(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSelect = async (patient) => {
    setSelected(patient);
    setDetail(null);
    setError('');
    try {
      const res = await api.get(`/provider/patient/${patient.id}`);
      setDetail(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load patient detail');
    }
  };

  return (
    <div className="page grid">
      <div className="card">
        <h2>Patients</h2>
        {loading ? (
          <div>Loading patients...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Steps Today</th>
                  <th>Compliance</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.stepsToday}</td>
                    <td>
                      <span className={p.compliance === 'Goal Met' ? 'badge badge-success' : 'badge badge-warning'}>
                        {p.compliance}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-small" onClick={() => handleSelect(p)}>
                        Last 7 days
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <div className="error">{error}</div>}
          </>
        )}
      </div>

      {selected && detail && (
        <div className="card">
          <h3>Last 7 Days for {detail.patient.name}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Steps</th>
                <th>Water</th>
                <th>Sleep</th>
                <th>Active Minutes</th>
              </tr>
            </thead>
            <tbody>
              {detail.goals.map((g) => (
                <tr key={g._id}>
                  <td>{g.date}</td>
                  <td>{g.steps}</td>
                  <td>{g.water}</td>
                  <td>{g.sleep}</td>
                  <td>{g.activeMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
