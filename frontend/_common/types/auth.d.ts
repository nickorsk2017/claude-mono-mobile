export {};

declare global {
  namespace Entity {
    interface SignInFormValues {
      emailAddress: string;
      password: string;
    }

    interface SignUpFormValues {
      emailAddress: string;
      password: string;
      confirmPassword: string;
      displayName: string;
    }

    interface AuthValidationErrors {
      emailAddress?: string;
      password?: string;
      confirmPassword?: string;
      displayName?: string;
    }
  }
}
