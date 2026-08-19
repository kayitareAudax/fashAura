# FashAura API

FastAPI + MongoDB (Motor) + Cloudinary backend for the FashAura app. No ML/recommendation
logic is included yet — endpoints here are plain CRUD + auth, meant as the foundation
for that layer to be added later.

## Structure

Each resource is split into three parallel files:

```
app/
  main.py                 # app assembly, CORS, lifespan (DB connect/disconnect)
  dependencies.py         # get_current_user (JWT bearer auth guard)
  core/
    config.py             # env-driven settings
    database.py           # Motor client, get_database(), indexes
    security.py           # password hashing, JWT create/decode
  models/                 # <resource>.py -> Pydantic request/response schemas
    common.py             # PyObjectId, to_object_id() shared helpers
    user.py / cloth.py / outfit.py / product.py / auth.py
  services/                # <resource>_service.py -> DB reads/writes, business rules
    user_service.py / cloth_service.py / outfit_service.py / product_service.py
    cloudinary_service.py  # shared image upload/delete helper
  routers/                 # <resource>.py -> HTTP endpoints, wire dependencies to services
    auth.py / users.py / clothes.py / outfits.py / products.py
```

## Setup

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — your connection string (Atlas or self-hosted)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `JWT_SECRET_KEY` — generate with `python -c "import secrets; print(secrets.token_hex(32))"`

Run it:

```bash
uvicorn app.main:app --reload
```

Interactive docs at `http://127.0.0.1:8000/docs`.

## Resources & endpoints

All endpoints except `/auth/register`, `/auth/login`, and `/health` require
`Authorization: Bearer <token>`, obtained from `/auth/login`.

**Auth** (`/auth`)
- `POST /auth/register` — create account
- `POST /auth/login` — OAuth2 password flow (`username` = email); returns a bearer token

**Users** (`/users`)
- `GET /users/me`, `PATCH /users/me` — profile
- `PATCH /users/me/preferences` — dark mode, temperature unit, WhatsApp notification
  settings, AI-learning opt-in, etc. (all the toggles on the Profile screen)
- `GET /users/me/stats` — items / looks / avg rating / streak, computed from the
  clothes & outfits collections

**Clothes** (`/clothes`) — wardrobe items
- `POST /clothes` — multipart form (metadata fields + `image` file) → uploads to
  Cloudinary, creates the item
- `GET /clothes?category=&weather=` — list, filterable
- `GET /clothes/stats` — counts by weather suitability + category (Wardrobe screen's stat row)
- `GET /clothes/{id}`, `PATCH /clothes/{id}` (multipart, all fields incl. image optional),
  `DELETE /clothes/{id}` (also removes the Cloudinary asset)
- `POST /clothes/{id}/wear` — bump the wear counter

**Outfits** (`/outfits`) — logged/history looks
- `POST /outfits` — log an outfit from existing cloth ids (defaults to today)
- `GET /outfits?range=day|week|month|all` — history list
- `GET /outfits/today` — today's outfit, or `null`
- `GET /outfits/stats` — avg rating / total looks / most-worn piece
- `GET /outfits/{id}`, `PATCH /outfits/{id}` (rating, note, occasion, liked, saved),
  `DELETE /outfits/{id}`
- `POST /outfits/{id}/rewear` — logs a new entry for today reusing that outfit's
  pieces and bumps their wear counts

**Products** (`/products`) — store catalog
- `POST /products` — add a catalog item (`match_score` is a plain settable field for
  now, meant to be replaced by a real recommendation later)
- `GET /products?trending=&is_new=&saved_only=` — list/filter (backs the Store
  screen's tabs)
- `GET /products/{id}`, `PATCH /products/{id}`, `DELETE /products/{id}`
- `POST /products/{id}/save`, `DELETE /products/{id}/save` — favorite/unfavorite

## Notes

- IDs are returned as plain strings under `id` (not Mongo's `_id`).
- Every resource is scoped to the authenticated user except the product catalog,
  which is shared; only each user's saved/favorite state is personal.
- This was verified end-to-end against a local throwaway MongoDB instance
  (register → login → CRUD → save/unsave → rewear → stats) before delivery.
