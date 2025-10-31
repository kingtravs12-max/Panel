-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'owner', 'admin', 'user'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'blocked'
  plan VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'premium'
  balance DECIMAL(10, 2) DEFAULT 0,
  profile_picture_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- License keys table
CREATE TABLE IF NOT EXISTS license_keys (
  id SERIAL PRIMARY KEY,
  key_value VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prefix VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'expired', 'max_devices'
  expiry_date TIMESTAMP,
  max_devices INTEGER DEFAULT 1,
  devices_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  key_id INTEGER NOT NULL REFERENCES license_keys(id) ON DELETE CASCADE,
  device_name VARCHAR(255),
  device_id VARCHAR(255) UNIQUE,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin assignments table
CREATE TABLE IF NOT EXISTS admin_assignments (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by_owner_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  total_users INTEGER DEFAULT 0,
  total_keys INTEGER DEFAULT 0,
  total_devices INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default owner
INSERT INTO users (username, password_hash, role, plan, balance) 
VALUES ('Xyriel', '$2b$10$YourHashedPasswordHere', 'owner', 'premium', 999999)
ON CONFLICT (username) DO NOTHING;

-- Insert default analytics
INSERT INTO analytics (total_users, total_keys, total_devices) 
VALUES (1, 0, 0)
ON CONFLICT DO NOTHING;
