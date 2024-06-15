// pages/index.tsx
import Videos from '@/components/Video/Videos';
import HomeProfile from '@/components/Profile/HomeProfile';
import styles from '../styles/HomePages.module.css';

const HomePage = () => (
  <div className={styles.home}>
    <Videos />
    <div className={styles.homeProfile}>
      <HomeProfile />
    </div>
  </div>
);

export default HomePage;
