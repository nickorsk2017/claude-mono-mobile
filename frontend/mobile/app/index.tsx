import { Redirect } from 'expo-router';
import { useAuthenticationStore } from '@common/stores/useAuthStore';

export default function IndexPage() {
  const currentUser = useAuthenticationStore((state) => state.currentUser);
  const isSessionInitialized = useAuthenticationStore((state) => state.isSessionInitialized);

  if (!isSessionInitialized) return null;

  return <Redirect href={currentUser ? '/dashboard' : '/auth'} />;
}
