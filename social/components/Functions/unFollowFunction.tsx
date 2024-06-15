import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebase/config/Firebase';

const db = getFirestore(app);

export const unfollowUser = async (firstUid, secondUid) => {
  try {
    const firstUserFollowingRef = doc(db, 'users', firstUid, 'following', secondUid);
    const secondUserFollowersRef = doc(db, 'users', secondUid, 'follower', firstUid);

    // Remove secondUid from the following collection of firstUid
    await deleteDoc(firstUserFollowingRef);

    // Remove firstUid from the followers collection of secondUid
    await deleteDoc(secondUserFollowersRef);

    console.log(`User ${firstUid} has unfollowed ${secondUid}`);
  } catch (error) {
    console.error('Error unfollowing user: ', error);
  }
};
