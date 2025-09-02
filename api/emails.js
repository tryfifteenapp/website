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

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

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
};
