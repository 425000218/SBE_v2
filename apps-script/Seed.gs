function seedSampleData() {
  const ss = openSpreadsheet();

  const usersSheet = getOrCreateSheet_(ss, 'users');
  const devicesSheet = getOrCreateSheet_(ss, 'devices');
  const txSheet = getOrCreateSheet_(ss, 'borrow_transactions');
  const maintenanceSheet = getOrCreateSheet_(ss, 'maintenance_logs');

  setHeaders_(usersSheet, [
    'user_id', 'email', 'password_hash', 'full_name', 'role', 'class_name', 'phone', 'status', 'created_at', 'updated_at'
  ]);

  setHeaders_(devicesSheet, [
    'device_id', 'device_code', 'device_name', 'category', 'location', 'status', 'image_url', 'description', 'updated_at'
  ]);

  setHeaders_(txSheet, [
    'transaction_id', 'user_id', 'device_id', 'borrowed_at', 'due_at', 'returned_at', 'status', 'note', 'created_at', 'updated_at'
  ]);

  setHeaders_(maintenanceSheet, [
    'maintenance_id', 'device_id', 'type', 'scheduled_at', 'completed_at', 'status', 'note', 'created_at'
  ]);

  clearDataKeepHeader_(usersSheet);
  clearDataKeepHeader_(devicesSheet);
  clearDataKeepHeader_(txSheet);
  clearDataKeepHeader_(maintenanceSheet);

  const nowIso = new Date().toISOString();

  usersSheet.appendRow([
    'USR-001',
    'user@school.edu',
    sha256Hex('123456'),
    'Nguyễn Văn A',
    'student',
    '10A1',
    '0900000001',
    'active',
    nowIso,
    nowIso
  ]);

  const sampleDevices = [
    ['DEV-001', 'EQ-001', 'Máy Chiếu Epson EB-X06', 'Máy chiếu', 'PH101', 'available', '../image/figma/recent-1.png', 'Máy chiếu dùng cho lớp học', nowIso],
    ['DEV-002', 'EQ-002', 'Laptop Dell XPS 2021', 'Laptop', 'PH102', 'borrowed', '../image/figma/recent-4.png', 'Laptop phục vụ thực hành', nowIso],
    ['DEV-003', 'EQ-003', 'Màn Hình Dell S2423', 'Màn hình', 'PH102', 'available', '../image/figma/recent-5.png', 'Màn hình phụ trợ', nowIso],
    ['DEV-004', 'EQ-004', 'Nhiệt Kế 100 Độ', 'Thiết bị thí nghiệm', 'LAB-HOA', 'available', '../image/figma/recent-2.png', 'Thiết bị thí nghiệm hóa học', nowIso],
    ['DEV-005', 'EQ-005', 'Bộ Lực Kế', 'Thiết bị thí nghiệm', 'LAB-LY', 'maintenance', '../image/figma/recent-6.png', 'Đang bảo trì định kỳ', nowIso],
    ['DEV-006', 'EQ-006', 'Thước Đo Độ', 'Thiết bị thí nghiệm', 'LAB-LY', 'available', '../image/figma/recent-3.png', 'Dụng cụ đo góc', nowIso],
    ['DEV-007', 'EQ-007', 'Địa Cầu Để Bàn', 'Mô hình', 'PH201', 'available', '../image/figma/recent-8.png', 'Mô hình địa lý', nowIso],
    ['DEV-008', 'EQ-008', 'Mô Phỏng RNA', 'Mô hình', 'LAB-SINH', 'available', '../image/figma/recent-9.png', 'Mô hình sinh học', nowIso],
    ['DEV-009', 'EQ-009', 'Bảng Demo Mẫu Kim Loại', 'Thiết bị demo', 'LAB-HOA', 'available', '../image/figma/recent-7.png', 'Bảng mẫu kim loại', nowIso],
    ['DEV-010', 'EQ-010', 'Cân Shimadzu B322', 'Thiết bị đo', 'LAB-HOA', 'available', '../image/figma/recent-1.png', 'Cân điện tử', nowIso]
  ];

  devicesSheet.getRange(2, 1, sampleDevices.length, sampleDevices[0].length).setValues(sampleDevices);

  SpreadsheetApp.flush();
  Logger.log('Seed completed successfully.');
}

function getOrCreateSheet_(ss, name) {
  const found = ss.getSheetByName(name);
  return found || ss.insertSheet(name);
}

function setHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }
  const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
  const same = headers.every((h, i) => String(current[i] || '').trim() === h);
  if (!same) {
    sheet.clearContents();
    sheet.appendRow(headers);
  }
}

function clearDataKeepHeader_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow > 1 && lastCol > 0) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  }
}
