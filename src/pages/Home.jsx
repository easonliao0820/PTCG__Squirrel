import styles from '../styles/pages/Home.module.scss'
import {
  Hero,
  Intro,
  Services,
  LocationMap,
  Cta,
  LocationGallery,
  ChargingHours,
} from '../components/home'

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <Intro />
      <Services />
      <LocationMap />
      <ChargingHours />
      <LocationGallery />
      <Cta />
    </div>
  )
}
