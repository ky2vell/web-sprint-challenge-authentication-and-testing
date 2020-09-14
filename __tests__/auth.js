const supertest = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

const credentials = {
  username: 'CoolName',
  password: 'password'
};

beforeAll(async () => {
  // run seeds before tests
  await db.truncate('users');
});

afterAll(async () => {
  // Close database after tests to prevent warning
  await db.destroy();
});

describe('authorization integration tests', () => {
  it('POST /api/auth/register', async () => {
    const res = await supertest(server)
      .post('/api/auth/register')
      .send(credentials);
    expect(res.statusCode).toBe(201);
    expect(res.type).toBe('application/json');
    expect(res.body.username).toBe('CoolName');
  });

  it('POST /api/auth/register (user already exists)', async () => {
    const res = await supertest(server)
      .post('/api/auth/register')
      .send(credentials);
    expect(res.statusCode).toBe(409);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('Username already taken!');
  });

  it('POST /api/auth/login', async () => {
    const res = await supertest(server)
      .post('/api/auth/login')
      .send(credentials);
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('Welcome CoolName!');
  });

  it('POST /api/auth/login (user not found)', async () => {
    const res = await supertest(server).post('/api/auth/login').send({
      username: 'CoolDude',
      password: 'password'
    });
    expect(res.statusCode).toBe(401);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('User not found!');
  });
});
