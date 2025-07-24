const BACKEND_URL = 'https://foliumbackend-production.up.railway.app';

async function postData(endpoint, data) {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include', // para cookies/session
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || json.message || 'Erro desconhecido');
  }

  return json;
}

export async function login(email, password, rememberMe) {
  return postData('/api/auth/login', { email, password, rememberMe });
}

export async function confirmCode(code) {
  return postData('/api/auth/confirm', { code });
}

export async function logout() {
  return postData('/api/auth/logout', {});
}

export async function register(name, email, password, confipassword) {
  return postData('/api/auth/register', { name, email, password, confipassword });
}

