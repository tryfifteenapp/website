const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const app = express();

// Supabase configuration
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceRoleKey;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Route to handle email submissions
app.post('/api/submit-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email address' 
            });
        }

        // Insert email into Supabase database
        const { data, error } = await supabase
            .from('waitlist_emails')
            .insert([
                { 
                    email: email,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error saving email to database',
                error: error.message
            });
        }

        console.log(`Email added to database: ${email}`);
        
        res.json({ 
            success: true, 
            message: 'Email added to waitlist successfully',
            email: email,
            timestamp: data[0].created_at
        });

    } catch (error) {
        console.error('Error saving email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving email to waitlist' 
        });
    }
});

// Route to get all emails (for viewing)
app.get('/api/emails', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('waitlist_emails')
            .select('email, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error reading from database',
                error: error.message
            });
        }

        res.json({ 
            success: true, 
            count: data.length,
            emails: data 
        });

    } catch (error) {
        console.error('Error reading emails:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error reading waitlist data' 
        });
    }
});

// Export the app for Vercel
module.exports = app;

// Start server locally (for development)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📧 Email submission endpoint: http://localhost:${PORT}/api/submit-email`);
        console.log(`👀 View emails endpoint: http://localhost:${PORT}/api/emails`);
        console.log(`🗄️  Connected to Supabase database`);
    });
}

