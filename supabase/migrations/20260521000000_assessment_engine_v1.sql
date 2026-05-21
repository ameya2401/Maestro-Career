-- Migration: 20260521000000_assessment_engine_v1.sql

-- 1. Access Grants (Who can take the internal test)
CREATE TABLE IF NOT EXISTS assessment_access_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_version VARCHAR(50) DEFAULT 'prototype-1-v1',
    status TEXT CHECK (status IN ('pending', 'granted', 'revoked')) DEFAULT 'pending',
    granted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, bank_version)
);

-- 2. Assessment Attempts (Timer and Lifecycle)
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_version VARCHAR(50) NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- started_at + 50 minutes
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT CHECK (status IN ('active', 'completed', 'expired')) DEFAULT 'active',
    raw_responses JSONB DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS assessment_attempts_active_idx ON assessment_attempts (user_id) WHERE status = 'active';

-- 3. Stored Results (The source for the Intelligence Report)
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    aptitude_scores JSONB NOT NULL, -- { logical: 85, verbal: 70... }
    trait_scores JSONB NOT NULL,    -- { leadership: 90, empathy: 40... }
    career_matches JSONB NOT NULL,  -- Array of top 12 careers with compatibility
    archetype JSONB NOT NULL,       -- { title: 'Strategic Architect', behavior: '...' }
    overall_index DECIMAL(5,2),
    metadata JSONB DEFAULT '{}'::jsonb, -- Store "Career DNA" and narrative snapshots
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assessment_access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors on re-run
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own grants" ON assessment_access_grants;
    DROP POLICY IF EXISTS "Users can view/manage own attempts" ON assessment_attempts;
    DROP POLICY IF EXISTS "Users can view own results" ON assessment_results;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- RLS Policies: Users can view their own data
CREATE POLICY "Users can view own grants" ON assessment_access_grants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view/manage own attempts" ON assessment_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own results" ON assessment_results FOR SELECT USING (auth.uid() = user_id);
