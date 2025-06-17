import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { insertCom } from '../repositories/comRepository.js';
import { createUser } from '../repositories/userRepository.js';
import { generateUniqueSubdomain } from '../../../../common/utils/subdomainGenerator.js'; // ✅ import new utility

// Helper to generate a random token
const generateToken = () => crypto.randomBytes(32).toString('hex');

export const registerComService = async (payload) => {
  const { organization, adminUser, is_auto_approve = false } = payload;

  // ✅ Step 1: Destructure and handle subdomain
  const {
    name,
    domain = null,
    subdomain: inputSubdomain,
    logo_url = null,
    email = null,
    phone = null,
  } = organization;

  // ✅ Step 2: If no subdomain given, auto-generate it
  const subdomain = inputSubdomain || await generateUniqueSubdomain(name);

  // ✅ Step 3: Prepare orgData
  const orgData = {
    name,
    domain,
    subdomain,
    logo_url,
    email,
    phone,
    is_active: is_auto_approve,
  };

  // ✅ Step 4: Insert into organizations table
  const organizationId = await insertCom(orgData);

  // ✅ Step 5: Hash admin password
  const hashedPassword = await bcrypt.hash(adminUser.password, 10);

  // ✅ Step 6: Prepare admin data
  const adminData = {
    name: adminUser.name,
    email: adminUser.email,
    password: hashedPassword,
    user_type_id: 1, // Assuming 1 = Admin
    organization_id: organizationId,
    is_active: is_auto_approve,
    email_verification_token: generateToken(),
  };

  // ✅ Step 7: Insert admin user
  const userId = await createUser(adminData);

  return {
    message: 'Company registered successfully',
    organization: {
      id: organizationId,
      name,
      subdomain,
    },
    adminUser: {
      id: userId,
      email: adminUser.email,
    },
  };
};