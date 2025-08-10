-- Обновляем структуру для системы классных руководителей

-- Добавляем поле is_homeroom_teacher в таблицу users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_homeroom_teacher BOOLEAN DEFAULT FALSE;

-- Обновляем существующих учителей как классных руководителей
UPDATE users SET is_homeroom_teacher = TRUE WHERE role = 'teacher';

-- Убираем поле subject из teacher_invites если оно есть
ALTER TABLE teacher_invites DROP COLUMN IF EXISTS subject;

-- Добавляем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_class_role ON users(class_id, role);
CREATE INDEX IF NOT EXISTS idx_users_homeroom ON users(is_homeroom_teacher) WHERE is_homeroom_teacher = TRUE;

-- Обновляем ограничения
-- Один учитель может быть классным руководителем только одного класса
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_homeroom_teacher 
ON users(class_id) 
WHERE role = 'teacher' AND is_homeroom_teacher = TRUE;
