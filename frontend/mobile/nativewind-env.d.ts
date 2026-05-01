/// <reference types="nativewind/types" />

export {};

declare module '*.css' {
  const content: never;
  export default content;
}

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface FlatListProps<ItemT> {
    className?: string;
  }
}