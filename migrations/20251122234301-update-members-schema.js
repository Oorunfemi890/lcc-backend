'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add ageGroup column
    await queryInterface.addColumn('Members', 'ageGroup', {
      type: Sequelize.ENUM('children', 'teenager', 'adult'),
      allowNull: true
    });

    // 2. Update membershipType enum
    // Postgres doesn't support removing values from ENUM easily, so we just add the new ones.
    // We use raw queries because Sequelize's changeColumn doesn't handle ENUM updates well in Postgres.
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Youth'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Children''s'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Choir'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Media & Audio Visual'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Ushering'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Prayer'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Outreach & Evangelism'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Hospitality'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Counseling'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Men''s Fellowship'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Women''s Fellowship'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Sunday School'`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_Members_membershipType" ADD VALUE IF NOT EXISTS 'Other'`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Members', 'ageGroup');
    // We cannot easily remove ENUM values in Postgres.
    // To strictly revert, we'd need to drop the type and recreate it with original values,
    // which would require handling the data in the column.
    // For this migration, we will skip reverting the ENUM values.
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Members_ageGroup";');
  }
};
