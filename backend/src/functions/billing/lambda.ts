import Stripe from "stripe";
import apiHandler from "../../util/apiHandler";
import { calculateCost } from "../../util/cost";
import { APIGatewayProxyEvent } from 'aws-lambda';

type BillingBody = {
    storage: number;
    source: string;
}

export const main = apiHandler(async (event: APIGatewayProxyEvent) => {
    const { storage, source } = JSON.parse(event.body || '') as BillingBody;
    const amount = calculateCost(storage);
    const description = "Scratch charge";

    // Load our secret key from the  environment variables
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27'
    });

    await stripe.charges.create({
        source,
        amount,
        description,
        currency: "usd",
    });

    return { body: { status: true } };
});