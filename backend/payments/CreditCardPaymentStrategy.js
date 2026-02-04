const axios = require('axios');
const PaymentStrategy = require('./PaymentStrategy');

class CreditCardPaymentStrategy extends PaymentStrategy {
  async processPayment(details, amount) {
    const payload = {
      method: 'CreditCard',
      amount,
      currency: details.currency,
      cardToken: details.cardToken
    };
    const { data } = await axios.post('https://fakepayment.onrender.com/payments', payload, { timeout: 8000 });
    // Se espera { status: 'APPROVED' | 'DECLINED', transactionId?: string }
    return data;
  }
}

module.exports = CreditCardPaymentStrategy;
