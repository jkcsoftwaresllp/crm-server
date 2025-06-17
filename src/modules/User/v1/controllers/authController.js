import * as AuthService from "../services/authService.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(req, res) {
  const { email, password, name, organization } = req.body; // ⬅️ Added organization

  if (!email || !password || !name || !organization?.name || !organization?.domain) {
    return res.status(400).json({
      message: 'Email, name, password, organization name and domain are required'
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const result = await AuthService.signup({ email, password, name, organization }); // ⬅️ Pass organization

  if (!result.success) {
    return res.status(409).json({ message: result.message });
  }

  res.status(201).json({ userId: result.userId });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const result = await AuthService.login(email, password);

  if (!result.success) {
    return res.status(401).json({ message: result.message });
  }

  res.status(200).json({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user
  });
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  const result = await AuthService.refresh(refreshToken);

  if (!result.success) {
    return res.status(401).json({ message: result.message });
  }

  res.status(200).json({ accessToken: result.accessToken });
}

export async function logout(req, res) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await AuthService.logout(userId);
  res.status(200).json({ message: 'Logged out successfully' });
}