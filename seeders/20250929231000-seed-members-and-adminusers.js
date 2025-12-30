"use strict";
const bcrypt = require("bcryptjs");

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
      const securityPin = "1990";
      const phoneNumber = "08132362341";
      const dateOfBirth = "1990-03-12";
      const dobString = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '';
      const stringToHash = `${securityPin}${phoneNumber}${dobString}`;
      const hashedPin = await bcrypt.hash(stringToHash, 10);

      memberId = Sequelize.Utils.toDefaultValue(Sequelize.UUIDV4());
      await queryInterface.bulkInsert("Members", [
        {
          id: memberId,
          securityPin: hashedPin,
          firstName: "Ibkun",
          lastName: "Odeyemi",
          email: "odeyemiibukuna@gmail.com",
          phoneNumber: phoneNumber,
          countryCode: "+234",
          address: "No 73 Modupe Young Thomas Estate, Ajah, Lagos",
          memberSince: new Date(),
          active: true,
          maritalStatus: "married",
          occupation: "Software Engineer",
          resetOtp: "",
          resetOtpExpiry: null,
          isWorker: true,
          ageGroup: "adult",
          membershipType: "Media & Audio Visual",
          maritalStatus: "married",
          occupation: "Software Engineer",
          resetOtp: "",
          resetOtpExpiry: null,
          isWorker: true,
          emergencyContactName: "Okiki Odeyemi",
          emergencyContactPhone: "08132362341",
          emergencyContactRelationship: "Spouse",
          gender: "male",
          ageGroup: "adult",
          dateOfBirth,
          profilePicture: "https://res.cloudinary.com/dwlsoqntp/image/upload/v1764360289/mjxrdghxxyrcc9oogxa0.jpg",
          notes: "This is a test member",
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
          email: "odeyemiibukuna@gmail.com",
          password: bcrypt.hashSync("hashedpassword123!", 8),
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