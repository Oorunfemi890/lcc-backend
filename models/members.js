"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Member extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Member can have many AdminUsers
            Member.hasOne(models.AdminUser, {
                foreignKey: 'memberId',
                as: 'adminUser'
            });

            // Member can be assigned many FollowUps
            Member.hasMany(models.FollowUp, {
                foreignKey: 'assignedToMemberId',
                as: 'followUps'
            });

            Member.hasMany(models.Testimony, {
                foreignKey: 'memberId',
                as: 'testimonies'
            });

            // Self-referential association for parent-child relationships
            Member.belongsTo(models.Member, {
                foreignKey: 'parentId',
                as: 'parent'
            });

            Member.hasMany(models.Member, {
                foreignKey: 'parentId',
                as: 'children'
            });
        }

    }
    Member.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50]
                }
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 50]
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            countryCode: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '+234' // Default to Nigeria
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                validate: {
                    isDate: true,
                    isBefore: new Date().toISOString().split('T')[0] // Must be in the past
                }
            },
            gender: {
                type: DataTypes.ENUM('male', 'female', 'other'),
                allowNull: true
            },
            maritalStatus: {
                type: DataTypes.ENUM,
                values: ['single', 'married', 'divorced', 'widowed'],
                allowNull: true
            },
            occupation: {
                type: DataTypes.STRING,
                allowNull: true
            },
            interests: {
                type: DataTypes.TEXT, // Store as JSON string or comma-separated
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('interests');
                    try {
                        return rawValue ? JSON.parse(rawValue) : [];
                    } catch {
                        return rawValue ? rawValue.split(',').map(item => item.trim()) : [];
                    }
                },
                set(value) {
                    if (Array.isArray(value)) {
                        this.setDataValue('interests', JSON.stringify(value));
                    } else {
                        this.setDataValue('interests', value);
                    }
                }
            },
            memberSince: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            membershipType: {
                type: DataTypes.ENUM,
                values: [
                    'Youth',
                    "Children's",
                    'Choir',
                    'Media & Audio Visual',
                    'Ushering',
                    'Prayer',
                    'Outreach & Evangelism',
                    'Hospitality',
                    'Counseling',
                    "Men's Fellowship",
                    "Women's Fellowship",
                    'Sunday School',
                    'Other'
                ],
                defaultValue: 'Other'
            },
            ageGroup: {
                type: DataTypes.ENUM,
                values: ['children', 'teenager', 'adult'],
                allowNull: true
            },
            isWorker: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            emergencyContactName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            emergencyContactPhone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            emergencyContactRelationship: {
                type: DataTypes.STRING,
                allowNull: true
            },
            profilePicture: {
                type: DataTypes.STRING, // Store file path or URL
                allowNull: true
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            securityPin: {
                type: DataTypes.STRING,
                allowNull: true
            },
            parentId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Members',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }

        },
        {
            sequelize,
            modelName: "Member",
            timestamps: true, // Adds createdAt and updatedAt
            indexes: [
                {
                    unique: false,
                    fields: ['email']
                },
                {
                    fields: ['firstName', 'lastName']
                },
                {
                    fields: ['memberSince']
                },
                {
                    fields: ['active']
                }
            ],
            hooks: {
                beforeValidate: (member) => {
                    // Normalize email to lowercase
                    if (member.email) {
                        member.email = member.email.toLowerCase().trim();
                    }

                    // Normalize names
                    if (member.firstName) {
                        member.firstName = member.firstName.trim();
                    }
                    if (member.lastName) {
                        member.lastName = member.lastName.trim();
                    }
                }
            }
        }
    );

    // Instance methods
    Member.prototype.getFullName = function () {
        return `${this.firstName} ${this.lastName}`;
    };

    Member.prototype.getInitials = function () {
        return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
    };

    Member.prototype.getAge = function () {
        if (!this.dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return Member;
};