import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Smartphone, Download, ExternalLink, Cpu, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = "";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_BASE}/search?device=${encodeURIComponent(query)}`);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao buscar os dados. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="hero-section">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="brand"
        >
          <span className="logo-text">ROM<span>Finder</span></span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="search-container"
        >
          <h1 className="title">Encontre a ROM perfeita para seu Android</h1>
          <p className="subtitle">Busque por modelo ou codename</p>
          
          <form onSubmit={handleSearch} className="search-box glass">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Ex: Redmi Note 10 ou sunny" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              {loading ? <Loader2 className="spinner" size={20} /> : "Buscar"}
            </button>
          </form>
        </motion.div>
      </header>

      <main className="results-section">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="message-box error glass"
            >
              <AlertCircle size={24} />
              <p>{error}</p>
            </motion.div>
          )}

          {result && !result.found && (
            <motion.div 
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="message-box warning glass"
            >
              <AlertCircle size={24} />
              <div>
                <p className="main-msg">{result.message}</p>
                <div className="suggestions">
                  {result.suggestions.map(s => (
                    <span key={s} onClick={() => { setQuery(s); }} className="suggestion-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {result && result.found && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="results-content"
            >
              <div className="device-header">
                <div className="device-info">
                  <Smartphone className="icon-blue" size={32} />
                  <div>
                    <h2>{result.device}</h2>
                    <span className="codename">Codename: <strong>{result.codename}</strong></span>
                  </div>
                </div>
                <div className="brand-tag">{result.brand}</div>
              </div>

              <div className="roms-grid">
                {result.roms.map((rom, idx) => (
                  <motion.div 
                    key={rom.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rom-card glass"
                  >
                    <div className="rom-card-header">
                      <h3>{rom.name}</h3>
                      <span className={`status-badge ${rom.status.toLowerCase()}`}>
                        {rom.status}
                      </span>
                    </div>
                    
                    <div className="rom-details">
                      <div className="detail-item">
                        <Cpu size={16} />
                        <span>Android {rom.android}</span>
                      </div>
                    </div>

                    <div className="rom-actions">
                      <a href={rom.download} target="_blank" rel="noreferrer" className="btn-primary">
                        <Download size={18} />
                        Download
                      </a>
                      {rom.install_guide && (
                        <a href={rom.install_guide} target="_blank" rel="noreferrer" className="btn-secondary">
                          <ExternalLink size={18} />
                          Guia
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <p>© 2026 ROM Finder - O maior indexador de Custom ROMs</p>
      </footer>
    </div>
  );
}

export default App;
