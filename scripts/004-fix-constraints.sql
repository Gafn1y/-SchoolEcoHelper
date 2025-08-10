-- Drop existing foreign key constraints if they exist
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_class_id;
ALTER TABLE schools DROP CONSTRAINT IF EXISTS fk_schools_director;

-- Add foreign key constraints with proper handling
ALTER TABLE users ADD CONSTRAINT fk_users_class_id 
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;

ALTER TABLE schools ADD CONSTRAINT fk_schools_director 
    FOREIGN KEY (director_id) REFERENCES users(id) ON DELETE SET NULL;

-- Ensure all tables have proper constraints
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_fkey;
ALTER TABLE classes ADD CONSTRAINT fk_classes_teacher_id 
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL;

-- Update eco_actions to ensure unit column exists
ALTER TABLE eco_actions ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'раз';

-- Update existing eco_actions with units if they don't have them
UPDATE eco_actions SET unit = 'кг' WHERE name LIKE '%бумаги%' AND unit IS NULL;
UPDATE eco_actions SET unit = 'шт' WHERE name LIKE '%бутылки%' AND unit IS NULL;
UPDATE eco_actions SET unit = 'раз' WHERE unit IS NULL;
