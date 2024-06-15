import React, { useEffect, useState } from 'react';
import styles from './LoopSection.module.css';
import { Skeleton } from '@mantine/core';
import { app } from '../../../firebase/config/Firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore(app);

interface Video {
  id: string;
  videoUrl: string;
  uploadedBy: string;
  title: string;
  description: string;
  thumbnail: string;
}

const LoopsSections: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to shuffle the array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const loopsRef = collection(db, 'loops');
        const loopsSnapshot = await getDocs(loopsRef);

        if (loopsSnapshot.empty) {
          throw new Error('No videos found.');
        }

        // Shuffle videos after fetching
        const fetchedVideos: Video[] = loopsSnapshot.docs.map((doc) => ({
          id: doc.id,
          videoUrl: doc.data().videoUrl,
          uploadedBy: doc.data().creatorName,
          title: doc.data().title,
          description: doc.data().description,
          thumbnail: doc.data().thumbnail,
        }));
        setVideos(shuffleArray(fetchedVideos));
      } catch (err) {
        setError('Failed to fetch videos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      {loading ? (
        // Render skeletons when data is still being fetched
        <>
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              className={styles.videoWrapper}
              height="100%"
              radius="lg"
            />
          ))}
        </>
      ) : (
        videos.map((video) => (
          <div key={video.id} className={styles.videoWrapper}>
            <video
              className={styles.videoPlayer}
              controls
              autoPlay
              muted
              playsInline
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className={styles.info}>
              <h4>{video.title}</h4>
              <p>{video.uploadedBy}</p>
              <p>{video.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LoopsSections;
