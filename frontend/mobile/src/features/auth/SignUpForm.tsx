import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@common/hooks';
import { signUpWithEmailAndPassword } from '@common/services';
import { signUpValidationSchema } from '@common/schemas/auth.zod';
import { TextInput } from '../../ui-kit/TextInput';

interface SignUpFormValues {
  displayName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpFormRef {
  submit: () => void;
}

interface SignUpFormProps {
  onLoadingChange: (isLoading: boolean) => void;
  onErrorChange: (error: string | null) => void;
}

const defaultValues: SignUpFormValues = {
  displayName: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
};

const FIELDS = [
  { name: 'displayName' as const, label: 'Display Name', placeholder: 'Your name', keyboardType: 'default' as const },
  { name: 'emailAddress' as const, label: 'Email', placeholder: 'Your e-mail', keyboardType: 'email-address' as const },
  { name: 'password' as const, label: 'Password', placeholder: 'Password', secureTextEntry: true, keyboardType: 'default' as const },
  { name: 'confirmPassword' as const, label: 'Confirm Password', placeholder: 'Confirm password', secureTextEntry: true, keyboardType: 'default' as const },
];

export const SignUpForm = React.memo(
  React.forwardRef<SignUpFormRef, SignUpFormProps>(function SignUpForm(
    { onLoadingChange = () => undefined, onErrorChange = () => undefined },
    ref,
  ) {
    const [isSigningUp, setIsSigningUp] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
      resolver: zodResolver(signUpValidationSchema),
      defaultValues,
    });

    const signUpServiceClient = useMemo(() => ({ signUp: signUpWithEmailAndPassword }), []);
    const { signUp } = useSignUp(signUpServiceClient);

    useEffect(() => { onLoadingChange(isSigningUp); }, [isSigningUp, onLoadingChange]);

    const handleSignUp = useCallback(
      handleSubmit(async (values) => {
        setIsSigningUp(true);
        onErrorChange(null);
        const response = await signUp(values);
        if (!response.success) {
          onErrorChange(response.error ?? 'Sign-up failed.');
        }
        setIsSigningUp(false);
      }),
      [handleSubmit, signUp, onErrorChange],
    );

    useImperativeHandle(ref, () => ({ submit: handleSignUp }), [handleSignUp]);

    return (
      <View>
        {FIELDS.map((field) => (
          <View key={field.name} className="mb-4">
            <Text className="text-sm font-medium text-calm-text mb-1">{field.label}</Text>
            <Controller
              control={control}
              name={field.name}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={field.placeholder}
                  secureTextEntry={field.secureTextEntry}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.keyboardType === 'email-address' ? 'none' : 'words'}
                  autoCorrect={false}
                  showSoftInputOnFocus
                />
              )}
            />
            {errors[field.name] ? (
              <Text className="text-calm-error text-xs mt-1">{errors[field.name]?.message}</Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  }),
);
