-- =============================================================================
-- PRPL Village Infrastructure - Supabase Schema
-- =============================================================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Project Dashboard.
-- 2. Navigate to the "SQL Editor" section.
-- 3. Click "New query".
-- 4. Copy and paste the entire content of this file into the editor.
-- 5. Click "Run".
-- =============================================================================

-- ENUM Types (for 'status', 'roles', etc.)
-- In Supabase, you can create these custom types in the SQL Editor.
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('village_official', 'villager', 'central_govt');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'in_progress', 'on_hold', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('supporting_doc', 'receipt', 'progress_photo');
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- 1. Users Table
-- Supabase automatically handles 'user_id' with its own auth system,
-- but for a direct migration, we'll create a public 'users' table.
-- You should link this to Supabase Auth users via triggers later.
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- You'll use Supabase Auth, this is for structure
    role user_role NOT NULL
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    estimated_budget DECIMAL(15, 2),
    status project_status DEFAULT 'draft',
    priority INTEGER,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Project Documents Table
-- For file uploads, you will use Supabase Storage.
-- This table will store the *metadata* about the files.
CREATE TABLE IF NOT EXISTS project_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    -- 'file_path' will now correspond to the path in Supabase Storage
    file_path TEXT NOT NULL, 
    document_type document_type NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Schedule Items Table
CREATE TABLE IF NOT EXISTS schedule_items (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Fund Disbursements Table (Money IN)
CREATE TABLE IF NOT EXISTS fund_disbursements (
    disbursement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    date_received DATE NOT NULL,
    phase VARCHAR(50), -- e.g., "Tahap I", "Tahap II"
    source_of_fund TEXT
);

-- 6. Project Allocations Table
CREATE TABLE IF NOT EXISTS project_allocations (
    allocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    allocated_amount DECIMAL(15, 2) NOT NULL
);

-- 7. Expenses Table (Money OUT)
CREATE TABLE IF NOT EXISTS expenses (
    expense_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount_spent DECIMAL(15, 2) NOT NULL,
    date_spent DATE NOT NULL,
    -- This can link to a receipt stored in Supabase storage
    receipt_document_id UUID REFERENCES project_documents(document_id)
);

-- 8. Progress Updates Table
CREATE TABLE IF NOT EXISTS progress_updates (
    update_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    notes TEXT,
    completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Feedback Table (Villager comments)
CREATE TABLE IF NOT EXISTS progress_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_by UUID REFERENCES users(user_id), -- The 'villager'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- After running this, remember to set up Row Level Security (RLS) policies
-- in the Supabase dashboard for each table to control data access.
-- By default, tables are not accessible via the public API until you enable RLS.
