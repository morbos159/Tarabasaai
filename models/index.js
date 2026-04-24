const sequelize = require("../db/config");

const User = require("./user.model")(sequelize);
const Student = require("./student.model")(sequelize);
const VerbActivity = require("./verb-activity.model")(sequelize);
const Score = require("./score.model")(sequelize);
const PasswordResetToken = require("./password-reset-token.model")(sequelize);
const VoiceAttempt = require("./voice-attempt.model")(sequelize);

User.hasMany(Student, { foreignKey: "teacherId", as: "students" });
Student.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });

User.hasMany(Score, { foreignKey: "graderId", as: "givenScores" });
Score.belongsTo(User, { foreignKey: "graderId", as: "grader" });

Student.hasMany(Score, { foreignKey: "studentId", as: "scores" });
Score.belongsTo(Student, { foreignKey: "studentId", as: "student" });

Student.hasMany(VoiceAttempt, { foreignKey: "studentId", as: "voiceAttempts" });
VoiceAttempt.belongsTo(Student, { foreignKey: "studentId", as: "student" });

VerbActivity.hasMany(Score, { foreignKey: "activityId", as: "scores" });
Score.belongsTo(VerbActivity, { foreignKey: "activityId", as: "activity" });

module.exports = {
  sequelize,
  User,
  Student,
  VerbActivity,
  Score,
  PasswordResetToken,
  VoiceAttempt
};
