import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Cpu, 
  Globe, 
  Shield, 
  Zap, 
  Terminal, 
  Layers, 
  Layout, 
  Smartphone, 
  Tablet, 
  Monitor,
  Cloud,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:3001" : "";

function App() {
  const [crypto, setCrypto] = useState(null);
  const [news, setNews] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [cryptoRes, newsRes, weatherRes] = await Promise.all([
        axios.get(`${API_BASE}/api/crypto`),
        axios.get(`${API_BASE}/api/news`),
        axios.get(`${API_BASE}/api/weather`)
      ]);
      setCrypto(cryptoRes.data);
      setNews(newsRes.data);
      setWeather(weatherRes.data);
    } catch (e) {
      console.log("Failed to fetch dashboard data");
    }
  };

  return (
    <div className="aether-root">
      {/* Navigation */}
      <nav className="navbar glass-panel">
        <div className="nav-content">
          <div className="logo neon-text">AETHER</div>
          
          <div className="nav-links desktop-only">
            <a href="#dashboard">Dashboard</a>
            <a href="#ecosystem">Ecosystem</a>
            <a href="#intelligence">Intelligence</a>
          </div>

          <div className="nav-actions">
            <div className="device-indicators">
              <Monitor size={18} className="active" />
              <Tablet size={18} />
              <Smartphone size={18} />
            </div>
            <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="mobile-menu glass-panel"
          >
            <a href="#dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</a>
            <a href="#ecosystem" onClick={() => setIsMenuOpen(false)}>Ecosystem</a>
            <a href="#intelligence" onClick={() => setIsMenuOpen(false)}>Intelligence</a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container">
        {/* Hero Section */}
        <header className="hero">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Universal <span className="neon-text">Interface</span> for the Digital Age
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            Integrated intelligence across all your devices. Responsive, adaptive, and high-performance.
          </motion.p>
        </header>

        {/* Dashboard Grid */}
        <section id="dashboard" className="bento-grid">
          {/* Crypto Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-item crypto glass-panel"
          >
            <div className="card-header">
              <TrendingUp size={20} className="icon-cyan" />
              <h3>Market Pulse</h3>
            </div>
            <div className="crypto-list">
              {crypto ? Object.entries(crypto).map(([id, data]) => (
                <div key={id} className="crypto-row">
                  <span className="coin-name">{id}</span>
                  <div className="coin-data">
                    <span className="coin-price">${data.usd.toLocaleString()}</span>
                    <span className={`coin-change ${data.usd_24h_change >= 0 ? 'up' : 'down'}`}>
                      {data.usd_24h_change?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )) : <div className="loader">Initializing stream...</div>}
            </div>
          </motion.div>

          {/* Weather Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-item weather glass-panel"
          >
            <div className="card-header">
              <Cloud size={20} className="icon-purple" />
              <h3>Environment</h3>
            </div>
            {weather && (
              <div className="weather-content">
                <div className="temp">{weather.temp}°</div>
                <div className="details">
                  <span className="condition">{weather.condition}</span>
                  <span className="location">{weather.location}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* System Status */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-item status glass-panel"
          >
            <div className="card-header">
              <Cpu size={20} className="icon-cyan" />
              <h3>Neural Load</h3>
            </div>
            <div className="status-bars">
              <div className="bar-group">
                <div className="label">Inference Engine</div>
                <div className="bar-bg"><motion.div animate={{ width: '85%' }} className="bar-fill cyan"></motion.div></div>
              </div>
              <div className="bar-group">
                <div className="label">Context Memory</div>
                <div className="bar-bg"><motion.div animate={{ width: '42%' }} className="bar-fill purple"></motion.div></div>
              </div>
            </div>
          </motion.div>

          {/* News Section */}
          <div className="bento-item news glass-panel">
            <div className="card-header">
              <Globe size={20} className="icon-purple" />
              <h3>Latest Intel</h3>
            </div>
            <div className="news-list">
              {news.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="news-card"
                >
                  <img src={item.image} alt={item.title} />
                  <div className="news-info">
                    <h4>{item.title}</h4>
                    <div className="news-meta">
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="news-link" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Ecosystem */}
        <section id="ecosystem" className="features-section">
          <div className="section-header">
            <h2 className="neon-text">Adaptive Ecosystem</h2>
            <p>Optimized for every screen size and input method.</p>
          </div>
          <div className="features-grid">
            <div className="feature-item glass-panel">
              <Zap className="icon-cyan" />
              <h4>Ultra Response</h4>
              <p>Under 50ms latency in all interactions.</p>
            </div>
            <div className="feature-item glass-panel">
              <Shield className="icon-purple" />
              <h4>Private by Design</h4>
              <p>End-to-end encrypted neural processing.</p>
            </div>
            <div className="feature-item glass-panel">
              <Layers className="icon-cyan" />
              <h4>Multi-Layered UI</h4>
              <p>Z-axis depth for complex data management.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content glass-panel">
          <div className="footer-brand neon-text">AETHER CORE v1.0.4</div>
          <div className="social-links">
            <Globe size={20} />
            <Globe size={20} />
          </div>
          <p>© 2026 Integrated Systems Inc.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
