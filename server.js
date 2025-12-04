
/*
================================================================================
 PRPL Village Infrastructure Backend Server
================================================================================
 This is a single-file Node.js/Express server to run your backend.
 It's designed to work with a PostgreSQL database and provides all the API
 endpoints your group needs based on your project documents.

================================================================================
 HOW TO RUN THIS:
================================================================================
 1. INSTALL DEPENDENCIES:
    In your terminal, run:
    npm install express pg cors

 2. CREATE YOUR POSTGRESQL DATABASE:
    - Create a new database in PostgreSQL (e.g., 'prpl_village_db')
    - You will need a database user and password.

 3. SET ENVIRONMENT VARIABLES:
    This script connects to your database using environment variables.
    You MUST set these in your terminal before running the server:

    (on Mac/Linux)
    export PGUSER='your_db_user'
    export PGHOST='localhost'
    export PGPASSWORD='your_db_password'
    export PGDATABASE='prpl_village_db'
    export PGPORT=5432

    (on Windows - PowerShell)
    $env:PGUSER = 'your_db_user'
    $env:PGHOST = 'localhost'
    $env:PGPASSWORD = 'your_db_password'
    $env:PGDATABASE = 'prpl_village_db'
    $env:PGPORT = 5432

 4. RUN THE SERVER:
    node server.js

 5. TEST WITH POSTMAN:
    You can now send requests to http://localhost:3000 (e.g., GET http://localhost:3000/api/projects)

================================================================================
*/

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// =============================================================================
// 1. INITIALIZE EXPRESS APP & MIDDLEWARE
// =============================================================================
const app = express();

// --- DEBUGGING: Log all incoming requests ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.originalUrl}`);
  next();
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Parses incoming JSON request bodies

// =============================================================================
// 2. SUPABASE DATABASE CONNECTION
// =============================================================================
// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_KEY:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized.');

// =============================================================================
// 4. API ROUTES (The "API Contract")
// =============================================================================

const apiRouter = express.Router();

// --- 4.1. User & Authentication ---


// ... (inside the apiRouter)

// POST /api/auth/register
apiRouter.post('/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    // TODO: Hash the password using 'bcrypt'
    const password_hash = password; // Placeholder!

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, password_hash, role }])
            .select();

        if (error) {
            throw error;
        }
        
        const user = data[0];
        const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ user, token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// POST /api/auth/login
apiRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // TODO: Compare password with 'bcrypt.compare(password, user.password_hash)'
        if (password !== user.password_hash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ user, token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// --- 4.2. Projects (CRUD) ---

// POST /api/projects
apiRouter.post('/projects', async (req, res) => {
    const { title, description, location, estimated_budget } = req.body;
    // TODO: Get 'created_by' from the authenticated user token
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([
                { title, description, location, estimated_budget, status: 'draft', created_by: null },
            ])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// GET /api/projects
apiRouter.get('/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('priority', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// GET /api/projects/{id}
apiRouter.get('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('project_id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// PUT /api/projects/{id}/status
apiRouter.put('/projects/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., "approved", "in_progress"
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .update({ status })
            .eq('project_id', id)
            .select();

        if (error) {
            throw error;
        }

        res.json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// --- 4.3. Prioritization ---

// PUT /api/projects/priority
apiRouter.put('/projects/priority', async (req, res) => {
    const { priority_list } = req.body; // Expects an array of project IDs in order
    
    if (!Array.isArray(priority_list)) {
        return res.status(400).json({ error: 'priority_list must be an array' });
    }

    try {
        // First, set all priorities to NULL
        const { error: nullError } = await supabase
            .from('projects')
            .update({ priority: null })
            .neq('priority', null); // Only update rows that have a priority

        if (nullError) {
            throw nullError;
        }

        // Now, set the new priorities in order
        for (let i = 0; i < priority_list.length; i++) {
            const projectId = priority_list[i];
            const priority = i + 1;
            const { error } = await supabase
                .from('projects')
                .update({ priority })
                .eq('project_id', projectId);

            if (error) {
                throw error;
            }
        }
        
        res.json({ success: true, message: `Prioritized ${priority_list.length} projects.` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// --- 4.4. Schedule (Epic 4) ---

// GET /api/schedule
apiRouter.get('/schedule', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('schedule_items')
            .select('*')
            .order('due_date', { ascending: true });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// POST /api/schedule
apiRouter.post('/schedule', async (req, res) => {
    const { title, description, due_date } = req.body;
    try {
        const { data, error } = await supabase
            .from('schedule_items')
            .insert([
                { title, description, due_date },
            ])
            .select();

        if (error) {
            throw error;
        }
        
        res.status(201).json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});


// --- 4.5. Funds, Spending & Progress ---
// (We'll nest these routes under the project for clarity)

// GET /api/funds
apiRouter.get('/funds', async (req, res) => {
    try {
        const { data: disbursements, error: disbursementError } = await supabase
            .from('fund_disbursements')
            .select('amount');

        if (disbursementError) {
            throw disbursementError;
        }

        const { data: expenses, error: expenseError } = await supabase
            .from('expenses')
            .select('amount_spent');

        if (expenseError) {
            throw expenseError;
        }

        const totalDisbursed = disbursements.reduce((acc, d) => acc + parseFloat(d.amount), 0);
        const totalSpent = expenses.reduce((acc, e) => acc + parseFloat(e.amount_spent), 0);
        const remaining = totalDisbursed - totalSpent;

        res.json({
            totalDisbursed,
            totalSpent,
            remaining,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// GET /api/funds/distribution
apiRouter.get('/funds/distribution', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('fund_disbursements')
            .select('*')
            .order('date_received', { ascending: false });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});


// GET /api/projects/{id}/disbursements (Money IN)
apiRouter.get('/projects/:id/disbursements', async (req, res) => {
    const { id } = req.params;
    
    try {
        const { data, error } = await supabase
            .from('fund_disbursements')
            .select('*')
            .eq('project_id', id)
            .order('date_received', { ascending: false });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// POST /api/projects/{id}/disbursements (Money IN)
apiRouter.post('/projects/:id/disbursements', async (req, res) => {
    const { id: project_id } = req.params;
    const { amount, date_received, phase, source_of_fund } = req.body;
    
    try {
        const { data, error } = await supabase
            .from('fund_disbursements')
            .insert([
                { project_id, amount, date_received, phase, source_of_fund },
            ])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// POST /api/projects/{id}/expenses (Money OUT)
apiRouter.post('/projects/:id/expenses', async (req, res) => {
    const { id: project_id } = req.params;
    const { description, amount_spent, date_spent } = req.body;
    // TODO: Handle receipt_document_id from file upload
    
    try {
        const { data, error } = await supabase
            .from('expenses')
            .insert([
                { project_id, description, amount_spent, date_spent },
            ])
            .select();

        if (error) {
            throw error;
        }
        
        res.status(201).json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// POST /api/projects/{id}/progress (Official's Update)
apiRouter.post('/projects/:id/progress', async (req, res) => {
    const { id: project_id } = req.params;
    const { notes, completion_percentage } = req.body;
    // TODO: Get 'created_by' from auth token
    
    try {
        const { data, error } = await supabase
            .from('progress_updates')
            .insert([
                { project_id, notes, completion_percentage, created_by: null },
            ])
            .select();

        if (error) {
            throw error;
        }
        
        res.status(201).json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// POST /api/projects/{id}/feedback (Villager's Comment)
apiRouter.post('/projects/:id/feedback', async (req, res) => {
    const { id: project_id } = req.params;
    const { comment_text } = req.body;
    // TODO: Get 'created_by' from auth token
    
    try {
        const { data, error } = await supabase
            .from('progress_feedback')
            .insert([
                { project_id, comment_text, created_by: null },
            ])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});


// --- 4.6. File Uploads & Report Generation (TODO) ---

// POST /api/projects/{id}/documents
apiRouter.post('/projects/:id/documents', upload.single('file'), async (req, res) => {
    const { id: project_id } = req.params;
    const { document_type } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'File is required.' });
    }

    try {
        const filePath = `${project_id}/${file.originalname}`;
        const { error: uploadError } = await supabase.storage
            .from('project-documents')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (uploadError) {
            throw uploadError;
        }

        const { data, error: dbError } = await supabase
            .from('project_documents')
            .insert([
                {
                    project_id,
                    file_name: file.originalname,
                    file_path: filePath,
                    document_type,
                },
            ])
            .select();

        if (dbError) {
            throw dbError;
        }

        res.status(201).json(data[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// GET /api/projects/{id}/reports/lpj
apiRouter.get('/projects/:id/reports/lpj', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('project_id', id)
            .single();

        if (projectError) throw projectError;

        const { data: disbursements, error: disbursementError } = await supabase
            .from('fund_disbursements')
            .select('*')
            .eq('project_id', id);

        if (disbursementError) throw disbursementError;

        const { data: expenses, error: expenseError } = await supabase
            .from('expenses')
            .select('*')
            .eq('project_id', id);

        if (expenseError) throw expenseError;

        const { data: progress, error: progressError } = await supabase
            .from('progress_updates')
            .select('*')
            .eq('project_id', id);

        if (progressError) throw progressError;

        const { data: feedback, error: feedbackError } = await supabase
            .from('progress_feedback')
            .select('*')
            .eq('project_id', id);

        if (feedbackError) throw feedbackError;

        res.json({
            project,
            disbursements,
            expenses,
            progress,
            feedback,
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});


// --- 4.7. Metrics ---
const { format, parseISO } = require('date-fns');

apiRouter.get('/metrics/projects-by-month', async (req, res) => {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('created_at, estimated_budget');

        if (error) {
            throw error;
        }

        const { data: expenses, error: expenseError } = await supabase
            .from('expenses')
            .select('date_spent, amount_spent');

        if (expenseError) {
            throw expenseError;
        }

        const metrics = projects.reduce((acc, project) => {
            const month = format(parseISO(project.created_at), 'yyyy-MM');
            if (!acc[month]) {
                acc[month] = { projects: 0, fundsIn: 0, fundsOut: 0 };
            }
            acc[month].projects++;
            acc[month].fundsIn += parseFloat(project.estimated_budget);
            return acc;
        }, {});

        expenses.forEach(expense => {
            const month = format(parseISO(expense.date_spent), 'yyyy-MM');
            if (metrics[month]) {
                metrics[month].fundsOut += parseFloat(expense.amount_spent);
            }
        });

        res.json(metrics);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Register the API router
app.use('/api', apiRouter);

// =============================================================================
// 5. START THE SERVER / EXPORT FOR SERVERLESS
// =============================================================================

// This is for local development.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`Test with: GET http://localhost:${PORT}/api/projects`);
  });
}

// Export the app for serverless environments (like Netlify)
module.exports = app;



