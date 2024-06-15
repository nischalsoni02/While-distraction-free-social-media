import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, setDoc, getDocs, query, orderBy, onSnapshot, doc, getFirestore, getDoc } from 'firebase/firestore';
import { MessageList, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { auth, app } from '../../firebase/config/Firebase';
import styles from './MessagingSection.module.css';

const db = getFirestore(app);

declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function (): number {
  let hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

interface User {
  id: string;
  name: string;
  image: string;
  is_online: boolean;
}

interface Message {
  id: string;
  fromId: string;
  toId: string;
  msg: string;
  read: string;
  sent: string;
  type: string;
}

const Chat: React.FC = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    const usersRef = collection(db, 'users', user!.uid, 'my_users');
    const usersSnapshot = await getDocs(usersRef);
    const usersList = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
      const userDetailsRef = doc(db, 'users', userDoc.id);
      const userDetailsSnap = await getDoc(userDetailsRef);
      return {
        id: userDoc.id,
        ...userDetailsSnap.data()
      } as User;
    }));
    setUsers(usersList);
    console.log('Fetched users:', usersList);
  };

  const fetchMessages = async (selectedUser: User) => {
    const conversationId = getConversationID(user!.uid, selectedUser.id);
    console.log('Fetching messages for conversation ID:', conversationId);

    const messagesRef = collection(db, 'chats', conversationId, 'messages');
    const q = query(messagesRef, orderBy('sent', 'asc'));
    onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesList);
      console.log('Fetched messages:', messagesList);
    });
  };

  const getConversationID = (id1: string, id2: string) => {
    return id1.hashCode() <= id2.hashCode() ? `${id1}_${id2}` : `${id2}_${id1}`;
  };

  const sendMessage = async () => {
    if (!selectedUser) return;
    const timestamp = Date.now().toString();
    const messageData: Message = {
      id: timestamp,
      fromId: user!.uid,
      toId: selectedUser.id,
      msg: messageText,
      read: '',
      sent: timestamp,
      type: 'text'
    };

    const conversationId = getConversationID(user!.uid, selectedUser.id);
    console.log('Sending message:', messageData);
    console.log('Storing message under conversation ID:', conversationId);

    await setDoc(doc(db, 'chats', conversationId, 'messages', timestamp), messageData);

    setMessageText('');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatInner}>
        <div className={styles.userList}>
          <h4 className={styles.chatListHeader}>Chats</h4>
          {users.map((user) => (
            <div key={user.id} className={styles.userItem} onClick={() => setSelectedUser(user)}>
              <img src={user.image} alt={user.name} className={styles.userImage} />
              <p className={styles.userName}>{user.name}</p>
            </div>
          ))}
        </div>
        <div className={styles.chatBox}>
          {selectedUser ? (
            <>
              <h6 className={styles.chatHeader}>{selectedUser.name}</h6>
              <MessageList
                className='message-list'
                lockable={true}
                toBottomHeight={'100%'}
                referance={messageListRef}
                dataSource={messages.map(message => ({
                  position: message.fromId === user!.uid ? 'right' : 'left',
                  type: 'text',
                  text: message.msg,
                  date: new Date(Number(message.sent)),
                  id: message.id,
                  title: '',
                  focus: false,
                  titleColor: '',
                  subtitle: '',
                  replyButton: false,
                  status: 'waiting',
                  forwarded: false,
                  removeButton: false,
                  notch: false,
                  retracted: false
                }))}
              />
              <Input
                placeholder="Type here..."
                multiline={true}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rightButtons={
                  <Button text='Send' onClick={sendMessage} />
                }
                maxHeight={100}
              />
            </>
          ) : (
            <div className={styles.selectUserPrompt}>Select a user to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
