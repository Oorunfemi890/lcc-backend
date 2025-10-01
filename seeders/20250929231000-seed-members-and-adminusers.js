"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const [member] = await queryInterface.sequelize.query(
      `SELECT id FROM "Members" WHERE email = :email LIMIT 1`,
      {
        replacements: { email: "odeyemiibukuna@gmail.com" },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let memberId;

    if (!member) {
      memberId = Sequelize.Utils.toDefaultValue(Sequelize.UUIDV4());
      await queryInterface.bulkInsert("Members", [
        {
          id: memberId,
          firstName: "Ibkun",
          lastName: "Odeyemi",
          email: "odeyemiibukuna@gmail.com",
          phoneNumber: "+2348132362341",
          countryCode: "+234",
          address: "No 73 Modupe Young Thomas Estate, Ajah, Lagos",
          memberSince: new Date(),
          active: true,
          membershipType: "minister",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } else {
      // Use the existing member's ID
      memberId = member.id;
    }

    const [admin] = await queryInterface.sequelize.query(
      `SELECT id FROM "AdminUsers" WHERE "memberId" = :memberId LIMIT 1`,
      {
        replacements: { memberId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!admin) {
      await queryInterface.bulkInsert("AdminUsers", [
        {
          id: Sequelize.Utils.toDefaultValue(Sequelize.UUIDV4()),
          password: "hashedpassword123",
          active: true,
          role: "SUPER_ADMIN",
          memberId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Add down migration logic if needed
  },
};