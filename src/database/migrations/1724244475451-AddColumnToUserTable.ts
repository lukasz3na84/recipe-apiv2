import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUser1724236688792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting migration up...');

    try {
      // Zmiana nazwy kolumny `username` na `email`
      const renameColumnQuery = `ALTER TABLE user CHANGE username email VARCHAR(255) NOT NULL`;
      console.log('Executing query:', renameColumnQuery);
      await queryRunner.query(renameColumnQuery);

      // Dodanie nowej kolumny `password`
      const addPasswordColumnQuery = `ALTER TABLE user ADD password VARCHAR(255) NOT NULL`;
      console.log('Executing query:', addPasswordColumnQuery);
      await queryRunner.query(addPasswordColumnQuery);

      console.log('Migration up completed successfully.');
    } catch (error) {
      console.error('Error during migration up:', error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting migration down...');

    try {
      // Usunięcie kolumny `password`
      const dropPasswordColumnQuery = `ALTER TABLE user DROP COLUMN password`;
      console.log('Executing query:', dropPasswordColumnQuery);
      await queryRunner.query(dropPasswordColumnQuery);

      // Przywrócenie nazwy kolumny `email` na `username`
      const renameColumnBackQuery = `ALTER TABLE user CHANGE email username VARCHAR(255) NOT NULL`;
      console.log('Executing query:', renameColumnBackQuery);
      await queryRunner.query(renameColumnBackQuery);

      console.log('Migration down completed successfully.');
    } catch (error) {
      console.error('Error during migration down:', error);
    }
  }
}
