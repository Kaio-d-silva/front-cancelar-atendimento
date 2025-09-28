import axios, {
    AxiosInstance,
    AxiosResponse,
  } from 'axios';

interface ApiError {
    status: number;
    message: string;
  }

  // Cria uma instância do axios
  const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/', 
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Interceptador de resposta
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {

      if (error.response) {
        const { status, data } = error.response;

        if(status > 400 || status < 405){
          const errorBadRequest = new Error(data.error);
          (errorBadRequest as unknown as ApiError).status = data.status
          return Promise.reject(errorBadRequest)
        }

  
        if (status > 404) {
          return Promise.reject(
            new Error(
              JSON.stringify({
                status,
                message: error.response.data?.error || 'Erro desconhecido.',
              }),
            ),
          );
        }
      }
  
      // Lida com erros sem resposta (ex.: problemas de rede)
      return Promise.reject(
        new Error(
          JSON.stringify({
            status: 0,
            message: 'Erro de conexão.',
          }),
        ),
      );
    },
  );
  
  export default api;