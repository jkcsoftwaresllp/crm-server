-- Roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280', -- Hex color for UI
    organization_id INT NULL, -- NULL for platform roles
    user_type_id TINYINT NOT NULL,
    is_system_role BOOLEAN DEFAULT FALSE, -- Pre-defined roles
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_type_id) REFERENCES user_types(id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_role_per_scope (name, organization_id, user_type_id),
    INDEX idx_org_type (organization_id, user_type_id),
    INDEX idx_system (is_system_role),
    INDEX idx_active (is_active)
);