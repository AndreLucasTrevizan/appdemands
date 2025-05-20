import { AxiosError } from "axios";

export default class ErrorHandler {
  error = {
    message: '',
  };

  constructor(error: Error | AxiosError | unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status == 500) {
        this.error = {
          message: 'Nossos serviços podem estar indisponívels no momento, tente novamente mais tarde...',
        }
      } else if (error.response?.status != 400) {
        this.error = {
          message: error.response?.data.message,
        }
      } else {
        this.error = {
          message: error.response?.data.message,
        };
      }
    } else if (error instanceof Error) {
      this.error = {
        message: error.message
      };
    }
  }
}