import { registerCompanyWithAdmin } from '../services/companyService.js';

export const registerCompany = async (req, res) => {
  try {
    console.log("Received body:", req.body);

    const reshapedBody = {
      organization: {
        name: req.body.companyName
      },
      adminUser: {
        name: req.body.adminName,
        email: req.body.adminEmail,
        password: req.body.adminPassword
      }
    };

    const result = await registerCompanyWithAdmin(reshapedBody);
    res.status(201).json({
      message: 'Company registered successfully',
      data: result
    });
  } catch (err) {
    console.error('Company registration failed:', err.message);
    res.status(500).json({
      error: 'Company registration failed',
      details: err.message
    });
  }
};
