# Usando uma imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos do projeto
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Expôr a porta da API
EXPOSE 5002

# Comando para iniciar a aplicação
CMD ["npm", "start"]
