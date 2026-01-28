import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/database';

beforeAll(() => {
  db.prepare(`
      INSERT INTO medicines (
        name,
        manufacturer,
        active_principle,
        requires_prescription,
        price,
        stock
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
    'Dipirona',
    'Farmácia Teste',
    'Dipirona',
    0,
    12.5,
    100
  );
});

afterAll(() => {
  // limpa tabela após testes
  db.prepare('DELETE FROM medicines').run();
});

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

describe('GET /farma-project/medicines', () => {

  it('deve listar todos os medicamentos', async () => {
    const response = await request(app)
      .get('/farma-project/medicines');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('stock');
  });

  it('deve buscar medicamento por id', async () => {
    const medicine = db.prepare(`
      SELECT id FROM medicines LIMIT 1
    `).get() as { id: number };

    const response = await request(app)
      .get(`/farma-project/medicines/${medicine.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', medicine.id);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');
    expect(response.body).toHaveProperty('requiresPrescription');
  });

  it('deve retornar 404 se medicamento não existir', async () => {
    const response = await request(app)
      .get('/farma-project/medicines/999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});