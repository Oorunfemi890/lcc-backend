"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table exists
    const tableExists = await queryInterface.sequelize.query(
      `SELECT to_regclass('public."Attendances"') IS NOT NULL as exists`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!tableExists[0].exists) {
      // Create table if it doesn't exist
      await queryInterface.createTable("Attendances", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        serviceType: {
          type: Sequelize.ENUM(
            "Sunday Service",
            "Digging Deep",
            "Faith Clinic",
            "Church Without Walls",
            "Thanksgiving Service",
            "New Year Service"
          ),
          allowNull: false,
          defaultValue: "Sunday Service"
        },
        menCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        womenCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        adultsCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        youthCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        visitorsCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        childrenCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        total: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });

      console.log("✓ Attendances table created");
    } else {
      console.log("✓ Attendances table already exists");
    }

    // Check if recordedById column exists before trying to remove it
    const [columns] = await queryInterface.sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = 'Attendances' 
       AND column_name = 'recordedById'`
    );

    if (columns.length > 0) {
      await queryInterface.removeColumn("Attendances", "recordedById");
      console.log("✓ recordedById column removed");
    } else {
      console.log("✓ recordedById column doesn't exist (skipping removal)");
    }

    // Check if index exists before creating
    const [indexes] = await queryInterface.sequelize.query(
      `SELECT indexname 
       FROM pg_indexes 
       WHERE tablename = 'Attendances' 
       AND indexname = 'attendances_date'`
    );

    if (indexes.length === 0) {
      await queryInterface.addIndex("Attendances", ["date"], {
        name: "attendances_date"
      });
      console.log("✓ Index on date column created");
    } else {
      console.log("✓ Index on date column already exists");
    }

    // Check and add serviceType index
    const [serviceTypeIndexes] = await queryInterface.sequelize.query(
      `SELECT indexname 
       FROM pg_indexes 
       WHERE tablename = 'Attendances' 
       AND indexname = 'attendances_service_type'`
    );

    if (serviceTypeIndexes.length === 0) {
      await queryInterface.addIndex("Attendances", ["serviceType"], {
        name: "attendances_service_type"
      });
      console.log("✓ Index on serviceType column created");
    } else {
      console.log("✓ Index on serviceType column already exists");
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes if they exist
    try {
      await queryInterface.removeIndex("Attendances", "attendances_service_type");
    } catch (error) {
      console.log("Index attendances_service_type doesn't exist");
    }

    try {
      await queryInterface.removeIndex("Attendances", "attendances_date");
    } catch (error) {
      console.log("Index attendances_date doesn't exist");
    }

    // Drop table
    await queryInterface.dropTable("Attendances");
  }
};