import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Package, Truck, Mail, ArrowRight, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface OrderDetails {
  orderId: string;
  paymentIntentId: string;
  status: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  lineItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  shippingMethod: string;
  total: number;
  createdAt: string;
}

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No order session found");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-order-details", {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: { sessionId },
        });

        if (error) throw error;
        setOrder(data);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  const copyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      toast({ title: "Order ID copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="font-serif text-3xl mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || "We couldn't find your order. Please check your email for confirmation."}
          </p>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="font-serif text-4xl mb-4">Thank You for Your Order!</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            We've received your order and will begin processing it shortly.
          </p>
        </motion.div>

        {/* Order ID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/50 rounded-lg p-6 text-center mb-12"
        >
          <p className="text-sm text-muted-foreground mb-2">Order Reference</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-lg font-mono">
              {order.orderId.slice(0, 8)}...{order.orderId.slice(-4)}
            </code>
            <Button variant="ghost" size="icon" onClick={copyOrderId}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.lineItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{order.shippingMethod}</span>
                    <span>${order.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Shipping & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && <><br />{order.shippingAddress.line2}</>}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Confirmation Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A confirmation email has been sent to:
                </p>
                <p className="font-medium mt-2">{order.customerEmail}</p>
              </CardContent>
            </Card>

            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="pt-6">
                <h4 className="font-serif text-lg mb-2">What's Next?</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>We'll prepare your order with care</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>You'll receive a shipping confirmation with tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Your dress will arrive in 5-7 business days</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button size="lg" onClick={() => navigate("/shop")}>
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
