-- Fix foreign key constraints that might be causing issues

-- Drop existing constraints if they exist
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_class_id;
ALTER TABLE schools DROP CONSTRAINT IF EXISTS fk_schools_director;

-- Recreate constraints with proper handling
ALTER TABLE users ADD CONSTRAINT fk_users_class_id 
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;

-- For schools-director relationship, we need to be careful about circular dependencies
-- We'll add this constraint after ensuring data integrity
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_schools_director'
    ) THEN
        ALTER TABLE schools ADD CONSTRAINT fk_schools_director 
            FOREIGN KEY (director_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Ensure all existing data has proper relationships
UPDATE users SET class_id = NULL WHERE class_id IS NOT NULL AND class_id NOT IN (SELECT id FROM classes);
UPDATE schools SET director_id = NULL WHERE director_id IS NOT NULL AND director_id NOT IN (SELECT id FROM users);
