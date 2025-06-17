import { registerComService } from '../services/comService.js';

export const registerComController = async (req, res) => {
  try {
    const data = req.body;
    console.log("Incoming registration data:", data);

    const result = await registerComService(data);
    console.log("Service result:", result);

    res.status(201).json({ message: 'Company registered', organization: result });
  } catch (error) {
    console.error('❌ Company registration error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};