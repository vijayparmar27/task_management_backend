import CryptoJS from "crypto-js";
/**
 * Encrypts the provided token using the specified secret key.
 *
 * @param token The token to encrypt.
 * @param secretKey The secret key used for encryption.
 * @returns The encrypted token as a string.
 */
export const encryptToken = (token: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(token, secretKey).toString();
};

/**
 * Decrypts the provided encrypted token using the specified secret key.
 *
 * @param encryptedToken The encrypted token to decrypt.
 * @param secretKey The secret key used for decryption.
 * @returns The decrypted token as a string.
 */
export const decryptToken = (
  encryptedToken: string,
  secretKey: string
): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
