import Stripe from 'stripe';

export default class PaymentService {

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    }


    createPaymentIntent = async (data) => {
        const paymentIntent = await this.stripe.paymentIntents.create(data)
        console.log("Stripe result:");
        console.log(paymentIntent);
        return paymentIntent;
    }


}