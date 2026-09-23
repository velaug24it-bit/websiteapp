const Razorpay = require('razorpay');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayInstance && keyId && keySecret) {
    try {
      razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } catch (err) {
      console.warn('⚠️ Razorpay initialization warning:', err.message);
    }
  }

  return razorpayInstance;
};

module.exports = { getRazorpayInstance };
