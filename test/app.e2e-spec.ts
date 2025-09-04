import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Notebooks (e2e)', () => {
  let app: INestApplication<App>;

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

  it('/notebook (GET) debe devolver un listado de notebooks', async () => {
    //return request(app.getHttpServer())
    const res = await request(app.getHttpServer())
      .get('/notebooks')
      .expect(200);

    // Valido que la respuesta sea un array
    expect(Array.isArray(res.body)).toBe(true);

    // Valido que al menos tenga un registro
    expect(res.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String)
      }),
    );
  });
});
