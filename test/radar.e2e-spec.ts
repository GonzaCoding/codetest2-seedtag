import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Radar API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure ValidationPipe like in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /radar', () => {
    describe('Happy Path - 200 OK', () => {
      it('should process closest-enemies protocol', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 3 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should process prioritize-mech protocol', async () => {
        const requestBody = {
          protocols: ['prioritize-mech'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 10 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'mech', number: 1 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 10, y: 10 });
      });

      it('should process assist-allies protocol', async () => {
        const requestBody = {
          protocols: ['assist-allies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 3 },
              allies: 2,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 10, y: 10 });
      });

      it('should process avoid-mech protocol', async () => {
        const requestBody = {
          protocols: ['avoid-mech'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'mech', number: 1 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should process avoid-crossfire protocol', async () => {
        const requestBody = {
          protocols: ['avoid-crossfire'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 3 },
              allies: 2,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should process furthest-enemies protocol', async () => {
        const requestBody = {
          protocols: ['furthest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 3 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 10, y: 10 });
      });

      it('should process multiple protocols', async () => {
        const requestBody = {
          protocols: ['assist-allies', 'closest-enemies'],
          scan: [
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 5 },
              allies: 2,
            },
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 3 },
            },
            {
              coordinates: { x: 5, y: 5 },
              enemies: { type: 'soldier', number: 8 },
              allies: 1,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        // Should prioritize allies first, then closest among allies
        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should handle distance filtering', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 0, y: 150 },
              enemies: { type: 'soldier', number: 3 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        // Should only consider the point within 100m range
        expect(response.body).toEqual({ x: 0, y: 0 });
      });
    });

    describe('Error Cases - 400 Bad Request', () => {
      it('should return 400 for invalid enemy type', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'invalid-type', number: 5 },
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(400);
      });

      it('should return 400 for missing required fields', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              // Missing enemies field
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(400);
      });

      it('should return 400 for invalid coordinates', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 'invalid', y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(400);
      });

      it('should handle invalid protocol name gracefully', async () => {
        const requestBody = {
          protocols: ['invalid-protocol'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should handle empty protocols array', async () => {
        const requestBody = {
          protocols: [],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should return 404 for empty scan array', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [],
        };

        await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(404);
      });
    });

    describe('Error Cases - 404 Not Found', () => {
      it('should return 404 when all targets are filtered out by distance', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 150 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 0, y: 200 },
              enemies: { type: 'soldier', number: 3 },
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(404);
      });

      it('should return 404 when all targets are filtered out by protocols', async () => {
        const requestBody = {
          protocols: ['avoid-mech'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'mech', number: 5 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'mech', number: 3 },
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(404);
      });

      it('should return 404 when all targets are filtered out by avoid-crossfire', async () => {
        const requestBody = {
          protocols: ['avoid-crossfire'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
              allies: 2,
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 3 },
              allies: 1,
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(404);
      });
    });

    describe('Edge Cases', () => {
      it('should handle single scan point', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should handle points at exactly 100m distance', async () => {
        const requestBody = {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 100 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 3 },
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should handle points with zero allies', async () => {
        const requestBody = {
          protocols: ['assist-allies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 3 },
              allies: 0,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        // Both points should be treated as having no allies
        expect(response.body).toEqual({ x: 0, y: 0 });
      });

      it('should handle complex multi-protocol scenario', async () => {
        const requestBody = {
          protocols: ['prioritize-mech', 'assist-allies', 'closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 10 },
              allies: 2,
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'mech', number: 1 },
            },
            {
              coordinates: { x: 5, y: 5 },
              enemies: { type: 'mech', number: 2 },
              allies: 1,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/radar')
          .send(requestBody)
          .expect(201);

        // Should prioritize mech, then allies, then closest
        expect(response.body).toEqual({ x: 0, y: 0 });
      });
    });
  });
});
