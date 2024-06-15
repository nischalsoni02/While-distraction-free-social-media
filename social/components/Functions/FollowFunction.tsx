import { getFirestore, doc, collection, setDoc } from 'firebase/firestore';
import { app } from '../../firebase/config/Firebase';

const db = getFirestore(app);

export const followUser = async (firstUid, secondUid) => {
  try {
    const firstUserFollowingRef = doc(collection(db, 'users', firstUid, 'following'), secondUid);
    const secondUserFollowersRef = doc(collection(db, 'users', secondUid, 'follower'), firstUid);

    // Add secondUid to the following collection of firstUid
    await setDoc(firstUserFollowingRef, {
      uid: secondUid,
      followedAt: new Date()
    });

    // Add firstUid to the followers collection of secondUid
    await setDoc(secondUserFollowersRef, {
      uid: firstUid,
      followedAt: new Date()
    });

    console.log(`User ${firstUid} is now following ${secondUid}`);
  } catch (error) {
    console.error('Error following user: ', error);
  }
};
