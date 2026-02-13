# Star Auto - Django + Next.js Vercel Deployment

This is a full-stack car dealership application with a Django backend and Next.js frontend, optimized for deployment to Vercel.

## Project Structure

```
star-auto/
├── backend/                 # Django REST API
│   ├── api/                # Django app with models, views, serializers
│   ├── starauto/           # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── vercel.json         # Vercel config for backend
│
└── frontend/               # Next.js Frontend
    ├── src/
    │   ├── app/            # Next.js App Router pages
    │   ├── components/     # React components
    │   ├── context/        # Auth context
    │   └── services/       # API service
    ├── package.json
    └── vercel.json         # Vercel config for frontend
```

## Deployment to Vercel

### Option 1: Two Separate Deployments (Recommended)

Deploy both backend and frontend as separate Vercel projects:

#### Backend (Django API)

1. Create a new project on Vercel from Git
2. Import the `backend/` directory
3. Configure:
   - Framework Preset: Python
   - Build Command: Leave empty or use `pip install -r requirements.txt`
   - Output Directory: Leave empty
4. Add Environment Variables:
   - `DJANGO_SECRET_KEY`: Generate a secure key
   - `DEBUG`: `False`
   - `PYTHONPATH`: `starauto`
5. Deploy

#### Frontend (Next.js)

1. Create a new project on Vercel from Git
2. Import the `frontend/` directory
3. Configure:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Django API URL (e.g., `https://your-backend.vercel.app/api`)
5. Deploy

### Option 2: Monorepo Deployment

If you want to deploy from a single repository:

1. Create `vercel.json` in root:
```json
{
  "projects": [
    { "name": "star-auto-backend", "path": "backend" },
    { "name": "star-auto-frontend", "path": "frontend" }
  ]
}
```

2. Deploy each project separately on Vercel

## Local Development

### Backend (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed data (optional)
python manage.py seeddata

# Run server
python manage.py runserver
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your API URL

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `GET /api/auth/me/` - Get current user
- `PUT /api/auth/profile/` - Update profile
- `POST /api/auth/password/` - Change password

### Cars
- `GET /api/cars/` - List cars (with filters)
- `GET /api/cars/{id}/` - Get car details
- `POST /api/cars/` - Create car (admin only)
- `PUT /api/cars/{id}/` - Update car (admin only)
- `DELETE /api/cars/{id}/` - Delete car (admin only)

### Favorites
- `GET /api/favorites/` - Get user favorites
- `POST /api/favorites/{car_id}/` - Add to favorites
- `DELETE /api/favorites/{car_id}/` - Remove from favorites

### Messages
- `POST /api/messages/` - Contact form
- `GET /api/messages/` - Admin: list messages

### Admin
- `GET /api/admin/stats/` - Dashboard stats
- `GET /api/admin/users/` - List users
- `PUT /api/admin/users/{id}/` - Update user

## Default Admin Credentials

After running `python manage.py seeddata`:
- Email: `admin@starauto.com`
- Password: `admin123`

## Tech Stack

- **Backend**: Django 4.2, Django REST Framework, SimpleJWT
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Deployment**: Vercel
