const crypto = require('crypto');

const secret = crypto.createHash('sha256').update(process.env.ADMIN_SECRET).digest(); 

const iv = Buffer.alloc(16, 0); 

const encryptId = (id) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
  let encrypted = cipher.update(id, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decryptId = (encrypted) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};


module.exports = {encryptId, decryptId}
