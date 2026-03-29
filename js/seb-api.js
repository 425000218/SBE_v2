(() => {
  const BASE = (window.SEB_API_BASE || '').trim();

  async function request(method, payload = {}, query = {}) {
    if (!BASE) {
      throw new Error('missing_api_base');
    }

    let url = BASE;
    const queryParams = new URLSearchParams(query).toString();
    if (queryParams) {
      url += (BASE.includes('?') ? '&' : '?') + queryParams;
    }

    const res = await fetch(url, {
      method,
      headers: {
        // Apps Script Web App works more reliably cross-origin with simple POST requests.
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: method === 'GET' ? undefined : JSON.stringify(payload),
    });

    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error || 'api_error');
    }
    return json.data;
  }

  const SEBApi = {
    isConfigured() {
      return !!BASE;
    },

    async login(email, password) {
      return request('POST', {
        action: 'login',
        email,
        password,
      });
    },

    async listDevices() {
      return request('GET', {}, { action: 'devices' });
    },

    async borrowDevice(userId, deviceId, dueAt) {
      return request('POST', {
        action: 'borrow',
        userId,
        deviceId,
        dueAt,
      });
    },

    async returnDevice(transactionId) {
      return request('POST', {
        action: 'return',
        transactionId,
      });
    },

    async listMyBorrows(userId) {
      return request('GET', {}, { action: 'myBorrows', userId });
    },
  };

  window.SEBApi = SEBApi;
})();
