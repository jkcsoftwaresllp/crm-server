// Validates uploaded file metadata before processing.

export function uploadValidator(
  file,
  allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "image/jpeg",
    "image/jpg",
  ],
  maxSize = 5 * 1024 * 1024 // 5 MB
) {
  if (!file || typeof file !== "object") {
    return { valid: false, message: "No file provided." };
  }

  const { mimetype, size, originalname } = file;

  if (!allowedTypes.includes(mimetype)) {
    return {
      valid: false,
      message: `Unsupported file type: ${mimetype}. Allowed types: ${allowedTypes.join(
        ", "
      )}`,
    };
  }

  if (size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      message: `File size exceeds limit. Maximum allowed size is ${sizeMB}MB.`,
    };
  }

  const forbiddenExtensions = [".exe", ".sh", ".bat", ".js", ".php", ".py"];
  const fileExt = `.${originalname.split(".").pop().toLowerCase()}`;
  if (forbiddenExtensions.includes(fileExt)) {
    return {
      valid: false,
      message: `Files with ${fileExt} extension are not allowed.`,
    };
  }

  return { valid: true };
}
