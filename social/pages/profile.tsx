// pages/profile/index.tsx
import React from 'react';
import { Profile } from '@/components';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { authId, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authId) {
    return <div>Please log in to view your profile.</div>;
  }

  return <Profile authId={authId} />;
};

export default ProfilePage;
