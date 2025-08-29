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
  t.name as teacher_name,
  t.email as teacher_email,
  COUNT(s.id) as student_count
FROM classes c
LEFT JOIN users t ON c.teacher_id = t.id AND t.role = 'teacher'
LEFT JOIN users s ON c.id = s.class_id AND s.role = 'student'
GROUP BY c.id, c.name, c.grade, t.name, t.email
ORDER BY c.grade, c.name;
