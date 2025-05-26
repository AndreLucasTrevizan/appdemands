import { AxiosError } from "axios";

export default class ErrorHandler {
  message: string;

  constructor(error: Error | AxiosError | unknown) {
    if (error instanceof AxiosError) {
      if (error.code == 'ECONNREFUSED') {
        this.message = 'Nossos serviços podem estar indisponívels no momento, tente novamente mais tarde...';
      
        return { message: this.message };
      } else if (error.response?.status == 500) {
        this.message = 'Nossos serviços podem estar indisponívels no momento, tente novamente mais tarde...';
      
        return { message: this.message };
      } else if (error.response?.status == 400) {
        this.message = error.response?.data.message;
      
        return { message: this.message };
      } else if (error.response?.status == 401) {
        this.message = error.response?.data.message;
      
        return { message: this.message };
      } else {
        this.message = error.response?.data.message;

        return { message: this.message };
      }
    } else if (error instanceof Error) {
      this.message = error.message;

      return { message: this.message };
    } else {
      this.message = 'Erro desconhecido, entre em contato com a T.I';

      return { message: this.message };
    }
  }
}