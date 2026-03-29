# Google Sheet Schema - SEB

## 1) Overview
Use one spreadsheet with these sheets:
- `users`
- `devices`
- `borrow_transactions`
- `maintenance_logs`

All IDs should be unique strings (UUID or prefixed IDs).
Date-time format should be ISO string, example: `2026-03-29T08:30:00.000Z`.

## 2) users
Columns (exact order):
1. `user_id`
2. `email`
3. `password_hash`
4. `full_name`
5. `role` (student|teacher|admin)
6. `class_name`
7. `phone`
8. `status` (active|inactive)
9. `created_at`
10. `updated_at`

Indexes/constraints (manual rules):
- `email` must be unique.
- `status=active` for valid login.

## 3) devices
Columns (exact order):
1. `device_id`
2. `device_code`
3. `device_name`
4. `category`
5. `location`
6. `status` (available|borrowed|maintenance|broken)
7. `image_url`
8. `description`
9. `updated_at`

Indexes/constraints:
- `device_code` unique.
- `status` controls borrow availability.

## 4) borrow_transactions
Columns (exact order):
1. `transaction_id`
2. `user_id`
3. `device_id`
4. `borrowed_at`
5. `due_at`
6. `returned_at`
7. `status` (borrowed|returned|overdue|cancelled)
8. `note`
9. `created_at`
10. `updated_at`

Rules:
- One `borrowed` record means device is currently on loan.
- Return flow sets `returned_at` and `status=returned`.

## 5) maintenance_logs
Columns (exact order):
1. `maintenance_id`
2. `device_id`
3. `type` (periodic|repair|replace)
4. `scheduled_at`
5. `completed_at`
6. `status` (planned|in_progress|done)
7. `note`
8. `created_at`

## 6) Seed Data (minimum)
- users: 1 demo user (email: `user@school.edu`, password hash for `123456`)
- devices: at least 10 rows with mixed statuses

## 7) API Mapping
- Login reads `users`
- Device list reads `devices`
- Borrow creates row in `borrow_transactions` + updates `devices.status`
- Return updates `borrow_transactions` + updates `devices.status`
