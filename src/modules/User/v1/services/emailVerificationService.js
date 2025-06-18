import {
  findUserByVerificationToken,
  markUserEmailVerified,
} from "../repositories/emailVerificationRepository.js";

export async function verifyEmailToken(token) {
  const user = await findUserByVerificationToken(token);

  if (!user) {
    return { success: false, message: "Invalid or expired token" };
  }

  const now = new Date();
  const expiresAt = new Date(user.email_verification_expires);

  if (expiresAt < now) {
    return { success: false, message: "Token has expired" };
  }

  await markUserEmailVerified(user.id);
  return { success: true };
}
    