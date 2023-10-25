# Pharmacy Central System API

O Pharmacy Central System API é uma excelente solução para gerenciamento de usuários, medicamentos e vendas.

## Descrição do Projeto

O Pharmacy Central System API é uma API desenvolvida em JavaScript usando o framework Express.js que permite e gerenciamento de usuários, medicamentos e vendas. Os dados são armazenados em um banco de dados relacional com o SGBD PostgreSQL e o ORM Sequelize para facilitar o acesso e manipulação dos dados no banco.

## Como executar em modo de desenvolvimento

1. Faça o download ou clone do repositório através do GitHub;
2. Dentro da pasta raiz do repositório, execute o comando `npm i` para instalar todas as dependências necessárias;
3. Crie o arquivo .env na pasta raiz do projeto e certifique-se declarar as variáveis de ambiente corretamente;
4. Execute o comando `npm run start:swagger` dentro da pasta do projeto para gerar o arquivo do Swagger;
5. Após instalar as dependências, configurar as variáveis de ambiente e gerar o arquivo do Swagger, você pode executar a aplicação em modo de desenvolvimento usando o comando `npm run start:dev` dentro da mesma pasta;
6. A API estará disponível em http://localhost:3333. Utilize os endpoints abaixo para fazer requisições à API.

## Como acessar a API em produção

1. Acesse

## Endpoints

- Todos os endpoints são privados (exigem token jwt) com exceção do cadastro de usuário comprador e login de comprador e administrador (gera o token).
- Certifique-se de fornecer o token através de Authorization no header da request para endpoints privados. O token tem validade de um dia.
- Certifique-se de sempre enviar um JSON formatado corretamente no body da request.
- Você pode ver informações detalhadas sobre os endpoints em http://localhost:3333/api-docs/ ao rodar o projeto em modo de desenvolvimento local.

## Tecnologias

- Linguagem: JavaScript;
- Framework: Express.js;
- SGBD: PostgreSQL;
- ORM: Sequelize;
- Pacotes Adicionais: dotenv, jsonwebtoken, bcrypt, swagger.

## Sobre o Pharmacy Central System API

Ainda é uma versão bastante inicial do projeto portanto muitas funcionalidades e melhorias ainda podem ser adicionadas, como melhorias no código das controllers por exemplo.
