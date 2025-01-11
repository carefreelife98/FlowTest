import { Module } from '@nestjs/common';
import { databaseProviders } from './postgres.providers';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
