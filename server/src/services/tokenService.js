const jwt = require('jsonwebtoken');

const { env } = require('../config/env');
const { createHttpError } = require('../utils/httpError');

const STUDENT_ACCESS_TOKEN_EXPIRES_IN = '7d';

function signStudentAccessToken(student) {
  if (!env.jwtSecret) {
    throw createHttpError(500, 'jwt_not_configured', {
      expose: true,
    });
  }

  return jwt.sign(
    {
      role: 'student',
      type: 'student',
      studentUserId: student.id,
      studentUid: student.studentUid,
      phone: student.phone,
      grade: student.grade,
      stage: student.stage,
    },
    env.jwtSecret,
    {
      subject: `student:${student.id}`,
      expiresIn: STUDENT_ACCESS_TOKEN_EXPIRES_IN,
    }
  );
}

module.exports = {
  STUDENT_ACCESS_TOKEN_EXPIRES_IN,
  signStudentAccessToken,
};
