-- Actions (what can be done)
CREATE TABLE actions (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'create', 'read', 'update', 'delete', 'export', 'import'
    description TEXT
);
