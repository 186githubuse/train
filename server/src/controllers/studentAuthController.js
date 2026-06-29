const studentUserModel = require('../models/studentUserModel');
const { hashPassword, verifyPassword } = require('../services/passwordService');
const { signStudentAccessToken } = require('../services/tokenService');
const { createHttpError } = require('../utils/httpError');

function deriveStage(grade) {
  if (grade >= 1 && grade <= 6) {
    return 'S';
  }

  if (grade >= 7 && grade <= 9) {
    return 'C';
  }

  return 'H';
}

function normalizePhone(phone) {
  return String(phone || '').trim();
}

function normalizeName(name) {
  return String(name || '').trim();
}

function normalizeGrade(grade) {
  return Number.parseInt(grade, 10);
}

function validateRegisterInput(body = {}) {
  const phone = normalizePhone(body.phone);
  const password = String(body.password || '');
  const name = normalizeName(body.name);
  const grade = normalizeGrade(body.grade);

  if (!/^\d{6,20}$/.test(phone)) {
    throw createHttpError(400, 'invalid_phone', { expose: true });
  }

  if (password.length < 6) {
    throw createHttpError(400, 'invalid_password', { expose: true });
  }

  if (!name || name.length > 50) {
    throw createHttpError(400, 'invalid_name', { expose: true });
  }

  if (!Number.isInteger(grade) || grade < 1 || grade > 12) {
    throw createHttpError(400, 'invalid_grade', { expose: true });
  }

  return {
    phone,
    password,
    name,
    grade,
    stage: deriveStage(grade),
    deviceId: body.deviceId ? String(body.deviceId).trim() : '',
    localSchemaVersion: Number.parseInt(body.localSchemaVersion, 10) || 4,
  };
}

function validateLoginInput(body = {}) {
  const phone = normalizePhone(body.phone);
  const password = String(body.password || '');

  if (!/^\d{6,20}$/.test(phone)) {
    throw createHttpError(400, 'invalid_phone', { expose: true });
  }

  if (password.length < 6) {
    throw createHttpError(400, 'invalid_password', { expose: true });
  }

  return {
    phone,
    password,
    deviceId: body.deviceId ? String(body.deviceId).trim() : '',
    localSchemaVersion: Number.parseInt(body.localSchemaVersion, 10) || 4,
  };
}

function toUserSummary(student) {
  return {
    id: student.id,
    studentUid: student.studentUid,
    phone: student.phone,
    name: student.name,
    grade: student.grade,
    stage: student.stage,
    abilityIndex: student.abilityIndex,
    totalStars: student.totalStars,
    status: student.status,
    lastLoginAt: student.lastLoginAt,
    createdAt: student.createdAt,
  };
}

async function maybeUpsertDevice(student, payload) {
  if (!payload.deviceId) {
    return;
  }

  await studentUserModel.upsertStudentDevice({
    studentUserId: student.id,
    deviceId: payload.deviceId,
    localSchemaVersion: payload.localSchemaVersion,
  });
}

async function registerStudent(req, res, next) {
  try {
    const payload = validateRegisterInput(req.body);
    const existingStudent = await studentUserModel.findByPhone(payload.phone);

    if (existingStudent) {
      throw createHttpError(409, 'phone_already_exists', { expose: true });
    }

    const passwordHash = await hashPassword(payload.password);
    const student = await studentUserModel.createStudentUser({
      phone: payload.phone,
      passwordHash,
      name: payload.name,
      grade: payload.grade,
      stage: payload.stage,
    });

    await maybeUpsertDevice(student, payload);

    const freshStudent = await studentUserModel.findById(student.id);
    const accessToken = signStudentAccessToken(freshStudent);

    return res.status(201).json({
      code: 0,
      message: 'ok',
      data: {
        accessToken,
        user: toUserSummary(freshStudent),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function loginStudent(req, res, next) {
  try {
    const payload = validateLoginInput(req.body);
    const student = await studentUserModel.findByPhone(payload.phone);

    if (!student) {
      throw createHttpError(401, 'invalid_phone_or_password', { expose: true });
    }

    const passwordMatched = await verifyPassword(payload.password, student.passwordHash);

    if (!passwordMatched) {
      throw createHttpError(401, 'invalid_phone_or_password', { expose: true });
    }

    if (student.status !== 1) {
      throw createHttpError(403, 'student_account_disabled', { expose: true });
    }

    await studentUserModel.updateLastLoginAt(student.id);
    await maybeUpsertDevice(student, payload);

    const freshStudent = await studentUserModel.findById(student.id);
    const accessToken = signStudentAccessToken(freshStudent);

    return res.status(200).json({
      code: 0,
      message: 'ok',
      data: {
        accessToken,
        user: toUserSummary(freshStudent),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCurrentStudent(req, res, next) {
  try {
    if (!req.auth || !req.auth.studentUserId) {
      throw createHttpError(401, 'missing_auth_context', { expose: true });
    }

    const student = await studentUserModel.findById(req.auth.studentUserId);

    if (!student) {
      throw createHttpError(404, 'student_not_found', { expose: true });
    }

    return res.status(200).json({
      code: 0,
      message: 'ok',
      data: {
        user: toUserSummary(student),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  registerStudent,
  loginStudent,
  getCurrentStudent,
  deriveStage,
};
