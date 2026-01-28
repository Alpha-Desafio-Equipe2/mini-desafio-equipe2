import request from 'supertest';
import app from '../src/app';

describe('POST /farma-project/medicine', () => {
  it('deve cadastrar um medicamento', async () => {
    const response = await request(app)
      .post('/farma-project/medicines')
      .send({
        name: 'Dipirona',
        manufacturer: 'EMS',
        active_principle: 'Dipirona',
        requires_prescription: 0,
        price: 12.5,
        stock: 20
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
