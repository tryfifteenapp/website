const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

// Supabase configuration
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.serviceRoleKey;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

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
};
