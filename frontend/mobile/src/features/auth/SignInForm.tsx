import React, { useCallback, useEffect, useImperativeHandle, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthentication } from '@common/hooks';
import { signInWithEmailAndPassword, signOut } from '@common/services';
import { signInValidationSchema } from '@common/schemas/auth.zod';
import { TextInput } from '../../ui-kit/TextInput';

interface SignInFormValues {
  emailAddress: string;
  password: string;
}

export interface SignInFormRef {
  submit: () => void;
}

interface SignInFormProps {
  onLoadingChange: (isLoading: boolean) => void;
  onErrorChange: (error: string | null) => void;
}

const defaultValues: SignInFormValues = { emailAddress: '', password: '' };

export const SignInForm = React.memo(
  React.forwardRef<SignInFormRef, SignInFormProps>(function SignInForm(
    { onLoadingChange = () => undefined, onErrorChange = () => undefined },
    ref,
  ) {
    const { control, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
      resolver: zodResolver(signInValidationSchema),
      defaultValues,
    });

    const authenticationClient = useMemo(
      () => ({ signIn: signInWithEmailAndPassword, signOut }),
      [],
    );

    const { login, isAuthenticating, authenticationError } = useAuthentication(authenticationClient);

    useEffect(() => { onLoadingChange(isAuthenticating); }, [isAuthenticating, onLoadingChange]);
    useEffect(() => { onErrorChange(authenticationError); }, [authenticationError, onErrorChange]);

    const handleSignIn = useCallback(
      handleSubmit(async (values) => {
        await login({ email: values.emailAddress, password: values.password });
      }),
      [handleSubmit, login],
    );

    useImperativeHandle(ref, () => ({ submit: handleSignIn }), [handleSignIn]);

    return (
      <View>
        <View className="mb-4">
          <Text className="text-sm font-medium text-calm-text mb-1">Email</Text>
          <Controller
            control={control}
            name="emailAddress"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Your e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                showSoftInputOnFocus
              />
            )}
          />
          {errors.emailAddress ? (
            <Text className="text-calm-error text-xs mt-1">{errors.emailAddress.message}</Text>
          ) : null}
        </View>

        <View className="mb-2">
          <Text className="text-sm font-medium text-calm-text mb-1">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
                secureTextEntry
              />
            )}
          />
          {errors.password ? (
            <Text className="text-calm-error text-xs mt-1">{errors.password.message}</Text>
          ) : null}
        </View>
      </View>
    );
  }),
);
