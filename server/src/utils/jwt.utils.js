import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chph_kinesiology_secret_key_2026";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization || null,
      major: user.major || null,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
