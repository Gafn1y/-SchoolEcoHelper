-- Create teacher_invites table if it doesn't exist
CREATE TABLE IF NOT EXISTS teacher_invites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(100) NOT NULL,
    school_id INTEGER REFERENCES schools(id) NOT NULL,
    class_id INTEGER REFERENCES classes(id),
    invited_by INTEGER REFERENCES users(id) NOT NULL,
    invite_code VARCHAR(20) UNIQUE,
    expires_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL,
    points_reward INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    challenge_type VARCHAR(100),
    school_id INTEGER REFERENCES schools(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    challenge_id INTEGER REFERENCES challenges(id) NOT NULL,
    current_progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create badges table if it doesn't exist
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    points_required INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_badges table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    badge_id INTEGER REFERENCES badges(id) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_invites_code ON teacher_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_teacher_invites_status ON teacher_invites(status);
CREATE INDEX IF NOT EXISTS idx_teacher_invites_school_id ON teacher_invites(school_id);
CREATE INDEX IF NOT EXISTS idx_challenges_school_id ON challenges(school_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Insert default badges if they don't exist
INSERT INTO badges (name, description, icon, points_required) 
SELECT * FROM (VALUES
    ('First Steps', 'Первые шаги в экологии', 'Award', 0),
    ('Recycling Champion', 'Чемпион переработки', 'Recycle', 50),
    ('Tree Planter', 'Защитник деревьев', 'TreePine', 100),
    ('Energy Saver', 'Энергосберегатель', 'Lightbulb', 150),
    ('Eco Warrior', 'Эко-воин', 'Shield', 300),
    ('Green Master', 'Мастер экологии', 'Crown', 500)
) AS v(name, description, icon, points_required)
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE badges.name = v.name);
