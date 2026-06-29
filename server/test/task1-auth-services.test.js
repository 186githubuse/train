const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

function clearModule(modulePath) {
  delete require.cache[require.resolve(modulePath)];
}

function loadTokenServiceWithSecret(secret) {
  const originalSecret = process.env.JWT_SECRET;

  if (typeof secret === 'string') {
    process.env.JWT_SECRET = secret;
  } else {
    delete process.env.JWT_SECRET;
  }

  clearModule('../src/config/env');
  clearModule('../src/services/tokenService');

  const tokenService = require('../src/services/tokenService');

  if (typeof originalSecret === 'string') {
    process.env.JWT_SECRET = originalSecret;
  } else {
    delete process.env.JWT_SECRET;
  }

  clearModule('../src/config/env');
  clearModule('../src/services/tokenService');

  return tokenService;
}

test('passwordService hashes and verifies passwords via bcryptjs', async () => {
  const { SALT_ROUNDS, hashPassword, verifyPassword } = require('../src/services/passwordService');

  assert.equal(typeof SALT_ROUNDS, 'number');
  assert.ok(SALT_ROUNDS >= 10);

  const password = 'abc12345';
  const hash = await hashPassword(password);

  assert.notEqual(hash, password);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('wrong-password', hash), false);
});

test('tokenService signs student access tokens with student identity only', () => {
  const { signStudentAccessToken } = loadTokenServiceWithSecret('task1-test-secret');

  const token = signStudentAccessToken({
    id: 42,
    studentUid: 'STU_TEST_42',
    phone: '13800138000',
    grade: 4,
    stage: 'S',
  });

  const payload = jwt.verify(token, 'task1-test-secret');

  assert.equal(payload.role, 'student');
  assert.equal(payload.type, 'student');
  assert.equal(payload.studentUserId, 42);
  assert.equal(payload.studentUid, 'STU_TEST_42');
  assert.equal(payload.phone, '13800138000');
  assert.equal(payload.grade, 4);
  assert.equal(payload.stage, 'S');
  assert.match(payload.sub, /^student:42$/);
});

test('tokenService throws an exposed configuration error when JWT secret is missing', () => {
  const { signStudentAccessToken } = loadTokenServiceWithSecret(null);

  assert.throws(
    () => signStudentAccessToken({ id: 1, studentUid: 'STU_TEST_1', phone: '13800138000', grade: 1, stage: 'S' }),
    (error) => {
      assert.equal(error.statusCode, 500);
      assert.equal(error.expose, true);
      assert.equal(error.message, 'jwt_not_configured');
      return true;
    }
  );
});

test('studentUserModel exposes DB-backed auth methods and rejects when DB is unavailable', async () => {
  const studentUserModel = require('../src/models/studentUserModel');

  const expectedMethods = [
    'findByPhone',
    'findById',
    'createStudentUser',
    'updateLastLoginAt',
    'upsertStudentDevice',
  ];

  expectedMethods.forEach((methodName) => {
    assert.equal(typeof studentUserModel[methodName], 'function');
  });

  await assert.rejects(
    () => studentUserModel.findByPhone('13800138000'),
    (error) => {
      assert.equal(error.statusCode, 503);
      assert.equal(error.expose, true);
      assert.match(error.message, /^database_/);
      return true;
    }
  );
});
