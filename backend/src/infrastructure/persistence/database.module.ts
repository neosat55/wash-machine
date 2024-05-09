import { DynamicModule, Global, Module } from '@nestjs/common';
import { Client, ClientName } from './client.database';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = [{
      useFactory: () => {
        return new Client().connection;
      },
      provide: ClientName,
    },]
    return {
      module: DatabaseModule,
      providers,
      exports: providers
    };
  }
}