import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "info";

const styles: Record<Variant, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-green-700 text-white",
  warning: "bg-amber-600 text-black",
  info: "bg-royal-blue text-white",
};

export function AnnouncementBar({
  message = "Festival Offer: Get 15% OFF on Party Wear. Use code FEST15.",
  variant = "success",
  storageKey = "torsore-announcement-dismissed",
}: {
  message?: string;
  variant?: Variant;
  storageKey?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  };

  if (!visible) return null;

  return (
    <div className={cn("w-full border-b border-black/10", styles[variant])}>
      <div className="container mx-auto px-4 lg:px-8 h-10 flex items-center justify-between text-sm">
        <span className="font-medium tracking-wide">{message}</span>
        <button
          aria-label="Close announcement"
          onClick={close}
          className="p-1 rounded hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

