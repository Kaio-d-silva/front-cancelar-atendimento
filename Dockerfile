# -------------------------------
# Etapa 1: Build da aplicação
# -------------------------------
FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas arquivos essenciais primeiro (para melhor cache)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Gera a build de produção
RUN npm run build

# -------------------------------
# Etapa 2: Servir a aplicação (Nginx)
# -------------------------------
FROM nginx:alpine

# Copia a build gerada na etapa anterior para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o servidor
CMD ["nginx", "-g", "daemon off;"]
