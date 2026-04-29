import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type ButtonStory = StoryObj<typeof Button>;

export const Primary: ButtonStory = {
  args: {
    label: 'Sign In',
    onPress: () => undefined,
    variant: 'primary',
    size: 'medium',
  },
};

export const Secondary: ButtonStory = {
  args: {
    label: 'Create Account',
    onPress: () => undefined,
    variant: 'secondary',
    size: 'medium',
  },
};

export const Outline: ButtonStory = {
  args: {
    label: 'Continue with Google',
    onPress: () => undefined,
    variant: 'outline',
    size: 'medium',
  },
};

export const Ghost: ButtonStory = {
  args: {
    label: 'Cancel',
    onPress: () => undefined,
    variant: 'ghost',
    size: 'medium',
  },
};

export const Loading: ButtonStory = {
  args: {
    label: 'Sign In',
    onPress: () => undefined,
    variant: 'primary',
    isLoading: true,
  },
};

export const Disabled: ButtonStory = {
  args: {
    label: 'Sign In',
    onPress: () => undefined,
    variant: 'primary',
    isDisabled: true,
  },
};

export const SmallSize: ButtonStory = {
  args: {
    label: 'Dismiss',
    onPress: () => undefined,
    variant: 'ghost',
    size: 'small',
  },
};

export const LargeSize: ButtonStory = {
  args: {
    label: 'Get Started',
    onPress: () => undefined,
    variant: 'primary',
    size: 'large',
  },
};
