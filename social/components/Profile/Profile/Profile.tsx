import React, { useEffect, useState } from 'react';
import { app } from '../../../firebase/config/Firebase';
import styles from './Profile.module.css';
import { User } from '../../../firebase/Models/User';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import ProfileLoops from '@/components/Loop/ProfileLoops/ProfileLoops';
import ProfileVideos from '@/components/Video/ProfileVideos/ProfileVideos';
import useImageWithFallback from '@/components/Functions/ImageFallbaclFunction'; // Import the hook

const db = getFirestore(app);

interface ProfileProps {
  authId: string;
}

const Profile: React.FC<ProfileProps> = ({ authId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('loops');

  // Integrate useImageWithFallback hook for user image
  const imageUrl = user?.image || ''; // Assuming user.image is the URL of the user's image
  const imgSrc = useImageWithFallback(imageUrl);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, 'users', authId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data() as User;
          setUser(userData);

          // Fetch followers count
          const followersQuery = await getDocs(collection(db, 'users', authId, 'followers'));
          const followersCount = followersQuery.size;

          // Fetch following count
          const followingQuery = await getDocs(collection(db, 'users', authId, 'following'));
          const followingCount = followingQuery.size;

          // Fetch posts count (assuming videos and loops are posts)
          const videosQuery = await getDocs(collection(db, 'users', authId, 'videos'));
          const loopsQuery = await getDocs(collection(db, 'users', authId, 'loops'));
          const postsCount = videosQuery.size + loopsQuery.size;

          // Update user object with additional counts
          setUser({
            ...userData,
            follower: followersCount,
            following: followingCount,
            easyQuestions: postsCount, // Assuming easyQuestions represents posts count
          });
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'loops':
        return <ProfileLoops uid={authId} />;
      case 'videos':
        return <ProfileVideos uid={authId} />;
      case 'quiz':
        return <div>Quiz Content</div>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img src={imgSrc} alt={user.name} className={styles.profileImage} /> {/* Use imgSrc here */}
        <div className={styles.profileDetails}>
          <h2>{user.name} <span className={styles.verifiedIcon}>✔️</span></h2>
          <p>{user.email}</p>
          <p>{user.about}</p>
        </div>
      </div>
      <div className={styles.profileStats}>
        <div className={styles.statItem}>
          <strong>{user.follower}</strong>
          <span>Followers</span>
        </div>
        <div className={styles.statItem}>
          <strong>{user.following}</strong>
          <span>Following</span>
        </div>
        <div className={styles.statItem}>
          <strong>{user.easyQuestions}</strong>
          <span>Posts</span>
        </div>
      </div>
      <button className={styles.editProfileButton}>Edit Profile</button>
      <h3 className={styles.suggestionsHeader}>Profiles you may like</h3>
      <div className={styles.suggestions}>
        <div className={styles.suggestionItem}>
          <img src="https://via.placeholder.com/50" alt="Suggested User" />
          <p>Jane Cooper</p>
        </div>
        <div className={styles.suggestionItem}>
          <img src="https://via.placeholder.com/50" alt="Suggested User" />
          <p>John Doe</p>
        </div>
        <div className={styles.suggestionItem}>
          <img src="https://via.placeholder.com/50" alt="Suggested User" />
          <p>Jane Smith</p>
        </div>
      </div>
      <div className={styles.tabs}>
        <button className={activeTab === 'loops' ? styles.activeTab : ''} onClick={() => setActiveTab('loops')}>Loops</button>
        <button className={activeTab === 'videos' ? styles.activeTab : ''} onClick={() => setActiveTab('videos')}>Videos</button>
        <button className={activeTab === 'quiz' ? styles.activeTab : ''} onClick={() => setActiveTab('quiz')}>Quiz</button>
      </div>
      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
