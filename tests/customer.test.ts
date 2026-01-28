import request from 'supertest';
import app from '../src/app.js';

describe('POST /farma-project/customer', () => {
  it('deve cadastrar um cliente', async () => {
    const response = await request(app)
      .post('/farma-project/customer')
      .send({
        name: 'Marcos Silva',
        cpf: '12345678901',
        birthDate: '1990-01-01' 
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});