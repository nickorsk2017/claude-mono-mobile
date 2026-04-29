export {};

declare global {
  namespace Entity {
    type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
    type ButtonSize = 'small' | 'medium' | 'large';
    type IconName =
      | 'mail'
      | 'lock'
      | 'eye'
      | 'eye-off'
      | 'google'
      | 'user'
      | 'check'
      | 'arrow-left';

    interface ButtonProps {
      label: string;
      onPress: () => void;
      variant?: ButtonVariant;
      size?: ButtonSize;
      isDisabled?: boolean;
      isLoading?: boolean;
      className?: string;
    }

    interface IconProps {
      name: IconName;
      size?: number;
      color?: string;
      className?: string;
    }

    interface TextInputProps {
      value: string;
      onChangeText: (value: string) => void;
      label?: string;
      placeholder?: string;
      errorMessage?: string;
      isDisabled?: boolean;
      inputType?: string;
      autoComplete?: string;
      leadingIconName?: IconName;
      className?: string;
    }

    interface PasswordInputProps {
      value: string;
      onChangeText: (value: string) => void;
      label?: string;
      placeholder?: string;
      errorMessage?: string;
      isDisabled?: boolean;
      className?: string;
    }
  }
}
