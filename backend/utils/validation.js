const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{2,30}$/;

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const validateEmail = (email) => EMAIL_REGEX.test(email);

const validateUsername = (username) => USERNAME_REGEX.test(username);

const validatePasswordStrength = (password) => {
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  ) {
    return false;
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return hasLetter && hasNumber;
};

module.exports = {
  normalizeString,
  validateEmail,
  validateUsername,
  validatePasswordStrength,
};
