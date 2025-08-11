-- WARNING: This will delete all data in the database
-- Only run this in development!

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS user_challenges CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS user_actions CASCADE;
DROP TABLE IF EXISTS eco_actions CASCADE;
DROP TABLE IF EXISTS teacher_invites CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- Drop any remaining sequences
DROP SEQUENCE IF EXISTS schools_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS classes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS eco_actions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_actions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS challenges_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_challenges_id_seq CASCADE;
DROP SEQUENCE IF EXISTS badges_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_badges_id_seq CASCADE;
DROP SEQUENCE IF EXISTS teacher_invites_id_seq CASCADE;

-- Reset is complete - now run the create tables script

-- Create schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    director_id INTEGER,
    total_classes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'director', 'admin')),
    school_id INTEGER REFERENCES schools(id),
    class_id INTEGER,
    grade VARCHAR(10),
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    school_id INTEGER REFERENCES schools(id) NOT NULL,
    teacher_id INTEGER REFERENCES users(id),
    student_count INTEGER DEFAULT 0,
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for class_id after classes table is created
ALTER TABLE users ADD CONSTRAINT fk_users_class_id 
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;

-- Create eco_actions table
CREATE TABLE eco_actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    category VARCHAR(100),
    icon VARCHAR(50),
    unit VARCHAR(20) DEFAULT 'раз',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_actions table
CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    action_id INTEGER REFERENCES eco_actions(id) NOT NULL,
    quantity INTEGER DEFAULT 1,
    points_earned INTEGER NOT NULL,
    description TEXT,
    photo_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create challenges table
CREATE TABLE challenges (
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

-- Create user_challenges table
CREATE TABLE user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    challenge_id INTEGER REFERENCES challenges(id) NOT NULL,
    current_progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create badges table
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    points_required INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_badges table
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    badge_id INTEGER REFERENCES badges(id) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teacher_invites table
CREATE TABLE teacher_invites (
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

-- Add foreign key constraint for director
ALTER TABLE schools ADD CONSTRAINT fk_schools_director 
    FOREIGN KEY (director_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_class_id ON users(class_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX idx_user_actions_status ON user_actions(status);
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_teacher_invites_code ON teacher_invites(invite_code);
CREATE INDEX idx_teacher_invites_status ON teacher_invites(status);
CREATE INDEX idx_teacher_invites_school_id ON teacher_invites(school_id);
CREATE INDEX idx_challenges_school_id ON challenges(school_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- Insert default eco actions
INSERT INTO eco_actions (name, description, points, category, icon, unit) VALUES
('Переработка бумаги', 'Сдал бумагу на переработку', 10, 'recycling', 'Recycle', 'кг'),
('Сортировка отходов', 'Правильно отсортировал отходы по категориям', 5, 'waste', 'Trash2', 'раз'),
('Пластиковые бутылки', 'Принес пластиковые бутылки на переработку', 8, 'recycling', 'Droplets', 'шт'),
('Посадка деревьев', 'Участвовал в посадке деревьев', 25, 'nature', 'TreePine', 'шт'),
('Энергосбережение', 'Внедрил меры по энергосбережению', 15, 'energy', 'Lightbulb', 'раз'),
('Эко-транспорт', 'Использовал экологичный транспорт', 12, 'transport', 'Car', 'раз'),
('Уборка территории', 'Участвовал в уборке школьной территории', 20, 'cleanup', 'Trash2', 'раз'),
('Экономия воды', 'Внедрил меры по экономии воды', 10, 'water', 'Droplets', 'раз');

-- Insert default badges
INSERT INTO badges (name, description, icon, points_required) VALUES
('First Steps', 'Первые шаги в экологии', 'Award', 0),
('Recycling Champion', 'Чемпион переработки', 'Recycle', 50),
('Tree Planter', 'Защитник деревьев', 'TreePine', 100),
('Energy Saver', 'Энергосберегатель', 'Lightbulb', 150),
('Eco Warrior', 'Эко-воин', 'Shield', 300),
('Green Master', 'Мастер экологии', 'Crown', 500);

-- Success message
SELECT 'База данных успешно сброшена и пересоздана!' as message;
