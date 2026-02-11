import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  const subtotal = getTotal();
  const shipping = subtotal >= 200 ? 0 : 15;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shipping + estimatedTax;

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!user && !guestEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const cartItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.product.image,
      }));

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: {
          items: cartItems,
          customerEmail: guestEmail || undefined,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Clear cart before redirecting
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: unknown) {
      const hasMsg = typeof error === "object" && error !== null && "message" in error;
      const message = hasMsg ? String((error as { message: unknown }).message) : "Something went wrong. Please try again.";
      const hasContext = typeof error === "object" && error !== null && "context" in error;
      const context = hasContext ? (error as { context?: unknown }).context : undefined;
      const contextMsg =
        typeof context === "object" && context !== null && "error" in (context as Record<string, unknown>)
          ? String((context as Record<string, unknown>).error)
          : undefined;
      const finalMessage =
        message.includes("Failed to send a request to the Edge Function")
          ? "Checkout service is temporarily unavailable. Please try again in a moment."
          : contextMsg || message;
      toast({ title: "Checkout failed", description: finalMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
          <ShoppingBag className="w-20 h-20 text-muted-foreground mb-6" />
          <h1 className="font-serif text-3xl mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            Discover our exquisite collection of luxury dresses for your special moments.
          </p>
          <Button onClick={() => navigate("/shop")} size="lg">
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate("/shop")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>

        <h1 className="font-serif text-4xl mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-semibold mt-2">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Guest Email */}
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send your order confirmation to this email.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <p>
                    Your payment information will be processed securely by Stripe.
                    We never store your card details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif">Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Shipping
                      {shipping === 0 && (
                        <span className="text-xs ml-1 text-primary">(Free)</span>
                      )}
                    </span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {subtotal < 200 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Add ${(200 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
