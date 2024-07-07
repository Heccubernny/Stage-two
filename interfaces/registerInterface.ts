export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
