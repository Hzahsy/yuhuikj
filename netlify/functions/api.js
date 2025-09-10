const fs = require('fs');
const path = require('path');

const SUBMISSIONS_FILE = path.join(__dirname, '../../submissions.json');

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

exports.handler = async (event, context) => {
    const method = event.httpMethod;
    const path = event.path;

    // Handle POST /submit
    if (method === 'POST' && path.endsWith('/submit')) {
        const body = JSON.parse(event.body || '{}');
        const { name, email, adress, phone, postal_code } = body;
        const submissions = readSubmissions();
        submissions.push({ name, email, phone, adress, postal_code, timestamp: new Date().toISOString() });
        writeSubmissions(submissions);

        return {
            statusCode: 302,
            headers: {
                'Location': '/'
            },
            body: ''
        };
    }

    // Handle GET /submissions
    if (method === 'GET' && path.endsWith('/submissions')) {
        const submissions = readSubmissions();
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissions)
        };
    }

    // Handle GET / (serve index.html)
    if (method === 'GET' && (path === '/' || path.endsWith('/'))) {
        try {
            const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/html'
                },
                body: html
            };
        } catch (err) {
            return {
                statusCode: 404,
                body: 'File not found'
            };
        }
    }

    // Handle GET /dashboard (serve dashboard.html)
    if (method === 'GET' && path.endsWith('/dashboard')) {
        try {
            const html = fs.readFileSync(path.join(__dirname, '../../dashboard.html'), 'utf8');
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/html'
                },
                body: html
            };
        } catch (err) {
            return {
                statusCode: 404,
                body: 'File not found'
            };
        }
    }

    // Default response
    return {
        statusCode: 404,
        body: 'Not Found'
    };
};