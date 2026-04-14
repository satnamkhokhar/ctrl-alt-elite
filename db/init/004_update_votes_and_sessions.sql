-- Add new columns to sessions table
ALTER TABLE sessions
    ADD COLUMN IF NOT EXISTS matched_restaurant_id BIGINT REFERENCES restaurants(restaurant_id),
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add unique constraint to prevent duplicate votes
ALTER TABLE votes
DROP CONSTRAINT IF EXISTS unique_vote;

ALTER TABLE votes
    ADD CONSTRAINT unique_vote UNIQUE (session_id, user_id, restaurant_id);