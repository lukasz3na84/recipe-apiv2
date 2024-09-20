import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeToIngredients1726590827754
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE ingredients DROP CONSTRAINT IF EXISTS FK_ingredient_dish;
            ALTER TABLE ingredients
            ADD CONSTRAINT FK_ingredient_dish
            FOREIGN KEY (dishId) REFERENCES dish(id)
            ON DELETE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE ingredients DROP CONSTRAINT IF EXISTS FK_ingredient_dish;
            -- Opcjonalnie, możesz przywrócić ograniczenie bez CASCADE, jeśli to konieczne
            ALTER TABLE ingredients
            ADD CONSTRAINT FK_ingredient_dish
            FOREIGN KEY (dishId) REFERENCES dish(id);
        `);
  }
}
