import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const [authId, setAuthId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthId(user.uid);
      } else {
        setAuthId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { authId, loading };
};
