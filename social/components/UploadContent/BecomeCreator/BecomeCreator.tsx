import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../../firebase/config/Firebase';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './BecomeCreator.module.css';
// import UploadSection from '../UploadSection/UploadSection';

const db = getFirestore(app);

const Create = () => {
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const [isContentCreator, setIsContentCreator] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        const { uid } = user;
        const userRef = doc(db, 'users', uid);
        const requestRef = doc(db, 'requests', uid);
        
        const userSnap = await getDoc(userRef);
        const requestSnap = await getDoc(requestRef);

        if (userSnap.exists() && requestSnap.exists()) {
          const userData = userSnap.data();
          const requestData = requestSnap.data();
          setIsContentCreator(userData.isApproved && userData.isContentCreator);
          if (!userData.isApproved && !requestData.isContentCreator) {
            setStatusMessage('');
          } else if (userData.isApproved && !userData.isContentCreator) {
            setStatusMessage('Your application is under review by WHILE.');
          }
        }
      }
    };

    if (!loading) {
      checkUserStatus();
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const { uid } = user;
      const userRef = doc(db, 'users', uid);
      const requestRef = doc(db, 'requests', uid);

      await updateDoc(userRef, { isApproved: true });
      await updateDoc(requestRef, {
        instagramLink: instagramLink,
        youtubeLink: youtubeLink,
        isApproved: true,
        userId: uid,
      });

      setStatusMessage('Your application is under review by WHILE.');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        {!isContentCreator ? (
          statusMessage === "" ? (
            <form onSubmit={handleSubmit}>
              <h1 className={styles.heading}>Become a Creator</h1>
              <input
                className={styles.inputField}
                type="text"
                id="instagram"
                name="instagram"
                placeholder="Instagram Link"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
              />
              <input
                className={styles.inputField}
                type="url"
                id="youtube"
                name="youtube"
                placeholder="YouTube Link"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
              />
              <button type="submit" className={styles.button}>Submit</button>
            </form>
          ) : (
            <p className={styles.para}>{statusMessage}</p>
          )
        ) : (
          <p className={styles.para}>Welcome to our Team</p>
        )}
      </div>
      <div className={styles.imageContainer}>
        <img src="assets/Images/becomeCreator.png" alt="Become Creator" />
      </div>
    </div>
  );
};

export default Create;
