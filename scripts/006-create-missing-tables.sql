-- Ensure all tables exist with proper structure

-- Create or update eco_actions table
CREATE TABLE IF NOT EXISTS eco_actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    category VARCHAR(100),
    icon VARCHAR(50),
    unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create or update badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    points_required INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create or update user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    badge_id INTEGER REFERENCES badges(id) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default eco actions if they don't exist
INSERT INTO eco_actions (name, description, points, category, icon, unit) 
SELECT * FROM (VALUES
    ('Переработка бумаги', 'Сдал бумагу на переработку', 10, 'recycling', 'Recycle', 'кг'),
    ('Сортировка отходов', 'Правильно отсортировал отходы по категориям', 5, 'waste', 'Trash2', 'раз'),
    ('Пластиковые бутылки', 'Принес пластиковые бутылки на переработку', 8, 'recycling', 'Droplets', 'шт')
) AS v(name, description, points, category, icon, unit)
WHERE NOT EXISTS (SELECT 1 FROM eco_actions WHERE eco_actions.name = v.name);

-- Insert default badges if they don't exist
INSERT INTO badges (name, description, icon, points_required)
SELECT * FROM (VALUES
    ('First Steps', 'Первые шаги в экологии', 'Award', 0),
    ('Recycling Champion', 'Чемпион переработки', 'Recycle', 50),
    ('Tree Planter', 'Защитник деревьев', 'TreePine', 100)
) AS v(name, description, icon, points_required)
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE badges.name = v.name);
