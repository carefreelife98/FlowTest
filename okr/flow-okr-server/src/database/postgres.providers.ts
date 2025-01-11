import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'root',
                password: 'root',
                database: 'flow_okr_test',
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: true,
                logging: ['query', 'error', 'schema'], // TODO: 데이터베이스 쿼리 로깅 여부
            });

            return dataSource.initialize();
        },
    },
];
