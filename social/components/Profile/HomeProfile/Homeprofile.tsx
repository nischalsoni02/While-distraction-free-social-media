import { Card, Avatar, Text, Group, Button, Skeleton } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../../firebase/config/Firebase';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import classes from './HomeProfile.module.css';

const db = getFirestore(app);

const HomeProfile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    about: '',
    image: '',
    posts: 0,
    followers: 0,
    following: 0,
    designation: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const followersQuery = await getDocs(collection(userDocRef, 'follower'));
            const followersCount = followersQuery.size;

            const followingQuery = await getDocs(collection(userDocRef, 'following'));
            const followingCount = followingQuery.size;

            const videosQuery = await getDocs(collection(userDocRef, 'videos'));
            const videosCount = videosQuery.size;

            const loopsQuery = await getDocs(collection(userDocRef, 'loops'));
            const loopsCount = loopsQuery.size;

            setProfileData({
              name: data.name || '',
              about: data.about || '',
              image: data.image || '',
              posts: videosCount + loopsCount,
              followers: followersCount,
              following: followingCount,
              designation: data.designation || '',
            });
          }
        } catch (e) {
          console.error('Error fetching profile data:', e);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  const stats = [
    { value: profileData.followers, label: 'Followers' },
    { value: profileData.following, label: 'Follows' },
    { value: profileData.posts, label: 'Posts' },
  ];

  const items = stats.map((stat) => (
    <div key={stat.label}>
      {isLoadingProfile ? (
        <Skeleton height={15} width={50} radius="sm" />
      ) : (
        <Text ta="center" size="lg" fw={500}>
          {stat.value}
        </Text>
      )}
      <Text ta="center" size="sm" color="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section
        style={{
          backgroundImage: 'url(assets/Images/logo1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '140px',
        }}
      />
      {isLoadingProfile ? (
        <Skeleton circle height={80} mx="auto" mt={-30} className={classes.avatar} />
      ) : (
        <Avatar
          src={profileData.image || 'https://via.placeholder.com/80'}
          size={80}
          radius={80}
          mx="auto"
          mt={-30}
          className={classes.avatar}
        />
      )}
      {isLoadingProfile ? (
        <Skeleton height={16} width={100} radius="sm" mt="sm" mx="auto" />
      ) : (
        <Text ta="center" size="lg" fw={500} mt="sm">
          {profileData.name || 'Anonymous'}
        </Text>
      )}
      {isLoadingProfile ? (
        <Skeleton height={10} width={150} radius="sm" mt="xs" mx="auto" />
      ) : (
        <Text ta="center" size="sm" color="dimmed">
          {profileData.about || 'No bio available'}
        </Text>
      )}
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      {isLoadingProfile ? (
        <Skeleton height={16} width={80} radius="sm" mt="xl" mx="auto" />
      ) : (
        <Button fullWidth radius="md" mt="xl" size="md" variant="default">
          {profileData.designation || 'Member'}
        </Button>
      )}
    </Card>
  );
};

export default HomeProfile;
