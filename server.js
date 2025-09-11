const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replit specific configuration
if (process.env.REPL_ID) {
  console.log('Running on Replit');
}
const SUBMISSIONS_FILE = 'submissions.json';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Helper function to read submissions
function readSubmissions() {
    try {
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to write submissions
function writeSubmissions(submissions) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.post('/submit', (req, res) => {
    const { name, email, address, phone, postal_code, vivienda, property_type } = req.body;
    const submissions = readSubmissions();
    submissions.push({ name, email, phone, address, postal_code, vivienda, property_type, timestamp: new Date().toISOString() });
    writeSubmissions(submissions);
    res.json({ message: 'Form submitted successfully', data: { name, email, phone, address, postal_code, vivienda, property_type, timestamp: new Date().toISOString() } });
});

app.get('/submissions', (req, res) => {
    const submissions = readSubmissions();
    res.json(submissions);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});