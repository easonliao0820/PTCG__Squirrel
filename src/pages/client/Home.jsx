import styles from '../../styles/pages/Home.module.scss'
import {
  Hero,
  Intro,
  Charge,
  LocationMap,
  Cta,
  LocationGallery,
  ChargingHours,
} from '../../components/home'

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <Intro />
      <Charge />
      <LocationMap />
      <ChargingHours />
      <LocationGallery />
      <Cta />
    </div>
  )
}
