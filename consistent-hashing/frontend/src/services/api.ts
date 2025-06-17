const BASE = 'http://localhost:3001/api';

export const addServer = (id: string) => fetch(`${BASE}/servers`, {
  method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id })
});

export const removeServer = (id: string) => fetch(`${BASE}/servers/${id}`, { method: 'DELETE' });

export const addKey = (key: string) => fetch(`${BASE}/keys`, {
  method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ key })
});

export const fetchState = () => fetch(`${BASE}/state`).then(res => res.json());
