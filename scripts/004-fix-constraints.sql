-- Drop existing foreign key constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_class_id;

-- Recreate the constraint with proper handling
ALTER TABLE users ADD CONSTRAINT fk_users_class_id 
FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;

-- Add missing constraints
ALTER TABLE user_actions ADD CONSTRAINT IF NOT EXISTS fk_user_actions_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_actions ADD CONSTRAINT IF NOT EXISTS fk_user_actions_action_id 
FOREIGN KEY (action_id) REFERENCES eco_actions(id) ON DELETE CASCADE;

ALTER TABLE user_actions ADD CONSTRAINT IF NOT EXISTS fk_user_actions_reviewed_by 
FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;
