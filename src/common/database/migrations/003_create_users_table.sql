-- Enhanced Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type_id TINYINT NOT NULL,
    organization_id INT NULL, -- NULL for platform users
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    refresh_token TEXT,
    preferences JSON, -- User-specific UI/notification preferences
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_type_id) REFERENCES user_types(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    
    INDEX idx_email (email),
    INDEX idx_org_type (organization_id, user_type_id),
    INDEX idx_active_users (is_active, user_type_id),
    INDEX idx_verification (email_verification_token),
    INDEX idx_password_reset (password_reset_token)
);