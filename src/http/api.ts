import axios, {
    AxiosInstance,
    AxiosResponse,
  } from 'axios';
  
  // Cria uma instância do axios
  const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:30000/api/', 
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
        const { status } = error.response;
  
        if (status >= 400) {
          return Promise.reject(
            new Error(
              JSON.stringify({
                status,
                message: error.response.data?.message || 'Erro desconhecido.',
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