import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
};

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface CheckoutRequest {
  items: CartItem[];
  customerEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const stripeSecret = Deno.env.get("VITE_STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: "Missing VITE_STRIPE_SECRET_KEY" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    const stripe = new Stripe(stripeSecret);

    // Try to get authenticated user
    const authHeader = req.headers.get("Authorization");
    let userEmail: string | undefined;
    let userId: string | undefined;

    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY");
      if (supabaseUrl && supabaseAnon) {
        const supabaseClient = createClient(supabaseUrl, supabaseAnon);
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseClient.auth.getUser(token);
        userEmail = userData?.user?.email ?? undefined;
        userId = userData?.user?.id ?? undefined;
      }
    }

    const { items, customerEmail } = (await req.json()) as CheckoutRequest;

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    const email = userEmail || customerEmail;

    // Check for existing Stripe customer
    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Calculate shipping cost (free over $200)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const freeShippingThreshold = 200;

    const shippingOptions = [
      {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: {
            amount: subtotal >= freeShippingThreshold ? 0 : 1500,
            currency: "usd",
          },
          display_name: subtotal >= freeShippingThreshold ? "Free Shipping" : "Standard Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day" as const, value: 5 },
            maximum: { unit: "business_day" as const, value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: {
            amount: 2500,
            currency: "usd",
          },
          display_name: "Express Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day" as const, value: 2 },
            maximum: { unit: "business_day" as const, value: 3 },
          },
        },
      },
    ];

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Size: ${item.size}, Color: ${item.color}`,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.productId,
            size: item.size,
            color: item.color,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const origin = req.headers.get("origin") || "https://id-preview--d20e25ba-641b-4b5a-a103-ee51e3fbc325.lovable.app";

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "FR", "DE", "IT", "ES", "NL", "BE"],
      },
      shipping_options: shippingOptions,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        userId: userId || "guest",
        itemCount: items.length.toString(),
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
