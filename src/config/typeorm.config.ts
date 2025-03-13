import { TypeOrmModuleOptions } from '@nestjs/typeorm';

class TypeOrmService {
  public getTypeormConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [`${__dirname}/../**/*.entity.{js,.ts}`],
      migrations: [`${__dirname}/../migration/{.ts,*.js}`],
      synchronize: false,
      migrationsRun: false
    };
  }
}

const typeOrmService = new TypeOrmService();
export { typeOrmService };
