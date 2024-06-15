import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs , getDoc, doc } from 'firebase/firestore';
import { app } from '../../../firebase/config/Firebase';
import styles from './ProfileLoops.module.css';

const db = getFirestore(app);

interface Loop {
  id: string;
  category: string;
  creatorName: string;
  description: string;
  likes: string[];
  maxVideoRes: string;
  thumbnail: string;
  title: string;
  uploadedBy: string;
  videoUrl: string;
  views: number;
}

interface ProfileLoopProps {
  uid: string;
}

const ProfileLoops: React.FC<ProfileLoopProps> = ({ uid }) => {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        const userLoopsCollection = collection(db, 'users', uid, 'loops');
        const loopDocs = await getDocs(userLoopsCollection);
        
        const loopData = await Promise.all(
          loopDocs.docs.map(async (loopDoc) => {
            const loopId = loopDoc.id;
            const loopCollectionDoc = await getDoc(doc(db, 'loops', loopId));
            return loopCollectionDoc.exists() ? loopCollectionDoc.data() as Loop : null;
          })
        );
        
        setLoops(loopData.filter(loop => loop !== null) as Loop[]);
      } catch (error) {
        console.error('Error fetching loops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoops();
  }, [uid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (loops.length === 0) {
    return <div>Share your Knowledge with WHILE</div>;
  }

  return (
    <div className={styles.loopContainer}>
      {loops.map(loop => (
        <div key={loop.id} className={styles.loopCard}>
          <img src={loop.thumbnail} alt={loop.title} className={styles.thumbnail} />
          <div className={styles.loopInfo}>
            <h3>{loop.title}</h3>
            <p>{loop.description}</p>
            <div className={styles.loopStats}>
              <span>{loop.views} views</span>
              <span>{loop.likes.length} likes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileLoops;
