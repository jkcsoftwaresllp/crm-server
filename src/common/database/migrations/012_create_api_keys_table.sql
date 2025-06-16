-- API Keys (for programmatic access)
CREATE TABLE api_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    organization_id INT,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL, -- Store hashed version
    key_prefix VARCHAR(20) NOT NULL, -- First few chars for identification
    permissions JSON, -- Specific permissions for this key
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_key_hash (key_hash),
    INDEX idx_user (user_id),
    INDEX idx_org (organization_id),
    INDEX idx_prefix (key_prefix),
    INDEX idx_active (is_active)
);