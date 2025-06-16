-- Activity log for audit trail
CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    organization_id INT,
    action VARCHAR(100) NOT NULL, -- 'user.created', 'role.assigned', etc.
    resource_type VARCHAR(50), -- 'user', 'role', 'permission'
    resource_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    
    INDEX idx_user (user_id),
    INDEX idx_org (organization_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created (created_at)
);