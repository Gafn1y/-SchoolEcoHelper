-- Add additional fields to schools table
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing schools with default descriptions
UPDATE schools 
SET description = COALESCE(description, 'Наша школа активно участвует в экологических программах и стремится воспитать экологически ответственное поколение. Мы проводим различные мероприятия по охране окружающей среды и поощряем учеников за их вклад в экологию.')
WHERE description IS NULL OR description = '';

-- Ensure all teachers assigned to classes are properly set as homeroom teachers
UPDATE classes 
SET teacher_id = (
  SELECT u.id 
  FROM users u 
  WHERE u.class_id = classes.id 
    AND u.role = 'teacher' 
    AND classes.teacher_id IS NULL
  LIMIT 1
)
WHERE teacher_id IS NULL;

-- Update student counts to exclude teachers
UPDATE classes 
SET student_count = (
  SELECT COUNT(*) 
  FROM users 
  WHERE users.class_id = classes.id 
    AND users.role = 'student'
);

-- Verification queries
SELECT 'Schools with details:' as info;
SELECT id, name, director_id, phone, website, 
       CASE WHEN description IS NOT NULL THEN 'Has description' ELSE 'No description' END as desc_status
FROM schools;

SELECT 'Classes with teachers:' as info;
SELECT c.id, c.name, c.grade, c.teacher_id, u.name as teacher_name, c.student_count
FROM classes c
LEFT JOIN users u ON c.teacher_id = u.id
ORDER BY c.name;

SELECT 'Teachers assigned to classes:' as info;
SELECT u.id, u.name, u.class_id, c.name as class_name
FROM users u
LEFT JOIN classes c ON u.class_id = c.id
WHERE u.role = 'teacher'
ORDER BY u.name;
