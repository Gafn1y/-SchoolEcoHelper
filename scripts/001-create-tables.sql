-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'director')),
    school_id INTEGER REFERENCES schools(id),
    class_id INTEGER,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    school_id INTEGER REFERENCES schools(id),
    teacher_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for class_id in users table
ALTER TABLE users ADD CONSTRAINT fk_users_class_id FOREIGN KEY (class_id) REFERENCES classes(id);

-- Create eco_actions table
CREATE TABLE IF NOT EXISTS eco_actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_actions table
CREATE TABLE IF NOT EXISTS user_actions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_id INTEGER REFERENCES eco_actions(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    description TEXT,
    photo_url VARCHAR(500),
    teacher_feedback TEXT,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teacher_invites table
CREATE TABLE IF NOT EXISTS teacher_invites (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    school_id INTEGER REFERENCES schools(id),
    created_by INTEGER REFERENCES users(id),
    used_by INTEGER REFERENCES users(id),
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category VARCHAR(100),
    max_participants INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    challenge_id INTEGER REFERENCES challenges(id),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_class_id ON users(class_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON user_actions(status);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_invites_code ON teacher_invites(code);
