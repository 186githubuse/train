const test = require('node:test');
const assert = require('node:assert/strict');

const studentUserModel = require('../src/models/studentUserModel');
const controller = require('../src/controllers/studentAuthController');

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

async function captureNextError(run) {
  let capturedError = null;
  await run((error) => {
    capturedError = error;
  });
  return capturedError;
}

test('registerStudent validates required fields before touching the model', async () => {
  const req = {
    body: {
      phone: '13800138000',
      password: '12345',
      name: '  ',
      grade: 13,
    },
  };

  const error = await captureNextError((next) =>
    controller.registerStudent(req, createMockResponse(), next)
  );

  assert.equal(error.statusCode, 400);
  assert.equal(error.expose, true);
});

test('loginStudent returns 401 for invalid credentials without leaking which field failed', async () => {
  const originalFindByPhone = studentUserModel.findByPhone;
  studentUserModel.findByPhone = async () => ({
    id: 5,
    studentUid: 'STU_LOGIN_TEST',
    phone: '13800138000',
    passwordHash: '$2b$10$abcdefghijklmnopqrstuuWQ7N1J4B6XM.Bv1W6T4S8k7z3vN1a',
    name: '小明',
    grade: 4,
    stage: 'S',
    abilityIndex: 0,
    totalStars: 0,
    status: 1,
    lastLoginAt: null,
    createdAt: new Date(),
  });

  const req = {
    body: {
      phone: '13800138000',
      password: 'wrong-password',
    },
  };

  try {
    const error = await captureNextError((next) =>
      controller.loginStudent(req, createMockResponse(), next)
    );

    assert.equal(error.statusCode, 401);
    assert.equal(error.message, 'invalid_phone_or_password');
  } finally {
    studentUserModel.findByPhone = originalFindByPhone;
  }
});

test('getCurrentStudent requires JWT auth context with student identity', async () => {
  const error = await captureNextError((next) =>
    controller.getCurrentStudent({ auth: null }, createMockResponse(), next)
  );

  assert.equal(error.statusCode, 401);
  assert.equal(error.message, 'missing_auth_context');
});

test('auth router binds student register login and me endpoints', () => {
  const router = require('../src/routes/auth');
  const stack = router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
      handlers: layer.route.stack.map((entry) => entry.name),
    }));

  assert.deepEqual(
    stack,
    [
      {
        path: '/student/register',
        methods: ['post'],
        handlers: ['registerStudent'],
      },
      {
        path: '/student/login',
        methods: ['post'],
        handlers: ['loginStudent'],
      },
      {
        path: '/me',
        methods: ['get'],
        handlers: ['requireAuth', 'getCurrentStudent'],
      },
    ]
  );
});

test('requireAuth keeps jwt payload on req.auth for student me endpoint', () => {
  const jwt = require('jsonwebtoken');
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'middleware-student-secret';
  delete require.cache[require.resolve('../src/config/env')];
  delete require.cache[require.resolve('../src/middleware/auth')];
  const { requireAuth: freshRequireAuth } = require('../src/middleware/auth');

  const token = jwt.sign(
    {
      role: 'student',
      type: 'student',
      studentUserId: 9,
      studentUid: 'STU_MIDDLEWARE_9',
      phone: '13800138000',
      grade: 4,
      stage: 'S',
    },
    'middleware-student-secret'
  );

  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = createMockResponse();
  let nextCalled = false;

  freshRequireAuth(req, res, () => {
    nextCalled = true;
  });

  if (typeof originalSecret === 'string') {
    process.env.JWT_SECRET = originalSecret;
  } else {
    delete process.env.JWT_SECRET;
  }
  delete require.cache[require.resolve('../src/config/env')];
  delete require.cache[require.resolve('../src/middleware/auth')];

  assert.equal(nextCalled, true);
  assert.equal(req.auth.studentUserId, 9);
  assert.equal(req.auth.role, 'student');
});
