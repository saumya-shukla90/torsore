import { Layout } from "@/components/layout/Layout";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramFeed } from "@/components/home/InstagramFeed";

const Index = () => {
  return (
    <Layout>
      <HeroSlider />
      <Features />
      <FeaturedCollections />
      <NewArrivals />
      <Testimonials />
      <InstagramFeed />
    </Layout>
  );
};

export default Index;
