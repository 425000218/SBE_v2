const SHEETS = {
  users: 'users',
  devices: 'devices',
  transactions: 'borrow_transactions',
};

function doGet(e) {
  try {
    const action = (e.parameter.action || '').trim();

    if (action === 'devices') {
      return jsonResponse({ ok: true, data: listDevices() });
    }

    if (action === 'myBorrows') {
      const userId = (e.parameter.userId || '').trim();
      if (!userId) return jsonResponse({ ok: false, error: 'missing_user_id' }, 400);
      return jsonResponse({ ok: true, data: listMyBorrows(userId) });
    }

    return jsonResponse({ ok: false, error: 'unknown_action' }, 400);
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || String(error) }, 500);
  }
}

function doPost(e) {
  try {
    const body = parseBody(e);
    const action = (body.action || '').trim();

    if (action === 'login') {
      const email = (body.email || '').trim().toLowerCase();
      const password = (body.password || '').trim();
      if (!email || !password) return jsonResponse({ ok: false, error: 'missing_credentials' }, 400);
      const result = login(email, password);
      if (!result) return jsonResponse({ ok: false, error: 'invalid_credentials' }, 401);
      return jsonResponse({ ok: true, data: result });
    }

    if (action === 'borrow') {
      const userId = (body.userId || '').trim();
      const deviceId = (body.deviceId || '').trim();
      const dueAt = (body.dueAt || '').trim();
      if (!userId || !deviceId) return jsonResponse({ ok: false, error: 'missing_fields' }, 400);
      const tx = borrowDevice({ userId, deviceId, dueAt });
      return jsonResponse({ ok: true, data: tx });
    }

    if (action === 'return') {
      const transactionId = (body.transactionId || '').trim();
      if (!transactionId) return jsonResponse({ ok: false, error: 'missing_transaction_id' }, 400);
      const tx = returnDevice(transactionId);
      return jsonResponse({ ok: true, data: tx });
    }

    return jsonResponse({ ok: false, error: 'unknown_action' }, 400);
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || String(error) }, 500);
  }
}

function login(email, password) {
  const rows = getRows(SHEETS.users);
  const user = rows.find(r =>
    String(r.email || '').toLowerCase() === email &&
    String(r.status || 'active') === 'active'
  );

  if (!user) return null;

  const inputHash = sha256Hex(password);
  if (String(user.password_hash || '') !== inputHash) return null;

  return {
    user_id: user.user_id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    class_name: user.class_name,
  };
}

function listDevices() {
  const rows = getRows(SHEETS.devices);
  return rows.map(r => ({
    device_id: r.device_id,
    device_code: r.device_code,
    device_name: r.device_name,
    category: r.category,
    location: r.location,
    status: r.status,
    image_url: r.image_url,
    description: r.description,
  }));
}

function listMyBorrows(userId) {
  const txRows = getRows(SHEETS.transactions)
    .filter(r => String(r.user_id) === userId)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const devices = toMapById(getRows(SHEETS.devices), 'device_id');

  return txRows.map(tx => ({
    transaction_id: tx.transaction_id,
    device_id: tx.device_id,
    device_name: devices[tx.device_id] ? devices[tx.device_id].device_name : '',
    device_code: devices[tx.device_id] ? devices[tx.device_id].device_code : '',
    borrowed_at: tx.borrowed_at,
    due_at: tx.due_at,
    returned_at: tx.returned_at,
    status: tx.status,
    note: tx.note,
  }));
}

function borrowDevice(payload) {
  const ss = openSpreadsheet();
  const devicesSheet = ss.getSheetByName(SHEETS.devices);
  const txSheet = ss.getSheetByName(SHEETS.transactions);

  const devices = getRows(SHEETS.devices);
  const device = devices.find(r => String(r.device_id) === payload.deviceId);
  if (!device) throw new Error('device_not_found');
  if (String(device.status) !== 'available') throw new Error('device_not_available');

  const nowIso = new Date().toISOString();
  const txId = 'TX-' + Utilities.getUuid();
  const dueAt = payload.dueAt || '';

  appendRowByHeaders(txSheet, {
    transaction_id: txId,
    user_id: payload.userId,
    device_id: payload.deviceId,
    borrowed_at: nowIso,
    due_at: dueAt,
    returned_at: '',
    status: 'borrowed',
    note: '',
    created_at: nowIso,
    updated_at: nowIso,
  });

  updateRowByKey(devicesSheet, 'device_id', payload.deviceId, {
    status: 'borrowed',
    updated_at: nowIso,
  });

  return {
    transaction_id: txId,
    user_id: payload.userId,
    device_id: payload.deviceId,
    status: 'borrowed',
    borrowed_at: nowIso,
    due_at: dueAt,
  };
}

function returnDevice(transactionId) {
  const ss = openSpreadsheet();
  const txSheet = ss.getSheetByName(SHEETS.transactions);

  const txRows = getRows(SHEETS.transactions);
  const tx = txRows.find(r => String(r.transaction_id) === transactionId);
  if (!tx) throw new Error('transaction_not_found');
  if (String(tx.status) !== 'borrowed') throw new Error('transaction_not_borrowed');

  const nowIso = new Date().toISOString();

  updateRowByKey(txSheet, 'transaction_id', transactionId, {
    returned_at: nowIso,
    status: 'returned',
    updated_at: nowIso,
  });

  const devicesSheet = ss.getSheetByName(SHEETS.devices);
  updateRowByKey(devicesSheet, 'device_id', String(tx.device_id), {
    status: 'available',
    updated_at: nowIso,
  });

  return {
    transaction_id: transactionId,
    returned_at: nowIso,
    status: 'returned',
  };
}

function openSpreadsheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('missing_SPREADSHEET_ID_script_property');
  return SpreadsheetApp.openById(spreadsheetId);
}

function getRows(sheetName) {
  const sheet = openSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('missing_sheet_' + sheetName);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(v => String(v).trim());
  return values.slice(1).map(row => rowToObject(headers, row));
}

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = row[i];
  });
  return obj;
}

function appendRowByHeaders(sheet, obj) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(v => String(v).trim());
  const row = headers.map(h => obj[h] !== undefined ? obj[h] : '');
  sheet.appendRow(row);
}

function updateRowByKey(sheet, keyColumn, keyValue, patch) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0].map(v => String(v).trim());

  const keyIdx = headers.indexOf(keyColumn);
  if (keyIdx < 0) throw new Error('missing_key_column_' + keyColumn);

  const rowIndex = values.findIndex((row, idx) => idx > 0 && String(row[keyIdx]) === String(keyValue));
  if (rowIndex < 0) throw new Error('row_not_found_' + keyValue);

  Object.keys(patch).forEach(k => {
    const idx = headers.indexOf(k);
    if (idx >= 0) {
      sheet.getRange(rowIndex + 1, idx + 1).setValue(patch[k]);
    }
  });
}

function toMapById(rows, idKey) {
  const map = {};
  rows.forEach(r => {
    map[String(r[idKey])] = r;
  });
  return map;
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents || '{}');
}

function jsonResponse(payload, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  // Apps Script web app does not support custom status code directly in ContentService.
  // Keep status in body for frontend handling.
  if (statusCode) {
    payload.statusCode = statusCode;
  }
  return output;
}

function sha256Hex(input) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
  return digest.map(function(b) {
    const v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}
