-- Create user_profile table
CREATE TABLE
  user_profile (
    id UUID PRIMARY KEY DEFAULT auth.uid (),
    email TEXT NOT NULL UNIQUE,
    nickname TEXT NOT NULL,
    is_adult BOOLEAN NOT NULL DEFAULT FALSE,
    adult_verified_at TIMESTAMP WITH TIME ZONE,
    age_group TEXT,
    gender TEXT,
    travel_style TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );

-- Create mate_post table
CREATE TABLE
  mate_post (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES user_profile (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    people_count INTEGER NOT NULL,
    conditions TEXT,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN',
    safety_agreed_at TIMESTAMP WITH TIME ZONE,
    policy_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );

-- Create mate_application table
CREATE TABLE
  mate_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    post_id UUID NOT NULL REFERENCES mate_post (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profile (id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (post_id, user_id)
  );

-- Create user_block table
CREATE TABLE
  user_block (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    blocker_id UUID NOT NULL REFERENCES user_profile (id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES user_profile (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (blocker_id, blocked_id)
  );

-- Create report table
CREATE TABLE
  report (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    reporter_id UUID NOT NULL REFERENCES user_profile (id) ON DELETE CASCADE,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );

-- Create app_setting table
CREATE TABLE
  app_setting (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );

-- Create indexes for better query performance
CREATE INDEX user_profile_email_idx ON user_profile (email);

CREATE INDEX mate_post_user_id_idx ON mate_post (user_id);

CREATE INDEX mate_post_country_idx ON mate_post (country);

CREATE INDEX mate_post_status_idx ON mate_post (status);

CREATE INDEX mate_application_post_id_idx ON mate_application (post_id);

CREATE INDEX mate_application_user_id_idx ON mate_application (user_id);

CREATE INDEX mate_application_status_idx ON mate_application (status);

CREATE INDEX user_block_blocker_id_idx ON user_block (blocker_id);

CREATE INDEX user_block_blocked_id_idx ON user_block (blocked_id);

CREATE INDEX report_reporter_id_idx ON report (reporter_id);

CREATE INDEX report_status_idx ON report (status);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

ALTER TABLE mate_post ENABLE ROW LEVEL SECURITY;

ALTER TABLE mate_application ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_block ENABLE ROW LEVEL SECURITY;

ALTER TABLE report ENABLE ROW LEVEL SECURITY;

ALTER TABLE app_setting ENABLE ROW LEVEL SECURITY;

-- RLS Policies will be created in DB-RLS-BASE task
