import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthenticationStore } from '@common/stores/useAuthStore';
import { getActiveSession } from '@common/services';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const setCurrentUser = useAuthenticationStore((state) => state.setCurrentUser);
  const markSessionInitialized = useAuthenticationStore((state) => state.markSessionInitialized);
  const currentUser = useAuthenticationStore((state) => state.currentUser);
  const isSessionInitialized = useAuthenticationStore((state) => state.isSessionInitialized);

  useEffect(() => {
    const initializeSession = async () => {
      const sessionResponse = await getActiveSession();
      if (sessionResponse.success && sessionResponse.data) {
        setCurrentUser(sessionResponse.data.user);
      }
      markSessionInitialized();
    };
    void initializeSession();
  }, [setCurrentUser, markSessionInitialized]);

  useEffect(() => {
    if (!isSessionInitialized) return;
    const onAuthScreen = segments[0] === 'auth';
    if (!currentUser && !onAuthScreen) {
      router.replace('/auth');
    } else if (currentUser && onAuthScreen) {
      router.replace('/dashboard');
    }
  }, [currentUser, isSessionInitialized, segments, router]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
