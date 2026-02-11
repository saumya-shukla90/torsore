import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { placeholderProducts } from "@/data/placeholderProducts";
import { Product } from "@/components/shop/ProductCard";
import { ProductGrid } from "@/components/shop/ProductGrid";

export default function Wedding() {
  const weddingCategories = ["Wedding Dresses", "Bridal Gowns"];
  const products: Product[] = placeholderProducts.filter((p) =>
    weddingCategories.some((c) => p.category === c)
  );

  return (
    <Layout>
      <section className="relative h-64 md:h-80 bg-secondary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1920&h=600&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 mt-6">Wedding Collection</h1>
            <p className="text-white/80 text-lg">Timeless silhouettes crafted for your special day</p>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl mb-2">About the Collection</h2>
                <p className="text-muted-foreground">
                  Premium fabrics, hand-embellished details, and custom-tailored fits. Discover gowns in ivory, blush, and champagne tones with classic and modern cuts.
                </p>
              </CardContent>
            </Card>
            <div className="mt-8">
              <ProductGrid products={products} />
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="font-medium mb-1">Customization</div>
                <div className="text-sm text-muted-foreground">Made-to-measure, color options, embroidery upgrades.</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="font-medium mb-1">Fabric & Care</div>
                <div className="text-sm text-muted-foreground">Silk, satin, lace blends. Dry-clean recommended.</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="font-medium mb-1">Shipping</div>
                <div className="text-sm text-muted-foreground">Worldwide shipping with insured delivery.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
