import { AxiosError } from "axios";

export class ErrorHandler {
  error = {
    message: '',
  };

  constructor(error: Error | AxiosError | unknown) {
    if (error instanceof AxiosError) {
      this.error = {
        message: error.response?.data.message,
      };
    } else if (error instanceof Error) {
      this.error = {
        message: error.message
      };
    }
  }
}