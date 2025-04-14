import argon2 from "argon2";

export async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password);
    console.log("Hashed password:", hash);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
  }
}

export const verifyPassword = async (
  hash: string,
  plainPassword: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch (error) {
    return false;
  }
};
