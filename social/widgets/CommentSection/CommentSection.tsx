import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../../firebase/config/Firebase';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import styles from './CommentSection.module.css';
import { IconChevronDown } from '@tabler/icons-react';
import useImageWithFallback from '@/components/Functions/ImageFallbaclFunction';
import CommentModal from './CommentModal';

const db = getFirestore(app);

interface CommentSectionProps {
  videoId: string;
  category: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId, category }) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = React.useState<any[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, `videos/${category}/${category}/${videoId}/comments`);
        const commentsSnapshot = await getDocs(commentsRef);
        const commentsData = commentsSnapshot.docs.map(doc => doc.data());
        
        const commentsWithUserImages = await Promise.all(commentsData.map(async comment => {
          const userDoc = await getDoc(doc(db, 'users', comment.comment));
          return {
            ...comment,
            userImage: userDoc.exists() ? userDoc.data()?.image : null,
          };
        }));

        setComments(commentsWithUserImages);
      } catch (err) {
        console.error('Error fetching comments: ', err);
      }
    };

    fetchComments();
  }, [videoId, category]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, `videos/${category}/${category}/${videoId}/comments`), {
        comment: user?.uid,
        text: newComment,
        timestamp: new Date(),
      });
      setComments([...comments, { comment: user?.uid, text: newComment, timestamp: new Date(), userImage: user?.photoURL }]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment: ', err);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.commentSection}>
      <div className={styles.commentsHeader} onClick={toggleDropdown}>
        <h2 className={styles.commentsHeading}>Comments ({comments.length})</h2>
        <IconChevronDown></IconChevronDown>
      </div>
      {isDropdownOpen && (
        <div className={styles.commentsPreviewList}>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              {comment.userImage && <img src={comment.userImage} alt="User" className={styles.commentUserImage} />}
              <p>{comment.text}</p>
              <span className={styles.commentTimestamp}>{new Date(comment.timestamp.seconds * 1000).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      {isDropdownOpen && (
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.commentInput}
            placeholder="Add a comment..."
          />
          <button type="submit" className={styles.commentButton}>Post</button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
