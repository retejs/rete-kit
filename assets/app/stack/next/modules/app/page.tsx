import Image from 'next/image'

import styles from './page.module.css'
import Rete from './Rete'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <Rete />
    </main>
  )
}
