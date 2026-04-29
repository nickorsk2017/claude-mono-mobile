import React, { useState, useMemo, useCallback, CSSProperties } from 'react';
import { softCalmTheme } from '../../theme';
import { Icon } from '../../atoms/Icon/Icon';

interface TextInputInternalProps extends Entity.TextInputProps {
  trailingElement?: React.ReactElement;
}

export const TextInput = React.memo(function TextInput({
  value,
  onChangeText,
  label,
  placeholder,
  errorMessage,
  isDisabled = false,
  inputType = 'text',
  autoComplete,
  leadingIconName,
  trailingElement,
  className,
}: TextInputInternalProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChangeText(event.target.value),
    [onChangeText],
  );
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const hasError = useMemo(() => Boolean(errorMessage), [errorMessage]);

  const resolvedIconColor = useMemo(() => {
    if (hasError) return softCalmTheme.colors.error;
    if (isFocused) return softCalmTheme.colors.primary;
    return softCalmTheme.colors.textSecondary;
  }, [hasError, isFocused]);

  const containerStyle = useMemo<CSSProperties>(
    () => ({ display: 'flex', flexDirection: 'column', gap: softCalmTheme.spacing.extraSmall, width: '100%' }),
    [],
  );

  const labelStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: softCalmTheme.typography.fontFamily,
      fontSize: softCalmTheme.typography.fontSizes.small,
      fontWeight: softCalmTheme.typography.fontWeights.medium,
      color: hasError ? softCalmTheme.colors.error : softCalmTheme.colors.textSecondary,
    }),
    [hasError],
  );

  const inputRowStyle = useMemo<CSSProperties>(
    () => ({
      display: 'flex',
      alignItems: 'center',
      backgroundColor: isDisabled ? softCalmTheme.colors.background : softCalmTheme.colors.surface,
      borderRadius: softCalmTheme.borderRadius.medium,
      border: `1.5px solid ${hasError ? softCalmTheme.colors.error : isFocused ? softCalmTheme.colors.borderFocus : softCalmTheme.colors.border}`,
      boxShadow: isFocused ? softCalmTheme.shadows.soft : 'none',
      transition: softCalmTheme.transitions.normal,
      padding: `0 ${softCalmTheme.spacing.medium}`,
      minHeight: '48px',
      gap: softCalmTheme.spacing.small,
    }),
    [isDisabled, hasError, isFocused],
  );

  const inputStyle = useMemo<CSSProperties>(
    () => ({
      flex: 1,
      fontFamily: softCalmTheme.typography.fontFamily,
      fontSize: softCalmTheme.typography.fontSizes.body,
      color: softCalmTheme.colors.textPrimary,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      padding: `${softCalmTheme.spacing.small} 0`,
      minWidth: 0,
    }),
    [],
  );

  const errorStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: softCalmTheme.typography.fontFamily,
      fontSize: softCalmTheme.typography.fontSizes.caption,
      color: softCalmTheme.colors.error,
    }),
    [],
  );

  const inputId = useMemo(() => label?.toLowerCase().replace(/\s+/g, '-') ?? undefined, [label]);

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
        </label>
      )}
      <div style={inputRowStyle}>
        {leadingIconName && <Icon name={leadingIconName} size={18} color={resolvedIconColor} />}
        <input
          id={inputId}
          style={inputStyle}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={isDisabled}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError && inputId ? `${inputId}-error` : undefined}
        />
        {trailingElement}
      </div>
      {hasError && (
        <span id={inputId ? `${inputId}-error` : undefined} style={errorStyle} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
});
