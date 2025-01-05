import { DataSource } from "typeorm";
import { dbConfig } from "../data_source";
export const testDataSource = new DataSource(dbConfig as any);

export const initializeTestDataSource = async () => {
  await testDataSource.initialize();
};

export const cleanupDatabase = async () => {
  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
};
