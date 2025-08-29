-- Обновляем teacher_id в таблице classes на основе учителей, которые выбрали класс при регистрации
UPDATE classes 
SET teacher_id = (
  SELECT u.id 
  FROM users u 
  WHERE u.class_id = classes.id 
    AND u.role = 'teacher' 
  LIMIT 1
)
WHERE teacher_id IS NULL;

-- Проверяем результат
SELECT 
  c.id,
  c.name as class_name,
  c.grade,
  u.name as teacher_name,
  u.email as teacher_email,
  (SELECT COUNT(*) FROM users s WHERE s.class_id = c.id AND s.role = 'student') as student_count
FROM classes c
LEFT JOIN users u ON c.teacher_id = u.id
ORDER BY c.grade, c.name;
