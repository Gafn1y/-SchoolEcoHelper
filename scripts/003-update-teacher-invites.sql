-- Update teacher invites table to support direct website invitations
ALTER TABLE teacher_invites ADD COLUMN IF NOT EXISTS invite_code VARCHAR(20) UNIQUE;
ALTER TABLE teacher_invites ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;
ALTER TABLE teacher_invites ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id);

-- Create index for invite codes
CREATE INDEX IF NOT EXISTS idx_teacher_invites_code ON teacher_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_teacher_invites_status ON teacher_invites(status);

-- Update user_actions table to ensure proper foreign key constraints
ALTER TABLE user_actions ALTER COLUMN status SET DEFAULT 'pending';

-- Add class_id to users table if not exists (for proper class assignment)
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id);

-- Create index for class assignments
CREATE INDEX IF NOT EXISTS idx_users_class_id ON users(class_id);
