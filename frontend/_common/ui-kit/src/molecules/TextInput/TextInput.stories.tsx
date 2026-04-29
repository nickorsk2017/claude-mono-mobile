import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Molecules/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type TextInputStory = StoryObj<typeof TextInput>;

export const Default: TextInputStory = {
  render: () => {
    const [currentValue, setCurrentValue] = useState('');
    return (
      <TextInput
        value={currentValue}
        onChangeText={setCurrentValue}
        label="Email"
        placeholder="you@example.com"
        leadingIconName="mail"
        inputType="email"
        autoComplete="email"
      />
    );
  },
};

export const WithError: TextInputStory = {
  render: () => {
    const [currentValue, setCurrentValue] = useState('invalid');
    return (
      <TextInput
        value={currentValue}
        onChangeText={setCurrentValue}
        label="Email"
        placeholder="you@example.com"
        leadingIconName="mail"
        inputType="email"
        errorMessage="Please enter a valid email address"
      />
    );
  },
};

export const Disabled: TextInputStory = {
  render: () => (
    <TextInput
      value="locked@example.com"
      onChangeText={() => undefined}
      label="Email"
      leadingIconName="mail"
      isDisabled
    />
  ),
};

export const WithoutIcon: TextInputStory = {
  render: () => {
    const [currentValue, setCurrentValue] = useState('');
    return (
      <TextInput
        value={currentValue}
        onChangeText={setCurrentValue}
        label="Display Name"
        placeholder="Your name"
      />
    );
  },
};

export const MobileViewport: TextInputStory = {
  parameters: { viewport: { defaultViewport: 'mobileMedium' } },
  render: () => {
    const [currentValue, setCurrentValue] = useState('');
    return (
      <div style={{ padding: '16px' }}>
        <TextInput
          value={currentValue}
          onChangeText={setCurrentValue}
          label="Email"
          placeholder="you@example.com"
          leadingIconName="mail"
          inputType="email"
        />
      </div>
    );
  },
};
