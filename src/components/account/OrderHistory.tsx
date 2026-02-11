import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  size: string | null;
  color: string | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  subtotal: number;
  shipping_cost: number | null;
  tax: number | null;
  total: number;
  shipping_address: {
    name?: string;
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  processing: { label: "Processing", variant: "default" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        if (!ordersData || ordersData.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Fetch order items for all orders
        const orderIds = ordersData.map((order) => order.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        if (itemsError) throw itemsError;

        // Combine orders with their items
        const ordersWithItems: Order[] = ordersData.map((order) => ({
          ...order,
          shipping_address: order.shipping_address as Order["shipping_address"],
          items: (itemsData || []).filter((item) => item.order_id === order.id),
        }));

        setOrders(ordersWithItems);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">No orders yet</p>
        <Button variant="link" onClick={() => navigate("/shop")}>
          Start shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          
          return (
            <AccordionItem
              key={order.id}
              value={order.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                      >
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                            {item.color && ` • Color: ${item.color}`}
                          </p>
                        </div>
                        <p className="font-medium">${item.total_price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.shipping_cost !== null && order.shipping_cost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>${order.shipping_cost.toFixed(2)}</span>
                      </div>
                    )}
                    {order.tax !== null && order.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-1">Shipping Address</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_address.name && `${order.shipping_address.name}`}
                        {order.shipping_address.line1 && <><br />{order.shipping_address.line1}</>}
                        {order.shipping_address.city && (
                          <>
                            <br />
                            {order.shipping_address.city}
                            {order.shipping_address.state && `, ${order.shipping_address.state}`}
                            {order.shipping_address.postal_code && ` ${order.shipping_address.postal_code}`}
                          </>
                        )}
                        {order.shipping_address.country && <><br />{order.shipping_address.country}</>}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
