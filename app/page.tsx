import HeroSection from '@/components/HeroSection'
import MarqueeSection from '@/components/MarqueeSection'
import CategoryGrid from '@/components/CategoryGrid'
import TopCards from '@/components/TopCards'
import PartnersCarousel from '@/components/PartnersCarousel'
import TrustSection from '@/components/TrustSection'
import StatsSection from '@/components/StatsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <CategoryGrid />
      <TopCards />
      <PartnersCarousel />
      <TrustSection />
      <StatsSection />
    </>
  )
}
