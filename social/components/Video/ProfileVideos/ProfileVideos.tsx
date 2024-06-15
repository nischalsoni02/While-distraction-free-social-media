import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../../firebase/config/Firebase';
import styles from './ProfileVideos.module.css';
import { useRouter } from 'next/router';

const db = getFirestore(app);

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    views: number;
    likes: string[];
    Category: string;
}

interface ProfileVideosProps {
    uid: string;
}

const ProfileVideos: React.FC<ProfileVideosProps> = ({ uid }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchVideos = async () => {
            const ref = collection(db, 'users', uid, 'videos');
            const snap = await getDocs(ref);
            const data = snap.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                thumbnail: doc.data().thumbnail,
                videoUrl: doc.data().videoUrl,
                views: doc.data().views,
                likes: doc.data().likes,
                Category: doc.data().category,
            })) as Video[]; // Type assertion
            setVideos(data);
        };

        fetchVideos();
    }, [uid]);


    const handleVideoSelect = (video: Video) => {
        router.push({
          pathname: '/videos',
          query: { id: video.id, category: video.Category }
        });
      };

    return (
        <div className={styles.videoContainer}>
            {videos.map(video => (
                <div key={video.id} className={styles.videoCard} onClick={() => handleVideoSelect({ ...video  })}>
                    <img src={video.thumbnail} alt={video.title} className={styles.thumbnail} />
                    <div className={styles.videoInfo}>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                        <div className={styles.videoStats}>
                            <span>{video.views} views</span>
                            <span>{video.likes.length} likes</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileVideos;
