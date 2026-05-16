const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Load local data
const devicesPath = path.join(__dirname, 'data', 'devices.json');
let devicesData = [];

function loadData() {
    try {
        const data = fs.readFileSync(devicesPath, 'utf8');
        devicesData = JSON.parse(data);
    } catch (err) {
        console.error("Error loading devices data:", err);
        devicesData = [];
    }
}

loadData();

// Device Name Normalization
function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Simulated/Real Scraper for "Automatic" data
async function fetchExternalRoms(deviceQuery) {
    console.log(`Searching external sources for: ${deviceQuery}`);
    const externalRoms = [];

    try {
        // Pixel Experience API integration (Automatic source 1)
        const peResponse = await axios.get('https://api.pixelexperience.org/v1/devices');
        const peDevices = peResponse.data;
        
        // Search for device in PE database with more flexibility
        const q = normalize(deviceQuery);
        const foundDevice = peDevices.find(d => 
            normalize(d.model).includes(q) || 
            normalize(d.codename).includes(q) ||
            normalize(d.name).includes(q) ||
            q.includes(normalize(d.codename))
        );

        if (foundDevice) {
            externalRoms.push({
                name: "Pixel Experience",
                android: "14",
                status: "Stable",
                download: `https://get.pixelexperience.org/${foundDevice.codename}`,
                install_guide: `https://wiki.pixelexperience.org/devices/${foundDevice.codename}/install`
            });
        }
    } catch (e) {
        console.log("Pixel Experience API check failed:", e.message);
    }

    try {
        // LineageOS API integration (Automatic source 2)
        const loResponse = await axios.get('https://download.lineageos.org/api/v1/devices');
        const loDevices = loResponse.data; // This is an object with codenames as keys
        
        const q = normalize(deviceQuery);
        let foundCodename = null;
        
        for (const codename in loDevices) {
            const dev = loDevices[codename];
            if (normalize(codename) === q || normalize(dev.name).includes(q) || q.includes(normalize(codename))) {
                foundCodename = codename;
                break;
            }
        }

        if (foundCodename) {
            externalRoms.push({
                name: "LineageOS",
                android: "21 (Android 14)",
                status: "Official",
                download: `https://download.lineageos.org/devices/${foundCodename}`,
                install_guide: `https://wiki.lineageos.org/devices/${foundCodename}/install`
            });
        }
    } catch (e) {
        console.log("LineageOS API check failed:", e.message);
    }

    try {
        // GitHub Search API integration (Automatic source 2)
        // Searching for repositories matching device and "rom"
        const githubResponse = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(deviceQuery + " custom rom")}&sort=stars&order=desc`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (githubResponse.data.items && githubResponse.data.items.length > 0) {
            // Take top 3 relevant repos
            githubResponse.data.items.slice(0, 3).forEach(repo => {
                externalRoms.push({
                    name: repo.name.length > 20 ? repo.name.substring(0, 17) + "..." : repo.name,
                    android: "Varies",
                    status: "GitHub Repo",
                    download: repo.html_url,
                    install_guide: repo.html_url + "#readme"
                });
            });
        }
    } catch (e) {
        console.log("GitHub search failed:", e.message);
    }

    return externalRoms;
}

app.get('/search', async (req, res) => {
    const { device } = req.query;

    if (!device) {
        return res.status(400).json({ error: "Device parameter is required" });
    }

    const query = normalize(device);
    
    // 1. Search in local JSON
    let localMatches = devicesData.filter(d => 
        normalize(d.device).includes(query) || 
        normalize(d.codename).includes(query)
    );

    // 2. Fetch "Automatic" data from APIs
    const externalRoms = await fetchExternalRoms(device);
    
    let finalResult = null;

    if (localMatches.length > 0) {
        finalResult = {
            found: true,
            device: localMatches[0].device,
            codename: localMatches[0].codename,
            brand: localMatches[0].brand,
            roms: [...localMatches[0].roms, ...externalRoms.filter(er => !localMatches[0].roms.find(lr => lr.name === er.name))]
        };
    } else if (externalRoms.length > 0) {
        finalResult = {
            found: true,
            device: device,
            codename: "found via api",
            brand: "Generic",
            roms: externalRoms
        };
    }

    if (!finalResult) {
        return res.json({ 
            found: false, 
            message: "Dispositivo não encontrado, tente o codename (ex: sunny, vayu)",
            suggestions: ["sunny", "vayu", "mojito", "lemonade"]
        });
    }

    res.json(finalResult);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`ROM Finder Backend running on http://localhost:${PORT}`);
});
