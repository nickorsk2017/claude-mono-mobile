import React from 'react';
import { TextInput as NativeTextInput, type KeyboardTypeOptions, type TextInputProps } from 'react-native';

interface MobileTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: TextInputProps['onBlur'];
  placeholder: string;
  placeholderTextColor?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  showSoftInputOnFocus?: boolean;
}

export const TextInput = React.memo(function TextInput({
  value,
  onChangeText,
  onBlur,
  placeholder,
  placeholderTextColor = '#8B90A7',
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  secureTextEntry = false,
  showSoftInputOnFocus = true,
}: MobileTextInputProps) {
  return (
    <NativeTextInput
      className="border border-calm-border bg-calm-surface rounded-xl px-4 py-3 text-calm-text"
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      secureTextEntry={secureTextEntry}
      showSoftInputOnFocus={showSoftInputOnFocus}
    />
  );
});
