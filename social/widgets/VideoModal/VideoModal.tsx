import React, { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../firebase/config/Firebase';
import styles from './VideoModal.module.css';

const db = getFirestore(app);

const VideoModal = ({ videoId, onClose }) => {
    const [user] = useAuthState(auth);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideoUrl = async () => {
            if (user) {
                const videoRef = doc(db, `users/${user.uid}/videos`, videoId);
                const videoSnap = await getDoc(videoRef);
                if (videoSnap.exists()) {
                    setVideoUrl(videoSnap.data().videoUrl);
                } else {
                    console.error('Video not found');
                }
                setLoading(false);
            }
        };

        fetchVideoUrl();
    }, [user, videoId]);

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <video controls autoPlay className={styles.videoPlayer}>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
        </div>
    );
};

export default VideoModal;
