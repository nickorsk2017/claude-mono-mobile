import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, ActivityIndicator, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignInForm, type SignInFormRef } from './SignInForm';
import { SignUpForm, type SignUpFormRef } from './SignUpForm';

type AuthMode = 'sign-in' | 'sign-up';

export const AuthScreen = React.memo(function AuthScreen() {
  const [currentMode, setCurrentMode] = useState<AuthMode>('sign-in');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const signInRef = useRef<SignInFormRef>(null);
  const signUpRef = useRef<SignUpFormRef>(null);

  const handleSwitchToSignIn = useCallback(() => {
    setCurrentMode('sign-in');
    setFormError(null);
  }, []);

  const handleSwitchToSignUp = useCallback(() => {
    setCurrentMode('sign-up');
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentMode === 'sign-in') {
      signInRef.current?.submit();
    } else {
      signUpRef.current?.submit();
    }
  }, [currentMode]);

  return (
    <SafeAreaView className="flex-1 bg-calm-surface">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <View style={{ flex: 1 }}>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 40, paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-2xl font-bold text-calm-text tracking-wide">
              {currentMode === 'sign-in' ? 'SIGN IN' : 'SIGN UP'}
            </Text>
            <Text className="text-sm text-calm-muted mt-1">
              {currentMode === 'sign-in' ? 'Sign in to your account' : 'Create a new account'}
            </Text>
            <View className="flex-row items-center gap-4 mt-3 mb-6">
              <Pressable onPress={handleSwitchToSignIn}>
                <Text className={`text-base font-semibold ${currentMode === 'sign-in' ? 'text-calm-primary' : 'text-calm-muted'}`}>
                  Sign In
                </Text>
              </Pressable>
              <Text className="text-calm-muted">|</Text>
              <Pressable onPress={handleSwitchToSignUp}>
                <Text className={`text-base font-semibold ${currentMode === 'sign-up' ? 'text-calm-primary' : 'text-calm-muted'}`}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {currentMode === 'sign-in' ? (
              <SignInForm ref={signInRef} onLoadingChange={setIsSubmitting} onErrorChange={setFormError} />
            ) : (
              <SignUpForm ref={signUpRef} onLoadingChange={setIsSubmitting} onErrorChange={setFormError} />
            )}
            {formError && (
              <View className="bg-calm-error-light rounded-xl p-3 mb-3">
                <Text className="text-calm-error text-sm">{formError}</Text>
              </View>
            )}
          </ScrollView>

          <View className="px-8">
            <Pressable
              className="bg-calm-primary rounded-xl py-4 items-center"
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? <ActivityIndicator color="#ffffff" />
                : <Text className="text-white font-semibold text-base">
                    {currentMode === 'sign-in' ? 'Sign In' : 'Create Account'}
                  </Text>
              }
            </Pressable>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});
