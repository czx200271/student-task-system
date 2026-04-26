const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
let app;

async function registerAndLogin(email, name = 'User', password = 'Passw0rd!') {
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password });

  expect(registerRes.status).toBe(201);
  expect(registerRes.body).toHaveProperty('token');
  return registerRes.body.token;
}

describe('Tasks API', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.NODE_ENV = 'test';

    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri();

    // Important: require app after env is set
    // eslint-disable-next-line global-require
    app = require('../app');

    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  test('GET /api/tasks requires auth', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  test('CRUD flow: create -> list -> update -> toggle status -> delete', async () => {
    const token = await registerAndLogin('a@example.com', 'A');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My Task',
        description: 'Do something',
        priority: 'high'
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('task._id');
    expect(createRes.body.task.title).toBe('My Task');
    const taskId = createRes.body.task._id;

    const listRes = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.tasks)).toBe(true);
    expect(listRes.body.tasks.length).toBe(1);

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Task Updated', priority: 'medium' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.task.title).toBe('My Task Updated');

    const toggleRes = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`);
    expect(toggleRes.status).toBe(200);
    expect(['todo', 'done']).toContain(toggleRes.body.task.status);

    const delRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(delRes.status).toBe(200);

    const listRes2 = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes2.status).toBe(200);
    expect(listRes2.body.tasks.length).toBe(0);
  });

  test('Forbidden: cannot access another user task', async () => {
    const tokenA = await registerAndLogin('u1@example.com', 'U1');
    const tokenB = await registerAndLogin('u2@example.com', 'U2');

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Private Task' });
    expect(createRes.status).toBe(201);
    const taskId = createRes.body.task._id;

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Hack' });
    expect(updateRes.status).toBe(403);

    const delRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(delRes.status).toBe(403);
  });

  test('Invalid id returns 400', async () => {
    const token = await registerAndLogin('b@example.com', 'B');
    const res = await request(app)
      .put('/api/tasks/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x' });
    expect(res.status).toBe(400);
  });
});

