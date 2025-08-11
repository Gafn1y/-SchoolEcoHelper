-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_id INTEGER;

-- Add missing columns to eco_actions table  
ALTER TABLE eco_actions ADD COLUMN IF NOT EXISTS unit VARCHAR(20) DEFAULT 'раз';

-- Add missing columns to classes table
ALTER TABLE classes ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 30;

-- Add missing columns that might be needed

-- Ensure user_actions table has all required columns
ALTER TABLE user_actions ADD COLUMN IF NOT EXISTS reviewed_by INTEGER REFERENCES users(id);
ALTER TABLE user_actions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

-- Add foreign key constraints after columns exist
DO $$ 
BEGIN
    -- Add class_id foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_users_class_id' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT fk_users_class_id 
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;
    END IF;

    -- Add reviewed_by foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_user_actions_reviewed_by' 
        AND table_name = 'user_actions'
    ) THEN
        ALTER TABLE user_actions ADD CONSTRAINT fk_user_actions_reviewed_by 
            FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Update existing eco_actions with proper units
UPDATE eco_actions SET unit = 'кг' WHERE name LIKE '%бумаги%' AND (unit IS NULL OR unit = 'раз');
UPDATE eco_actions SET unit = 'шт' WHERE name LIKE '%бутылки%' AND (unit IS NULL OR unit = 'раз');
UPDATE eco_actions SET unit = 'шт' WHERE name LIKE '%деревьев%' AND (unit IS NULL OR unit = 'раз');

-- Add indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_users_class_id ON users(class_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_reviewed_by ON user_actions(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_user_actions_status ON user_actions(status);

-- Update any existing user_actions to have proper status
UPDATE user_actions SET status = 'pending' WHERE status IS NULL;
