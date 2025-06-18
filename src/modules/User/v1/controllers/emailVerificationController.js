import { verifyEmailToken } from "../services/emailVerificationService.js";

export async function verifyEmail(req, res) {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const result = await verifyEmailToken(token);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
