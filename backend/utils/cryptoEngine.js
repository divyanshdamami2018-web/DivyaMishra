const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

// The ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes).
// Provide a fallback for local development if not yet set in .env.
const getEncryptionKey = () => {
    const hexString = process.env.ENCRYPTION_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
    return Buffer.from(hexString, 'hex');
};

function encrypt(text) {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag().toString('hex');
        // Format: iv:authTag:encryptedData
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
        console.error("Encryption failed.", error);
        return text;
    }
}

function decrypt(text) {
    if (!text || typeof text !== 'string' || !text.includes(':')) return text;
    try {
        const [ivHex, authTagHex, encryptedHex] = text.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed. Returning raw text.", error);
        return text; // Fallback during migration or key rotation
    }
}

module.exports = { encrypt, decrypt };
