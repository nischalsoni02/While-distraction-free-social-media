import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, DocumentData } from 'firebase/firestore';
import { app, auth } from '../../firebase/config/Firebase';
import styles from "./Explore.module.css";
import { Button } from '@nextui-org/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import useImageWithFallback from '../Functions/ImageFallbaclFunction';
import { followUser } from '../Functions/FollowFunction'; // Adjust the path to your followUser function
import { unfollowUser } from '../Functions/unFollowFunction'; // Adjust the path to your unfollowUser function

const db = getFirestore(app);

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [peopleResults, setPeopleResults] = useState<DocumentData[]>([]);
  const [communitiesResults, setCommunitiesResults] = useState<DocumentData[]>([]);
  const [selectedTab, setSelectedTab] = useState('People');
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch();
    } else {
      setPeopleResults([]);
      setCommunitiesResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const usersQuery = collection(db, 'users');
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs
        .filter(doc => {
          const userData = doc.data();
          return userData.name && userData.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setPeopleResults(usersData);

      const communitiesQuery = collection(db, 'communities');
      const communitiesSnapshot = await getDocs(communitiesQuery);
      const communitiesData = communitiesSnapshot.docs
        .filter(doc => {
          const communityData = doc.data();
          return communityData.name && communityData.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setCommunitiesResults(communitiesData);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleFollowToggle = async (id: string) => {
    const currentUserId = user?.uid; // Replace with the actual current user's ID
    console.log(id)
    try {
      if (following[id]) {
        await unfollowUser(currentUserId, id);
      } else {
        await followUser(currentUserId, id);
      }
      setFollowing(prev => ({ ...prev, [id]: !prev[id] }));
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="Search" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <div className={styles.categoryButtons}>
        <button className={`${styles.categoryButton} ${selectedTab === 'People' ? styles.activeTab : ''}`} onClick={() => handleTabChange('People')}>
          People
        </button>
        <button className={`${styles.categoryButton} ${selectedTab === 'Communities' ? styles.activeTab : ''}`} onClick={() => handleTabChange('Communities')}>
          Communities
        </button>
      </div>
      <div>
        {searchQuery.trim() !== '' && (
          <>
            <h2 className={styles.selectedTab}>{selectedTab}</h2>
            <div className={styles.searchResults}>
              {selectedTab === 'People' && peopleResults.map((result: DocumentData) => (
                <div 
                  className={styles.resultCard} 
                  key={result.id} 
                >
                  <img src={result.image} alt="Profile" className={styles.profileImage} />
                  <div className={styles.infoContainer}>
                    <p className={styles.name}>{result.name}</p>
                  </div>
                  <Button
                    className={following[result.id] ? styles.unfollowButton : styles.followButton}
                    size="sm"
                    onPress={() => handleFollowToggle(result.id)}
                  >
                    {following[result.id] ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              ))}
              {selectedTab === 'Communities' && communitiesResults.map((result: DocumentData) => (
                <div className={styles.resultCard} key={result.id}>
                  <img src={result.image} alt="Profile" className={styles.profileImage} />
                  <div className={styles.infoContainer}>
                    <p className={styles.name}>{result.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
