import { useEffect, useState } from 'react';
import api from '../api/axios.js';

function PublicInfoPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get('/public/health-info');
        setItems(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load health information');
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="page">
      <h2>Health Information</h2>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {items.map((item) => (
          <div key={item.id} className="card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicInfoPage;
