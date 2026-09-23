const crypto = require('crypto');

const generateOrderId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Random 4 character alphanumeric uppercase suffix
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `GNC-${dateStr}-${randomSuffix}`;
};

module.exports = generateOrderId;
