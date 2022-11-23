import createMollieClient from '@mollie/api-client';
export class PaymentModule {
  private client: any
  constructor() {
    this.client = createMollieClient({ apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM' });
  }

  /**
   * Makes payment to Mollie Client and returns webhook URL
   * @param value price of prooduct
   * @param currency from array of known currencies
   * @param orderId 
   * @param description 
   * @returns {Promise<string>}
   */
  async checkout(value: string, currency: string, orderId: string, description: string): Promise<string> {
    console.log('PAyment here');
    
    return this.client.payments.create({
      amount: {
        value,
        currency,
      },
      description,
      redirectUrl: `localhost:8080/order/${orderId}`,
      webhookUrl: 'localhost:3000/order',
    });
  }

  /**
   * Returns ID of item on next page for pagination. Pass in the ID for next page.
   * @param from This is the ID of the previous request  
   * @param limit Amount of returned items 
  */
  async getPaymentList(limit: number, from?: string):Promise<string> {
    return this.client.payments.page({
      limit,
      from,
    })
  }
}