import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health (ou /api/health) retourne 200 et un payload JSON', async () => {
    const server = app.getHttpServer();

    const candidates = ['/health', '/api/health'];
    let ok = false;
    let res: request.Response | undefined;

    for (const path of candidates) {
      const r = await request(server).get(path);
      if (r.status === 200) {
        ok = true;
        res = r;
        break;
      }
    }

    expect(ok).toBe(true);
    expect(res?.body).toHaveProperty('status');
    expect(res?.body).toHaveProperty('db');
  });
});