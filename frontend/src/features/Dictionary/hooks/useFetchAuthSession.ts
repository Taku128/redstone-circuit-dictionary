// hooks/useFetchAuthSession.ts

import { fetchAuthSession } from 'aws-amplify/auth';

const useFetchAuthSession = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens;
  } catch (error) {
    console.error('Failed to fetch auth session', error);
    throw new Error('Failed to fetch auth session');
  }
};

export default useFetchAuthSession;
