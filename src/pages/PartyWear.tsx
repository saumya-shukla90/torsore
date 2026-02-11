import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { placeholderProducts } from "@/data/placeholderProducts";
import { Product } from "@/components/shop/ProductCard";
import { ProductGrid } from "@/components/shop/ProductGrid";

export default function PartyWear() {
  const partyCategories = ["Party Dresses", "Cocktail Dresses", "Evening Gowns"];
  const products: Product[] = placeholderProducts.filter((p) =>
    partyCategories.some((c) => p.category === c)
  );

  return (
    <Layout>
      <section className="relative h-64 md:h-80 bg-secondary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&h=600&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 mt-6">Party Wear</h1>
            <p className="text-white/80 text-lg">Statement pieces for celebrations and evenings</p>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl mb-2">About Party Wear</h2>
                <p className="text-muted-foreground">
                  Sequin finishes, velvet textures, and elegant silhouettes. Explore bold colors and refined cuts for cocktail nights and festive moments.
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
                <div className="font-medium mb-1">Styling</div>
                <div className="text-sm text-muted-foreground">Match with accessories for a complete look.</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="font-medium mb-1">Fit</div>
                <div className="text-sm text-muted-foreground">Comfort with structure to flatter the silhouette.</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="font-medium mb-1">Care</div>
                <div className="text-sm text-muted-foreground">Gentle care to preserve shine and texture.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
