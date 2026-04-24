const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("PasswordResetToken", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: "expires_at"
  }
}, {
  tableName: "password_reset_tokens",
  timestamps: false
});
