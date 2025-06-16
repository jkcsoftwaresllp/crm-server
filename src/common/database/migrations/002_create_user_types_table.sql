-- User types (Platform vs Organization users)
CREATE TABLE user_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Seed data: 'platform_user', 'organization_user'
    CHECK (name IN ('platform_user', 'organization_user'))
);