# Auth Testing — One Stock Academy admin

## MongoDB
- Enrollments: `db.enrollments.find()` in database from DB_NAME (test_database).
- No users collection — single admin via ADMIN_PASSWORD env var (no registration).

## API
```
API=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
# wrong password → 401 {"detail":"Invalid password"}
curl -X POST "$API/api/admin/login" -H "Content-Type: application/json" -d '{"password":"wrong"}'
# correct → {"token": "..."}
TOKEN=$(curl -s -X POST "$API/api/admin/login" -H "Content-Type: application/json" -d '{"password":"OneStock@Admin2026"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")
# list enrollments
curl -s "$API/api/admin/enrollments" -H "Authorization: Bearer $TOKEN"
# no token → 401 {"detail":"Not authenticated"}
curl -s "$API/api/admin/enrollments"
```

## Frontend
/admin → login form → password → table of enrollments. Token in sessionStorage key `osa_admin`.
