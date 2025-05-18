import * as request from 'supertest';
import { server } from './setup';

describe(`UrlController e2e tests`, () => {
  describe(`POST /url`, () => {
    //Cle api invalide
    it(`devrait renvoyer 401 si aucune clé api est fournie`, async () => {
      await request(server).post('/url').expect(401);
    });

    it(`devrait renvoyer 401 si une clé api non valide est fournie`, async () => {
      await request(server)
        .post('/url')
        .set(`x-api-key`, `INVALID`)
        .expect(401);
    });

    it(`devrait renvoyer 400 si le DTO est non valide`, async () => {
      await request(server).post('/url').set(`x-api-key`, `SECRET`).expect(400);
    });

    it(`devrait renvoyer 400 si lurl n'est pas valide`, async () => {
      await request(server)
        .post('/url')
        .send({
          redirect: 'invalid',
          title: 'test',
          description: 'test',
        })
        .set(`x-api-key`, `SECRET`)
        .expect(400);
    });

    it(`devrait renvoyer 201 si api key et DTO sont valides`, async () => {
      await request(server)
        .post('/url')
        .send({
          redirect: 'https://www.google.com',
          title: 'test',
          description: 'test',
        })
        .set(`x-api-key`, `SECRET`)
        .expect(201)
        .expect(({ body }) => {
          const { data } = body;
          expect(data.redirect).toEqual('https://www.google.com');
          expect(data.title).toEqual('test');
          expect(data.description).toEqual('test');
          expect(data).toHaveProperty('url');
          expect(data).toHaveProperty('id');
          expect(data).toHaveProperty('createdAt');
          expect(data).toHaveProperty('updatedAt');
        });
    });
  });
});
