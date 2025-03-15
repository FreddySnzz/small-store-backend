<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A small API for your store. <br>
Manage users, authentication, categories, products and orders, ensuring security and efficiency. <p>

This project uses PostgreSQL with TypeORM as the database. <br>
Authentication with JWT and Middlewares to block unauthorized users. <br>
Unit tests with Jest, covering ~85% of the project. <p>

✅ CORS and Docker ready. <br>

<p align="center">📄 The project documentation was made with Postman <a href="https://drive.google.com/file/d/1x3VRfHDjPMncVmn66s8gdHYUfiZOG8wi/view?usp=drive_link" target="_blank">Download here</a> 📄</p>

## Project setup

```bash
$ npm install
```
__Note: You will need .env, Dockerfile and docker-compose.yml to start the project on localhost.__ <br>
#### .Env file:
```bash
PROJECT_NAME=small-store-backend
API_PORT=8089

TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=1234
TYPEORM_DATABASE=small-store
TYPEORM_SCHEMA=small-store
TYPEORM_DIALECT=postgres

JWT_SECRET={editThisToYourJwtSecret}
JWT_EXPIRES_IN={chooseYourAccessTokenDuration - ex: 1d}

DATABASE_URL=postgres://postgres:1234@localhost:5432/small-store

```

#### Dockerfile:
```bash
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN chown -R node /app
CMD [ "npm", "run", "start:prod" ]
EXPOSE 8089
```

#### docker-compose.yml file:
```bash
services:
  api:
    build: .
    container_name: small_store_backend
    ports:
      - "8089:8089"
    depends_on:
      - database
    environment:
      - DATABASE_URL=postgres://postgres:1234@localhost:5432/small-store

  database:
    image: postgres:15
    container_name: small_store_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: small-store
      POSTGRES_HOST: localhost
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

__Note²: You will need run the migrations to database.__ <br>
```bash
$ npm run typeorm migration:run
```


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


#### Admin user credentials
```bash
email: "admin@root.com"
password: "asdf1234"
```


## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## DB Schema
<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1WJwsKXie1hJVvWIbZ8owBxAJTLUriJmq" width="840" height="480" alt="schema" />
</p>


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
