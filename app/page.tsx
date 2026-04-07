import HeroSection from '@/components/HeroSection'
import MarqueeSection from '@/components/MarqueeSection'
import CategoryGrid from '@/components/CategoryGrid'
import TopCards from '@/components/TopCards'
import TrustSection from '@/components/TrustSection'
import StatsSection from '@/components/StatsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <CategoryGrid />
      <TopCards />
      <TrustSection />
      <StatsSection />
    </>
  )
}
