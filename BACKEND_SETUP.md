# StudyForge Backend Setup Guide

## Overview
This guide will help you set up the complete backend infrastructure for StudyForge, including database, authentication, and API routes.

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud-hosted)
- npm or yarn package manager

## 1. Install Dependencies

All backend dependencies are already included in `package.json`. If you haven't installed them yet:

```bash
npm install
```

Key backend packages:
- `prisma` & `@prisma/client` - Database ORM
- `next-auth` - Authentication
- `@auth/prisma-adapter` - NextAuth Prisma adapter
- `bcryptjs` - Password hashing
- `zod` - Schema validation

## 2. Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE studyforge;
```

3. Update `.env` with your database URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/studyforge"
```

### Option B: Cloud Database (Recommended for Production)

Use one of these providers:
- **Vercel Postgres** (easiest for Vercel deployments)
- **Supabase** (free tier available)
- **Railway** (free tier available)
- **Neon** (serverless Postgres)

Get your connection string and add it to `.env`:
```env
DATABASE_URL="your-cloud-database-url"
```

## 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studyforge"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API (optional - for AI features)
OPENAI_API_KEY="your-openai-api-key"
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## 4. Initialize Prisma

Generate Prisma Client:
```bash
npx prisma generate
```

Push the schema to your database:
```bash
npx prisma db push
```

Or run migrations (recommended for production):
```bash
npx prisma migrate dev --name init
```

## 5. Prisma Studio (Optional)

View and manage your database with Prisma Studio:
```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555`

## 6. API Routes Structure

The backend includes the following API routes:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `GET /api/notes/[id]` - Get single note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Flashcards
- `GET /api/flashcards` - Get all flashcards
- `POST /api/flashcards` - Create flashcard set
- `GET /api/flashcards/[id]` - Get single flashcard set
- `PUT /api/flashcards/[id]` - Update flashcard set
- `DELETE /api/flashcards/[id]` - Delete flashcard set

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/[id]` - Get single quiz
- `PUT /api/quizzes/[id]` - Update quiz
- `DELETE /api/quizzes/[id]` - Delete quiz

### Study Rooms
- `GET /api/study-rooms` - Get all active rooms
- `POST /api/study-rooms` - Create room
- `POST /api/study-rooms/[id]/join` - Join room
- `POST /api/study-rooms/[id]/leave` - Leave room
- `GET /api/study-rooms/[id]/messages` - Get messages
- `POST /api/study-rooms/[id]/messages` - Send message

## 7. Database Schema

The database includes the following models:

- **User** - User accounts with authentication
- **Account** - OAuth accounts (Google, etc.)
- **Session** - User sessions
- **Note** - Study notes with content and metadata
- **Flashcard** - Flashcard sets with cards array
- **Quiz** - Quizzes with questions array
- **StudyRoom** - Collaborative study rooms
- **StudyRoomMember** - Room membership tracking
- **StudyRoomMessage** - Chat messages in rooms

## 8. Testing the Backend

### Test Authentication:
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Notes API (requires authentication):
```bash
# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"title":"Test Note","subject":"Math","content":"Test content","wordCount":2}'
```

## 9. Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` (optional)
   - `GOOGLE_CLIENT_SECRET` (optional)

4. Vercel will automatically:
   - Install dependencies
   - Build the Next.js app
   - Deploy to production

### Database Migrations on Vercel

Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## 10. Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong NEXTAUTH_SECRET** - Generate with OpenSSL
3. **Enable HTTPS in production** - Vercel does this automatically
4. **Validate all inputs** - We use Zod for validation
5. **Rate limiting** - Consider adding rate limiting for API routes
6. **CORS configuration** - Configure for your domain only

## 11. Monitoring & Logging

- Use Vercel Analytics for monitoring
- Check Vercel logs for errors
- Use Prisma Studio to inspect database
- Add error tracking (Sentry, LogRocket, etc.)

## 12. Next Steps

- [ ] Set up Google OAuth (optional)
- [ ] Integrate OpenAI for AI-powered features
- [ ] Add WebSocket support for real-time features
- [ ] Implement file upload for PDFs
- [ ] Add email verification
- [ ] Set up automated backups

## Troubleshooting

### Prisma Client Not Found
```bash
npx prisma generate
```

### Database Connection Error
- Check DATABASE_URL in `.env`
- Ensure database is running
- Verify network connectivity

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Prisma documentation](https://www.prisma.io/docs)
- See [NextAuth.js documentation](https://next-auth.js.org)