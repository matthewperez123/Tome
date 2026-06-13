import { NextResponse } from "next/server"
import { getStripeClient, getStripeWebhookSecret } from "@/lib/integrations/stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const stripe = getStripeClient()
  const webhookSecret = getStripeWebhookSecret()

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured for this environment." },
      { status: 503 },
    )
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 })
  }

  const body = await request.text()

  try {
    stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 })
  }

  // TODO: Wire subscription/customer state once real Tome Stripe products exist.
  return NextResponse.json({ received: true })
}
