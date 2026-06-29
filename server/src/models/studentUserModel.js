const crypto = require('crypto');

const { getPool } = require('../db');
const { createHttpError } = require('../utils/httpError');

function getRequiredPool() {
  const pool = getPool();

  if (!pool) {
    throw createHttpError(503, 'database_not_configured', {
      expose: true,
    });
  }

  return pool;
}

function mapStudentUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    studentUid: row.student_uid,
    phone: row.phone,
    passwordHash: row.password_hash,
    name: row.name,
    grade: row.grade,
    stage: row.stage,
    abilityIndex: Number(row.ability_index),
    totalStars: row.total_stars,
    status: row.status,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function generateStudentUid() {
  const timestampPart = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `STU${timestampPart}${randomPart}`;
}

function normalizeDbError(error) {
  if (error && error.statusCode) {
    throw error;
  }

  throw createHttpError(503, 'database_unavailable', {
    expose: true,
    data: {
      code: error && error.code ? error.code : null,
    },
  });
}

async function findByPhone(phone) {
  try {
    const pool = getRequiredPool();
    const [rows] = await pool.query(
      `SELECT id, student_uid, phone, password_hash, name, grade, stage, ability_index, total_stars, status, last_login_at, created_at, updated_at
       FROM student_users
       WHERE phone = ?
       LIMIT 1`,
      [phone]
    );

    return mapStudentUser(rows[0]);
  } catch (error) {
    return normalizeDbError(error);
  }
}

async function findById(id) {
  try {
    const pool = getRequiredPool();
    const [rows] = await pool.query(
      `SELECT id, student_uid, phone, password_hash, name, grade, stage, ability_index, total_stars, status, last_login_at, created_at, updated_at
       FROM student_users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return mapStudentUser(rows[0]);
  } catch (error) {
    return normalizeDbError(error);
  }
}

async function createStudentUser({ phone, passwordHash, name, grade, stage }) {
  try {
    const pool = getRequiredPool();
    const studentUid = generateStudentUid();
    const [result] = await pool.query(
      `INSERT INTO student_users (student_uid, phone, password_hash, name, grade, stage)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [studentUid, phone, passwordHash, name, grade, stage]
    );

    return findById(result.insertId);
  } catch (error) {
    return normalizeDbError(error);
  }
}

async function updateLastLoginAt(id) {
  try {
    const pool = getRequiredPool();
    await pool.query(
      `UPDATE student_users
       SET last_login_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );
  } catch (error) {
    return normalizeDbError(error);
  }
}

async function upsertStudentDevice({ studentUserId, deviceId, localSchemaVersion }) {
  if (!deviceId) {
    return null;
  }

  try {
    const pool = getRequiredPool();
    await pool.query(
      `INSERT INTO student_devices (student_user_id, device_id, last_seen_at, schema_version)
       VALUES (?, ?, CURRENT_TIMESTAMP, ?)
       ON DUPLICATE KEY UPDATE
         student_user_id = VALUES(student_user_id),
         last_seen_at = CURRENT_TIMESTAMP,
         schema_version = VALUES(schema_version)`,
      [studentUserId, deviceId, localSchemaVersion || 4]
    );

    return {
      studentUserId,
      deviceId,
      localSchemaVersion: localSchemaVersion || 4,
    };
  } catch (error) {
    return normalizeDbError(error);
  }
}

module.exports = {
  findByPhone,
  findById,
  createStudentUser,
  updateLastLoginAt,
  upsertStudentDevice,
};
