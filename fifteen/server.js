const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Check if CSV file exists, if not create it with headers
function initializeCSV() {
    if (!fs.existsSync('waitlist.csv')) {
        const headers = 'email,timestamp\n';
        fs.writeFileSync('waitlist.csv', headers);
        console.log('Created new waitlist.csv file with headers');
    }
}

// Initialize CSV file
initializeCSV();

// Route to handle email submissions
app.post('/api/submit-email', (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email address' 
            });
        }

        const timestamp = new Date().toISOString();
        const csvRow = `${email},${timestamp}\n`;
        
        // Append to CSV file
        fs.appendFileSync('waitlist.csv', csvRow);

        console.log(`Email added to CSV: ${email} at ${timestamp}`);
        
        res.json({ 
            success: true, 
            message: 'Email added to waitlist successfully',
            email: email,
            timestamp: timestamp
        });

    } catch (error) {
        console.error('Error writing to CSV:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving email to waitlist' 
        });
    }
});

// Route to get all emails (for viewing)
app.get('/api/emails', (req, res) => {
    try {
        if (fs.existsSync('waitlist.csv')) {
            const csvData = fs.readFileSync('waitlist.csv', 'utf8');
            const lines = csvData.trim().split('\n');
            const headers = lines[0].split(',');
            const emails = lines.slice(1).map(line => {
                const values = line.split(',');
                return {
                    email: values[0],
                    timestamp: values[1]
                };
            });
            
            res.json({ 
                success: true, 
                count: emails.length,
                emails: emails 
            });
        } else {
            res.json({ 
                success: true, 
                count: 0,
                emails: [] 
            });
        }
    } catch (error) {
        console.error('Error reading CSV:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error reading waitlist data' 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email submission endpoint: http://localhost:${PORT}/api/submit-email`);
    console.log(`👀 View emails endpoint: http://localhost:${PORT}/api/emails`);
});
