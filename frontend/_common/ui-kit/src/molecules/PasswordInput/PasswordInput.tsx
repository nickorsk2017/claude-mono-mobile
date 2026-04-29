import React, { useState, useMemo, useCallback, CSSProperties } from 'react';
import { softCalmTheme } from '../../theme';
import { TextInput } from '../TextInput/TextInput';
import { Icon } from '../../atoms/Icon/Icon';

export const PasswordInput = React.memo(function PasswordInput({
  value,
  onChangeText,
  label = 'Password',
  placeholder = '••••••••',
  errorMessage,
  isDisabled = false,
  className,
}: Entity.PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((previousVisibility) => !previousVisibility);
  }, []);

  const toggleButtonStyle = useMemo<CSSProperties>(
    () => ({
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: softCalmTheme.spacing.extraSmall,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: softCalmTheme.colors.textSecondary,
      flexShrink: 0,
      borderRadius: softCalmTheme.borderRadius.small,
    }),
    [],
  );

  const resolvedIconName = useMemo<Entity.IconName>(
    () => (isPasswordVisible ? 'eye-off' : 'eye'),
    [isPasswordVisible],
  );

  const visibilityToggle = useMemo(
    () => (
      <button
        style={toggleButtonStyle}
        onClick={togglePasswordVisibility}
        type="button"
        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        <Icon
          name={resolvedIconName}
          size={18}
          color={softCalmTheme.colors.textSecondary}
        />
      </button>
    ),
    [toggleButtonStyle, togglePasswordVisibility, isPasswordVisible, resolvedIconName],
  );

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      label={label}
      placeholder={placeholder}
      errorMessage={errorMessage}
      isDisabled={isDisabled}
      inputType={isPasswordVisible ? 'text' : 'password'}
      autoComplete="current-password"
      leadingIconName="lock"
      trailingElement={visibilityToggle}
      className={className}
    />
  );
});
