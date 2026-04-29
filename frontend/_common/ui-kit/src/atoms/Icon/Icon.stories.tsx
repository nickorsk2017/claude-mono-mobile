import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { softCalmTheme } from '../../theme';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    name: {
      control: 'select',
      options: ['mail', 'lock', 'eye', 'eye-off', 'google', 'user', 'check', 'arrow-left'],
    },
    color: { control: 'color' },
    size: { control: { type: 'range', min: 12, max: 64, step: 4 } },
  },
};

export default meta;
type IconStory = StoryObj<typeof Icon>;

export const Mail: IconStory = { args: { name: 'mail', size: 24 } };
export const Lock: IconStory = { args: { name: 'lock', size: 24 } };
export const Eye: IconStory = { args: { name: 'eye', size: 24 } };
export const EyeOff: IconStory = { args: { name: 'eye-off', size: 24 } };
export const Google: IconStory = { args: { name: 'google', size: 24 } };
export const User: IconStory = { args: { name: 'user', size: 24 } };
export const Check: IconStory = { args: { name: 'check', size: 24 } };

export const Colored: IconStory = {
  args: { name: 'mail', size: 24, color: softCalmTheme.colors.primary },
};

export const LargeIcon: IconStory = {
  args: { name: 'user', size: 48, color: softCalmTheme.colors.primary },
};

export const AllIcons: IconStory = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '16px' }}>
      {(['mail', 'lock', 'eye', 'eye-off', 'google', 'user', 'check', 'arrow-left'] as const).map(
        (iconName) => (
          <div
            key={iconName}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
          >
            <Icon name={iconName} size={24} color={softCalmTheme.colors.primary} />
            <span style={{ fontSize: '11px', color: softCalmTheme.colors.textSecondary }}>
              {iconName}
            </span>
          </div>
        ),
      )}
    </div>
  ),
};
