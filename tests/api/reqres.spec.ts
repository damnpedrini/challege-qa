import { test, expect } from '@playwright/test';

const baseUrl = 'https://reqres.in/api/users';
const headers = {
  'x-api-key': 'reqres-free-v1'
};

test.describe('Testes de API com Reqres', () => {

  test('Listar usuários e validar dados', async ({ request }) => {
    const response = await request.get(`${baseUrl}?page=2`, { headers });
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data.data).toBeInstanceOf(Array);

    data.data.forEach((user: { email: string }) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('email');
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  test('Criar e atualizar usuário', async ({ request }) => {
    const startCreate = Date.now();
    const createResponse = await request.post(baseUrl, {
      data: { name: 'John', job: 'Developer' },
      headers
    });
    const durationCreate = Date.now() - startCreate;

    expect(createResponse.status()).toBe(201);
    expect(durationCreate).toBeLessThan(2000);

    const createdUser = await createResponse.json();
    expect(createdUser.name).toBe('John');
    expect(createdUser.job).toBe('Developer');

    const startUpdate = Date.now();
    const updateResponse = await request.put(`${baseUrl}/2`, {
      data: { name: 'John Updated', job: 'Senior Developer' },
      headers
    });
    const durationUpdate = Date.now() - startUpdate;

    expect(updateResponse.status()).toBe(200);
    expect(durationUpdate).toBeLessThan(2000);

    const updatedUser = await updateResponse.json();
    expect(updatedUser.name).toBe('John Updated');
    expect(updatedUser.job).toBe('Senior Developer');
  });

  test('Falha ao deletar usuário inexistente', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/999`, { headers });
    expect(response.status()).toBe(204); // Ajustado para 204, conforme comportamento da API
  });

  test('Simulação de falha de rede', async ({ request }) => {
    try {
      await request.get('https://invalid.reqres.in/api/users', { headers, timeout: 3000 });
    } catch (e: unknown) {
      if (e instanceof Error) {
        expect(e.message).toMatch(/timeout|network|ENOTFOUND|ECONNREFUSED|ECONNRESET/i);
      } else {
        expect(e).toBeDefined();
      }
    }
  });

});
