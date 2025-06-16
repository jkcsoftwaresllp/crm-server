-- Resources (what can be accessed)
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL, -- 'users', 'contacts', 'deals', 'organizations'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);