import React from 'react';
import styles from './CommentModal.module.css';

interface CommentModalProps {
  comments: any[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleCommentSubmit: (e: React.FormEvent) => void;
  handleCloseModal: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ comments, newComment, setNewComment, handleCommentSubmit, handleCloseModal }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleCloseModal}>X</button>
        <h2 className={styles.commentsHeading}>Comments</h2>
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
        <div className={styles.commentsList}>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              {comment.userImage && <img src={comment.userImage} alt="User" className={styles.commentUserImage} />}
              <p>{comment.text}</p>
              <span className={styles.commentTimestamp}>{new Date(comment.timestamp.seconds * 1000).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
