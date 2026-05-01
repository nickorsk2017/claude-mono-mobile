import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthentication } from '@common/hooks';
import { useAuthenticationStore } from '@common/stores/useAuthStore';
import { signInWithEmailAndPassword, signOut } from '@common/services';

const CALM_PRIMARY = '#7c9cf5';

export const DashboardScreen = React.memo(function DashboardScreen() {
  const currentUser = useAuthenticationStore((state) => state.currentUser);
  const authenticationClient = useMemo(
    () => ({
      signIn: signInWithEmailAndPassword,
      signOut,
    }),
    [],
  );

  const { logout, isAuthenticating } = useAuthentication(authenticationClient);
  const handleSignOut = useCallback(() => logout(), [logout]);

  if (!currentUser) return null;

  return (
    <SafeAreaView className="flex-1 bg-calm-background">
      <View className="flex-1 items-center justify-center p-6">
        <View className="bg-calm-surface rounded-3xl w-full max-w-sm p-8 items-center shadow-md">
          <Ionicons
            name="checkmark-circle"
            size={56}
            color={CALM_PRIMARY}
          />
          <Text className="text-2xl font-bold text-calm-text mt-4 mb-2">Hello, World!</Text>
          <Text className="text-base font-medium text-calm-primary mb-2">
            {currentUser.email}
          </Text>
          {currentUser.displayName ? (
            <Text className="text-sm text-calm-muted mb-6">{currentUser.displayName}</Text>
          ) : null}
          <View className="w-full mt-4">
            <Pressable
              className="border border-calm-border rounded-xl py-3 items-center"
              onPress={handleSignOut}
              disabled={isAuthenticating}
            >
              {isAuthenticating
                ? <ActivityIndicator color={CALM_PRIMARY} />
                : <Text className="text-calm-text font-semibold text-base">Sign Out</Text>
              }
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
});
