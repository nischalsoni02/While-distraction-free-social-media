// Layout.tsx
import React, { ReactElement, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config/Firebase';
import Auth from '../Auth';
import Header from '../Header/Header';

interface LayoutProps {
  children: ReactElement[] | ReactElement | string;
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;  // Display a loading indicator while checking user authentication
  }

  if (error) {
    return <div>Error: {error.message}</div>;  // Display an error message if there is an issue
  }

  return (
    <>
      {user ? (
        <>
          <Header />
          <main>{children}</main>
        </>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default Layout;
