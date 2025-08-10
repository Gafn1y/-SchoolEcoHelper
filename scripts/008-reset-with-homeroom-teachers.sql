-- Полный сброс базы данных с обновленной структурой

-- Удаляем все таблицы
DROP TABLE IF EXISTS user_actions CASCADE;
DROP TABLE IF EXISTS teacher_invites CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS eco_actions CASCADE;

-- Создаем таблицу школ
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    director_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу классов
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу пользователей с обновленной структурой
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('director', 'teacher', 'student')),
    school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
    is_homeroom_teacher BOOLEAN DEFAULT FALSE,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу эко-действий
CREATE TABLE eco_actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_per_unit INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу действий пользователей
CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action_id INTEGER REFERENCES eco_actions(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    points_earned INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by INTEGER REFERENCES users(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Создаем таблицу приглашений учителей (без поля subject)
CREATE TABLE teacher_invites (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    invite_code VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
);

-- Создаем таблицу челленджей
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_reward INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    created_by INTEGER REFERENCES users(id),
    school_id INTEGER REFERENCES schools(id),
    class_id INTEGER REFERENCES classes(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем внешние ключи
ALTER TABLE schools ADD CONSTRAINT fk_schools_director 
    FOREIGN KEY (director_id) REFERENCES users(id) ON DELETE SET NULL;

-- Создаем индексы
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_class_role ON users(class_id, role);
CREATE INDEX idx_users_homeroom ON users(is_homeroom_teacher) WHERE is_homeroom_teacher = TRUE;
CREATE INDEX idx_user_actions_user ON user_actions(user_id);
CREATE INDEX idx_user_actions_status ON user_actions(status);
CREATE INDEX idx_teacher_invites_code ON teacher_invites(invite_code);
CREATE INDEX idx_teacher_invites_email ON teacher_invites(email);

-- Уникальный индекс: один классный руководитель на класс
CREATE UNIQUE INDEX idx_unique_homeroom_teacher 
ON users(class_id) 
WHERE role = 'teacher' AND is_homeroom_teacher = TRUE;

-- Заполняем базовые эко-действия
INSERT INTO eco_actions (name, description, points_per_unit, unit, icon, category) VALUES
('Сбор макулатуры', 'Сбор и сдача макулатуры на переработку', 10, 'кг', 'Recycle', 'Переработка'),
('Сбор пластика', 'Сбор пластиковых бутылок и контейнеров', 15, 'кг', 'Recycle', 'Переработка'),
('Экономия воды', 'Экономия воды в быту', 5, 'литров', 'Droplets', 'Ресурсы'),
('Экономия электричества', 'Экономия электроэнергии', 8, 'кВт⋅ч', 'Zap', 'Энергия'),
('Посадка растений', 'Посадка деревьев, цветов или других растений', 25, 'штук', 'TreePine', 'Природа'),
('Уборка территории', 'Уборка мусора в парках, дворах, на улицах', 20, 'кв.м', 'Trash2', 'Чистота'),
('Использование велосипеда', 'Поездки на  'Природа'),
('Уборка территории', 'Уборка мусора в парках, дворах, на улицах', 20, 'кв.м', 'Trash2', 'Чистота'),
('Использование велосипеда', 'Поездки на велосипеде вместо автомобиля', 12, 'км', 'Bike', 'Транспорт'),
('Использование общественного транспорта', 'Поездки на автобусе, метро вместо личного авто', 8, 'поездок', 'Bus', 'Транспорт'),
('Компостирование', 'Создание компоста из органических отходов', 15, 'кг', 'Leaf', 'Переработка'),
('Отказ от пластиковых пакетов', 'Использование эко-сумок вместо пластиковых пакетов', 3, 'штук', 'ShoppingBag', 'Экология');

-- Создаем тестовую школу
INSERT INTO schools (name, address) VALUES 
('Средняя школа №1', 'ул. Школьная, 15, г. Москва');

-- Создаем тестовые классы
INSERT INTO classes (name, grade, school_id) VALUES 
('5А', '5', 1),
('5Б', '5', 1),
('6А', '6', 1),
('7А', '7', 1);

-- Создаем тестового директора
INSERT INTO users (name, email, password, role, school_id) VALUES 
('Иванов Иван Иванович', 'director@school1.ru', '$2b$10$example', 'director', 1);

-- Обновляем школу, указав директора
UPDATE schools SET director_id = 1 WHERE id = 1;
