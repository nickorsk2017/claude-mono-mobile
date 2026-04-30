import React from 'react';
import { ComponentSize } from '../../../../../_common/themes/calm-theme';
import { cx } from '@common/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  size?: ComponentSize;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
};

export const Button = React.memo(function Button({
  children,
  onClick,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  isLoading = false,
  className,
}: ButtonProps) {
  const sizeClassMap: Record<ComponentSize, string> = {
    small: 'min-h-[34px] px-3.5 py-2 text-label rounded-[10px]',
    medium: 'min-h-[42px] px-[18px] py-3 text-body rounded-[12px]',
    large: 'min-h-[48px] px-[22px] py-3.5 text-medium rounded-[14px]',
  };

  const variantClassMap: Record<ButtonVariant, string> = {
    primary: 'bg-calm-primary border-calm-primary text-calm-primary-text',
    secondary: 'bg-calm-background border-calm-background text-calm-text',
    outline: 'bg-transparent border-calm-border text-calm-text',
    ghost: 'bg-transparent border-transparent text-calm-muted',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cx(
        'w-full border font-semibold transition-all duration-150',
        sizeClassMap[size],
        variantClassMap[variant],
        className,
        disabled || isLoading ? 'cursor-not-allowed opacity-50' : '!cursor-pointer hover:brightness-95',
      )}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
});

export default Button;
