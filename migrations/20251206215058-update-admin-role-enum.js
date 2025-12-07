'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // PostgreSQL requires special handling for enum updates
    // We need to:
    // 1. Add the new value to the enum type if it doesn't exist
    // 2. This is safe to run multiple times

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        -- Check if VIEWER value exists in the enum
        IF NOT EXISTS (
          SELECT 1
          FROM pg_enum
          WHERE enumlabel = 'VIEWER'
          AND enumtypid = (
            SELECT oid
            FROM pg_type
            WHERE typname = 'enum_AdminUsers_role'
          )
        ) THEN
          -- Add VIEWER to the enum
          ALTER TYPE "enum_AdminUsers_role" ADD VALUE 'VIEWER';
        END IF;
      END
      $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL doesn't support removing enum values directly
    // You would need to recreate the enum type and update all references
    // For safety, we'll leave this as a no-op
    // If you really need to remove VIEWER, you'll need to:
    // 1. Create a new enum type without VIEWER
    // 2. Alter the column to use the new type
    // 3. Drop the old enum type

    console.log('Removing enum values is not supported in PostgreSQL.');
    console.log('If you need to rollback, you will need to manually recreate the enum type.');
  },
};
