-- Insert default eco actions
INSERT INTO eco_actions (name, description, points, category, icon, unit) VALUES
('Переработка бумаги', 'Сдал бумагу на переработку', 10, 'recycling', 'Recycle', 'кг'),
('Сортировка отходов', 'Правильно отсортировал отходы по категориям', 5, 'waste', 'Trash2', 'раз'),
('Пластиковые бутылки', 'Принес пластиковые бутылки на переработку', 8, 'recycling', 'Droplets', 'шт'),
('Посадка деревьев', 'Участвовал в посадке деревьев', 25, 'nature', 'TreePine', 'шт'),
('Энергосбережение', 'Внедрил меры по энергосбережению', 15, 'energy', 'Lightbulb', 'раз'),
('Эко-транспорт', 'Использовал экологичный транспорт', 12, 'transport', 'Car', 'раз');

-- Insert default badges
INSERT INTO badges (name, description, icon, points_required) VALUES
('First Steps', 'Первые шаги в экологии', 'Award', 0),
('Recycling Champion', 'Чемпион переработки', 'Recycle', 50),
('Tree Planter', 'Защитник деревьев', 'TreePine', 100),
('Energy Saver', 'Энергосберегатель', 'Lightbulb', 150),
('Eco Warrior', 'Эко-воин', 'Shield', 300),
('Green Master', 'Мастер экологии', 'Crown', 500);
