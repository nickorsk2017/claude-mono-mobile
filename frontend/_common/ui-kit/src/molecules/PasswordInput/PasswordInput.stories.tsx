import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PasswordInput } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Molecules/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type PasswordInputStory = StoryObj<typeof PasswordInput>;

export const Default: PasswordInputStory = {
  render: () => {
    const [currentValue, setCurrentValue] = useState('');
    return (
      <PasswordInput
        value={currentValue}
        onChangeText={setCurrentValue}
        label="Password"
        placeholder="Enter your password"
      />
    );
  },
};

export const WithError: PasswordInputStory = {
  render: () => {
    const [currentValue, setCurrentValue] = useState('weak');
    return (
      <PasswordInput
        value={currentValue}
        onChangeText={setCurrentValue}
        label="Password"
        errorMessage="Password must be at least 8 characters"
      />
    );
  },
};

export const Disabled: PasswordInputStory = {
  render: () => (
    <PasswordInput
      value="supersecret"
      onChangeText={() => undefined}
      label="Password"
      isDisabled
    />
  ),
};

export const ConfirmPassword: PasswordInputStory = {
  render: () => {
    const [currentValue, setCurrentValue] = useState('');
    return (
      <PasswordInput
        value={currentValue}
        onChangeText={setCurrentValue}
        label="Confirm Password"
        placeholder="Re-enter your password"
        errorMessage={currentValue && currentValue !== 'match' ? 'Passwords do not match' : undefined}
      />
    );
  },
};

export const MobileViewport: PasswordInputStory = {
  parameters: { viewport: { defaultViewport: 'mobileMedium' } },
  render: () => {
    const [currentValue, setCurrentValue] = useState('');
    return (
      <div style={{ padding: '16px' }}>
        <PasswordInput
          value={currentValue}
          onChangeText={setCurrentValue}
          label="Password"
        />
      </div>
    );
  },
};
