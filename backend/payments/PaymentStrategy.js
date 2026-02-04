class PaymentStrategy {
  async processPayment(details, amount) {
    throw new Error('PaymentStrategy.processPayment must be implemented');
  }
}
module.exports = PaymentStrategy;
