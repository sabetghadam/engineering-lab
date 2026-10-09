const request = require('supertest');
const server = require('../server');

// ─────────────────────────────────
// GET /users
// ─────────────────────────────────
describe('GET /users', () => {
    test('should return 200', async () => {
        const res = await request(server).get('/users');
        expect(res.status).toBe(200);
    });

    test('should return success=true', async () => {
        const res = await request(server).get('/users');
        expect(res.body.success).toBe(true);
    });

    test('should return users array with admin', async () => {
        const res = await request(server).get('/users');
        expect(res.body.body).toEqual([{ username: 'admin' }]);
    });

    test('should return JSON content-type', async () => {
        const res = await request(server).get('/users');
        expect(res.headers['content-type']).toMatch(/application\/json/);
    });
});

// ─────────────────────────────────
// GET unknown route
// ─────────────────────────────────
describe('GET unknown route', () => {
    test('should return 200', async () => {
        const res = await request(server).get('/anything');
        expect(res.status).toBe(200);
    });

    test('should return success=false', async () => {
        const res = await request(server).get('/anything');
        expect(res.body.success).toBe(false);
    });

    test('should return "Nothing here, dude"', async () => {
        const res = await request(server).get('/anything');
        expect(res.body.body).toBe('Nothing here, dude');
    });
});

// ─────────────────────────────────
// POST method (returns 500 in your code)
// ─────────────────────────────────
describe('POST method', () => {
    test('POST /users should return 500', async () => {
        const res = await request(server).post('/users');
        expect(res.status).toBe(500);
    });

    test('POST should return success=false', async () => {
        const res = await request(server).post('/users');
        expect(res.body.success).toBe(false);
    });

    test('POST body should be empty string', async () => {
        const res = await request(server).post('/users');
        expect(res.body.body).toBe('');
    });

    test('POST /anything should also return 500', async () => {
        const res = await request(server).post('/anything');
        expect(res.status).toBe(500);
    });
});

// ─────────────────────────────────
// Query string
// ─────────────────────────────────
describe('Query string', () => {
    test('/users?id=5 should NOT match /users (goes to default)', async () => {
        const res = await request(server).get('/users?id=5');
        expect(res.body.body).toBe('Nothing here, dude');
        expect(res.body.success).toBe(false);
    });

    test('/users?page=1 should return default body', async () => {
        const res = await request(server).get('/users?page=1');
        expect(res.body.success).toBe(false);
    });
});

// ─────────────────────────────────
// Other methods (not handled in your code)
// ─────────────────────────────────
describe('Other methods', () => {
    test('DELETE /users should return 200 (not blocked)', async () => {
        const res = await request(server).delete('/users');
        expect(res.status).toBe(200);
    });

    test('PUT /users should return 200 (not blocked)', async () => {
        const res = await request(server).put('/users');
        expect(res.status).toBe(200);
    });

    test('PATCH /users should return 200 (not blocked)', async () => {
        const res = await request(server).patch('/users');
        expect(res.status).toBe(200);
    });
});