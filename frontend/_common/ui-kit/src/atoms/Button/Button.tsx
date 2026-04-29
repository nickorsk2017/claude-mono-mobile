import React, { useMemo, useCallback, CSSProperties } from 'react';
import { softCalmTheme } from '../../theme';

function resolveBackgroundColor(variant: Entity.ButtonVariant): string {
  if (variant === 'primary') return softCalmTheme.colors.primary;
  if (variant === 'secondary') return softCalmTheme.colors.secondary;
  return 'transparent';
}

function resolveTextColor(variant: Entity.ButtonVariant): string {
  if (variant === 'primary') return '#FFFFFF';
  if (variant === 'secondary') return softCalmTheme.colors.textPrimary;
  return softCalmTheme.colors.primary;
}

function resolvePadding(size: Entity.ButtonSize): string {
  const paddingMap: Record<Entity.ButtonSize, string> = {
    small: `${softCalmTheme.spacing.extraSmall} ${softCalmTheme.spacing.medium}`,
    medium: `${softCalmTheme.spacing.small} ${softCalmTheme.spacing.large}`,
    large: `${softCalmTheme.spacing.medium} ${softCalmTheme.spacing.extraLarge}`,
  };
  return paddingMap[size];
}

function resolveFontSize(size: Entity.ButtonSize): string {
  const fontSizeMap: Record<Entity.ButtonSize, string> = {
    small: softCalmTheme.typography.fontSizes.small,
    medium: softCalmTheme.typography.fontSizes.body,
    large: softCalmTheme.typography.fontSizes.medium,
  };
  return fontSizeMap[size];
}

export const Button = React.memo(function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  isDisabled = false,
  isLoading = false,
  className,
}: Entity.ButtonProps) {
  const handleClick = useCallback(() => {
    if (!isDisabled && !isLoading) onPress();
  }, [onPress, isDisabled, isLoading]);

  const buttonStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: softCalmTheme.typography.fontFamily,
      fontSize: resolveFontSize(size),
      fontWeight: softCalmTheme.typography.fontWeights.semiBold,
      backgroundColor: resolveBackgroundColor(variant),
      color: resolveTextColor(variant),
      padding: resolvePadding(size),
      borderRadius: softCalmTheme.borderRadius.medium,
      border:
        variant === 'outline'
          ? `1.5px solid ${softCalmTheme.colors.primary}`
          : 'none',
      cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: isDisabled || isLoading ? 0.6 : 1,
      boxShadow: variant === 'primary' ? softCalmTheme.shadows.soft : 'none',
      transition: softCalmTheme.transitions.normal,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '44px',
      userSelect: 'none' as const,
    }),
    [variant, size, isDisabled, isLoading],
  );

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      disabled={isDisabled || isLoading}
      className={className}
      type="button"
      aria-busy={isLoading}
      aria-disabled={isDisabled}
    >
      {isLoading ? 'Loading…' : label}
    </button>
  );
});
