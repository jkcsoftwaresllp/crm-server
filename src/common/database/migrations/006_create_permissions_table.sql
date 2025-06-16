-- Permissions (resource + action combinations)
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resource_id INT NOT NULL,
    action_id TINYINT NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL, -- Auto-generated: 'users.create', 'contacts.read'
    description TEXT,
    applies_to ENUM('platform', 'organization', 'both') DEFAULT 'both',
    is_system BOOLEAN DEFAULT TRUE, -- FALSE for custom permissions
    
    FOREIGN KEY (resource_id) REFERENCES resources(id),
    FOREIGN KEY (action_id) REFERENCES actions(id),
    
    UNIQUE KEY unique_resource_action (resource_id, action_id),
    INDEX idx_applies_to (applies_to),
    INDEX idx_system (is_system)
);