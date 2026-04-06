import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // සර්ච් කරන function එක
  const searchSubtitle = async () => {
    if (!query) return alert("මුලින්ම නමක් type කරන්න!");
    
    setLoading(true);
    try {
      // මෙතනට ඔයාගේ API URL එක දෙන්න (Local run කරනවා නම් http://localhost:5000/api/search)
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      setResults(response.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("API එක වැඩ කරන්නේ නැහැ වගේ!");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Sinhala Subtitle Downloader</h1>
      
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Movie නම මෙතන ගහන්න..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      
      <button 
        onClick={searchSubtitle}
        style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Results පෙන්වන තැන */}
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {results.map((item, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px', borderRadius: '8px', width: '80%', textAlign: 'left' }}>
            <h3>{item.title}</h3>
            <p>Source: {item.site}</p>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noreferrer"
              style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Go to Download Page →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;