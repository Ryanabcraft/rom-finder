const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API: Crypto Prices
app.get('/api/crypto', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true');
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch crypto" });
    }
});

// API: Tech News (Simulated to avoid API Key issues for the user)
app.get('/api/news', (req, res) => {
    const news = [
        { id: 1, title: "Quantum Computing reach new milestone", source: "TechCrunch", time: "2h ago", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop" },
        { id: 2, title: "The future of AI is Agentic", source: "Wired", time: "4h ago", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop" },
        { id: 3, title: "Next-gen GPUs are coming this fall", source: "Verge", time: "5h ago", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=250&fit=crop" },
        { id: 4, title: "Open-source LLMs outperforming proprietary models", source: "GitHub Blog", time: "8h ago", image: "https://images.unsplash.com/photo-1620712943543-bcc4628c6757?w=400&h=250&fit=crop" }
    ];
    res.json(news);
});

// API: Simulated Weather
app.get('/api/weather', (req, res) => {
    res.json({
        temp: 24,
        condition: "Clear Sky",
        location: "São Paulo, BR",
        humidity: 45
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Aether Engine running on http://localhost:${PORT}`);
});
