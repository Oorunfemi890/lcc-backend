"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Celebrant extends Model {
        static associate(models) {
            // Celebrant belongs to Member (optional - if the celebrant is a church member)
            Celebrant.belongsTo(models.Member, {
                foreignKey: 'memberId',
                as: 'member',
                allowNull: true // Non-members can also be celebrated
            });
        }
    }

    Celebrant.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            memberId: {
                type: DataTypes.UUID,
                allowNull: true, // Allow non-members to be celebrated
                references: {
                    model: 'Members',
                    key: 'id'
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 100]
                }
            },
            celebrationType: {
                type: DataTypes.ENUM,
                values: ['birthday', 'baptism', 'wedding', 'graduation', 'newborn', 'anniversary', 'promotion', 'ordination', 'other'],
                allowNull: false
            },
            celebrationDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    isDate: true
                }
            },
            contact: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            contactType: {
                type: DataTypes.ENUM,
                values: ['phone', 'email', 'whatsapp'],
                defaultValue: 'phone'
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            isPublic: {
                type: DataTypes.BOOLEAN,
                defaultValue: true // Whether to announce publicly or privately
            },
            specialRequests: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            photoUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            submittedBy: {
                type: DataTypes.STRING,
                allowNull: true // Name of person who submitted the celebration request
            },
            submitterContact: {
                type: DataTypes.STRING,
                allowNull: true
            },
            relationship: {
                type: DataTypes.STRING,
                allowNull: true // Relationship to celebrant (self, spouse, parent, friend, etc.)
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            sequelize,
            modelName: "Celebrant",
            timestamps: true,
            indexes: [
                {
                    fields: ['celebrationType']
                },
                {
                    fields: ['celebrationDate']
                },
                {
                    fields: ['status']
                },
                {
                    fields: ['scheduledFor']
                },
                {
                    fields: ['isRecurring']
                },
                {
                    fields: ['priority']
                },
                {
                    fields: ['active']
                }
            ],
            hooks: {
                beforeValidate: (celebrant) => {
                    // Normalize name and contacts
                    if (celebrant.name) {
                        celebrant.name = celebrant.name.trim();
                    }
                    if (celebrant.contact) {
                        celebrant.contact = celebrant.contact.trim();
                    }
                },

                afterCreate: async (celebrant) => {
                    // Auto-schedule recurring celebrations for next year if birthday
                    if (celebrant.celebrationType === 'birthday' && celebrant.isRecurring) {
                        const nextYear = new Date(celebrant.celebrationDate);
                        nextYear.setFullYear(nextYear.getFullYear() + 1);

                        // This would be handled by a background job in practice
                        console.log(`Recurring celebration scheduled for ${celebrant.name} on ${nextYear.toISOString().split('T')[0]}`);
                    }
                }
            }
        }
    );

    // Instance methods
    Celebrant.prototype.isUpcoming = function () {
        const today = new Date();
        const celebrationDate = new Date(this.celebrationDate);
        return celebrationDate >= today;
    };

    Celebrant.prototype.isPastDue = function () {
        const today = new Date();
        const celebrationDate = new Date(this.celebrationDate);
        return celebrationDate < today && this.status === 'pending';
    };

    Celebrant.prototype.getDaysUntilCelebration = function () {
        const today = new Date();
        const celebrationDate = new Date(this.celebrationDate);
        const diffTime = celebrationDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    Celebrant.prototype.getAge = function () {
        if (this.celebrationType !== 'birthday') return null;
        const today = new Date();
        const birthDate = new Date(this.celebrationDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    Celebrant.prototype.markAsCelebrated = function (celebratedBy = null) {
        this.status = 'celebrated';
        this.celebratedOn = new Date().toISOString().split('T')[0];
        this.celebratedBy = celebratedBy;
        return this.save();
    };

    // Static methods
    Celebrant.getUpcomingCelebrations = function (days = 7) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        return this.findAll({
            where: {
                celebrationDate: {
                    [sequelize.Sequelize.Op.between]: [today, futureDate]
                },
                status: 'approved',
                active: true
            },
            order: [['celebrationDate', 'ASC']]
        });
    };

    Celebrant.getBirthdaysThisMonth = function () {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        return this.findAll({
            where: {
                celebrationType: 'birthday',
                celebrationDate: {
                    [sequelize.Sequelize.Op.between]: [startOfMonth, endOfMonth]
                },
                active: true
            },
            order: [['celebrationDate', 'ASC']]
        });
    };

    return Celebrant;
};