-- Organizations table (Multi-tenancy support)
CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    subdomain VARCHAR(100) UNIQUE, -- For custom subdomains like customer.yourcrm.com
    logo_url VARCHAR(500),
    subscription_plan ENUM('trial', 'basic', 'premium', 'enterprise') DEFAULT 'trial',
    subscription_status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    max_users INT DEFAULT 10,
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSON, -- Store org-specific settings
    trial_ends_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_domain (domain),
    INDEX idx_subdomain (subdomain),
    INDEX idx_subscription (subscription_status, subscription_plan)
);