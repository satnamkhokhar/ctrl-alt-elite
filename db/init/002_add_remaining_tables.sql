CREATE TABLE IF NOT EXISTS restaurants (
  restaurant_id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location TEXT,
  min_price NUMERIC(10,2),
  max_price NUMERIC(10,2),
  phone_number VARCHAR(30),
  cuisine VARCHAR(100),
  rating NUMERIC(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id BIGSERIAL PRIMARY KEY,
  budget NUMERIC(10,2),
  max_distance NUMERIC(10,2),
  dietary_restrictions TEXT,
  active_users INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_users (
  session_user_id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE (session_id, user_id)
);

CREATE TABLE IF NOT EXISTS votes (
  vote_id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  vote_value VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_history (
  group_id BIGSERIAL PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  session_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  restaurants_history TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
