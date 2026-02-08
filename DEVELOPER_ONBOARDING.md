# The GameOn Co. - Developer Onboarding Guide

> **Welcome!** This guide explains The GameOn Co. project in simple, clear terms. Perfect for new developers joining the team.

---

## 🎯 What Is This Project?

**The GameOn Co.** is LinkedIn for sports professionals. It's a web platform where:

- **Athletes** create profiles, showcase stats, and get discovered by scouts
- **Coaches** search for talent, organize trials, and recruit players
- **Academies** manage teams, host events, and find new athletes

Think of it as a professional network specifically built for the sports industry.

---

## 🤔 Why Does This Project Exist?

### The Problem

- Athletes struggle to get discovered beyond local networks
- Coaches waste time manually searching for talent
- Sports organizations lack professional recruitment tools
- No centralized platform for verified sports professionals

### Our Solution

A professional networking platform that:

- Verifies athlete stats and achievements
- Provides advanced search and filtering for scouts
- Hosts trials, tournaments, and training camps
- Creates a social feed for sports professionals
- Connects verified users in a trusted network

---

## 🏗️ How Is This Built? (Tech Stack)

### Simple Overview

We're using a **modern web stack** that keeps everything in one codebase:

```
Frontend (What users see) → Next.js + React + Tailwind CSS
Backend (API + Logic)      → Next.js API Routes
Database (Data storage)    → PostgreSQL + Prisma
Authentication (Login)     → NextAuth.js
```

### Why These Tools?

**Next.js 14**: All-in-one framework - frontend, backend, and routing in one place  
**TypeScript**: Catches errors before they happen  
**Tailwind CSS**: Fast styling with utility classes  
**Prisma**: Makes database queries simple and type-safe  
**PostgreSQL**: Reliable database for complex data relationships  
**NextAuth**: Secure authentication without reinventing the wheel

---

## 📂 Project Structure (Simplified)

```
gameon_co/
├── prisma/
│   └── schema.prisma          ← Database structure (all tables defined here)
│
├── public/
│   └── images/                ← Static files (logos, backgrounds, etc.)
│
├── src/
│   ├── app/                   ← PAGES & ROUTES
│   │   ├── page.tsx           ← Landing page (/)
│   │   ├── login/             ← Login page (/login)
│   │   ├── signup/            ← Signup page (/signup)
│   │   ├── dashboard/         ← Main dashboard (/dashboard)
│   │   ├── feed/              ← Social feed (/feed)
│   │   ├── events/            ← Events listing (/events)
│   │   ├── profile/           ← User profiles (/profile)
│   │   ├── search/            ← Search page (/search)
│   │   └── api/               ← API ENDPOINTS (backend logic)
│   │       ├── auth/          ← Authentication API
│   │       ├── feed/          ← Feed & posts API
│   │       ├── events/        ← Events API
│   │       ├── search/        ← Search API
│   │       └── ... (13 API folders total)
│   │
│   ├── components/            ← REUSABLE UI COMPONENTS
│   │   ├── auth/              ← Login/signup forms
│   │   ├── feed/              ← Post cards, like buttons
│   │   ├── events/            ← Event cards, application forms
│   │   ├── profile/           ← Profile displays
│   │   └── shared/            ← Buttons, cards, modals (used everywhere)
│   │
│   ├── lib/                   ← HELPER CODE & UTILITIES
│   │   ├── prisma.ts          ← Database connection
│   │   ├── auth/              ← Authentication helpers
│   │   ├── utils/             ← Utility functions
│   │   └── validation/        ← Form validation rules
│   │
│   ├── types/                 ← TypeScript type definitions
│   ├── middleware.ts          ← Route protection (login required)
│   └── styles/                ← Global CSS
│
├── .env.local                 ← Environment variables (secrets)
├── package.json               ← Dependencies list
└── tailwind.config.js         ← Design system config
```

### Key Principle

- **`app/` folder** = All pages and API routes (Next.js App Router)
- **`components/` folder** = Reusable UI pieces
- **`lib/` folder** = Business logic and helpers
- **`prisma/` folder** = Database structure

---

## 🗄️ Database Structure (Simplified)

### Core Tables (The Main Players)

#### 1. **User** - The Foundation

Every person on the platform. Contains:

- Email, password (hashed), name
- Role: ATHLETE, COACH, ACADEMY, or ADMIN
- Status: PENDING, ACTIVE, VERIFIED
- Onboarding flag (completed sports preferences?)

#### 2. Role-Specific Profiles

Each user has ONE profile based on their role:

**AthleteProfile**

- Sports, positions, physical stats
- Achievements, match stats, past teams
- Verification documents

**CoachProfile**

- Specializations, qualifications
- Years of experience, coaching style
- Availability

**AcademyProfile**

- Organization details, sports offered
- Facilities, staff members
- Verification status

### Social & Networking Tables

**Connection** - Who follows who  
**Post** - User-generated content  
**Like** - Post likes  
**Comment** - Post comments  
**Notification** - In-app notifications

### Events & Applications

**Event** - Trials, tournaments, camps  
**EventApplication** - User applications to events

### Supporting Tables

**Achievement** - Athlete awards  
**MatchStat** - Game performance data  
**Certification** - Coach certifications  
**SearchPreference** - User preferences
**AuditLog** - System activity tracking

### Relationships Explained

```
User → can have 1 AthleteProfile OR 1 CoachProfile OR 1 AcademyProfile
User → can create many Posts
User → can apply to many Events
User → can have many Connections (both sent and received)
Post → can have many Likes and Comments
Event → can have many EventApplications
AthleteProfile → can have many Achievements, MatchStats, PastTeams
```

---

## 🔐 How Authentication Works

### Registration Flow

```
1. User visits /signup
2. Fills form: name, email, password, role (Athlete/Coach/Academy)
3. Password gets hashed with bcryptjs
4. User record created in database with status="PENDING"
5. User redirected to /sports-preferences
```

### Login Flow

```
1. User visits /login
2. Enters email + password
3. NextAuth checks credentials
4. If valid → create session (JWT token stored in cookie)
5. If onboarding incomplete → redirect to /sports-preferences
6. If onboarding complete → redirect to /dashboard
```

### How Routes Are Protected

**middleware.ts** checks EVERY request:

```typescript
// Pseudo-code explanation:
if (user trying to access protected route) {
  if (no login session) → redirect to landing page
  if (logged in but onboarding incomplete) → redirect to /sports-preferences
  if (logged in and onboarded) → allow access
}
```

**Protected routes** (login required):

- `/dashboard/*`
- `/profile/*`
- `/feed/*`
- `/events/*`
- `/search/*`

**Public routes** (anyone can access):

- `/` (landing page)
- `/login`
- `/signup`

---

## 🎨 How The Frontend Works

### Design System

**Layout**

- Everything centered in a 1280px max-width container
- 12-column responsive grid
- 8px spacing system (all margins/padding are multiples of 8)

**Colors**

- **GameOn Blue**: `#2563EB` (primary actions, links)
- **GameOn Dark**: `#0B1120` (dark mode background)
- Semantic colors for states (success, error, warning)

**Typography**

- Font: Inter (clean, professional)
- Responsive sizing using `clamp()` for smooth scaling

**Dark Mode**

- Full dark mode support on every page
- Toggle stored in user preferences

### Component Structure

**Pages** (in `app/` folder)

- Each folder = a route (e.g., `app/dashboard/page.tsx` → `/dashboard`)
- Use components from `components/` folder

**Reusable Components** (in `components/`)

- `Button`, `Card`, `Modal`, `Input`, `Select`, etc.
- Follow consistent styling patterns
- Support dark mode variants

---

## 🔄 Complete User Journey

### Step 1: Landing Page (`/`)

- Hero section with skiing background
- Feature highlights for Athletes, Coaches, Organizations
- "Get Started" CTA

### Step 2: Sign Up (`/signup`)

- User fills registration form
- Selects role (Athlete/Coach/Academy)
- Account created immediately (no email verification for MVP)

### Step 3: Sports Preferences (`/sports-preferences`)

**First-time setup** (required before using platform)

- User selects primary sport
- Optionally selects secondary sports
- Preferences saved to `user.interests` array
- `user.onboardingCompleted` set to `true`

### Step 4: Dashboard (`/dashboard`)

**Personalized homepage** showing:

- Feed posts filtered by:
  - User's selected sports
  - Followed users' posts
  - User's role (Athlete sees different content than Coach)
- Quick stats (connections, notifications)
- Recent events

### Step 5: Build Profile (`/profile`)

**Role-specific profile forms:**

- **Athletes**: Add stats, achievements, highlight videos, past teams
- **Coaches**: Add qualifications, specializations, availability
- **Academies**: Add facilities, staff, sports offered

### Step 6: Daily Usage

**Athletes:**

- Create posts with highlights and achievements
- Apply to events (trials, tournaments)
- Connect with coaches and scouts
- Track match stats

**Coaches:**

- Search athlete database with advanced filters
- Create events (tr ials, scouting events)
- Review applications
- Send connection requests to athletes

**Academies:**

- Create and manage events
- Review applications from athletes
- Manage organization profile
- Connect with potential recruits

---

## 🛣️ How Data Flows (Example: Applying to an Event)

Let's trace what happens when an athlete applies to a trial:

```
1. Athlete visits /events
   → Frontend calls GET /api/events
   → API queries database using Prisma
   → Returns list of events matching athlete's sport

2. Athlete clicks "Apply" on an event
   → Opens application modal (frontend component)
   → Athlete fills application form

3. Athlete submits application
   → Frontend sends POST /api/applications
   → Backend checks:
      ✓ Is user logged in?
      ✓ Is event still accepting applications?
      ✓ Has user already applied?
   → Creates EventApplication record in database
   → Creates Notification for event organizer
   → Returns success

4. Organizer gets notified
   → Notification appears in /dashboard
   → Organizer reviews application at /events/[id]/applications
   → Can change status: ACCEPTED, REJECTED, WAITLISTED

5. Athlete gets result notification
   → Status change triggers notification to athlete
   → Athlete sees update in notifications panel
```

---

## 🔌 API Structure (Backend)

### How API Routes Work

File structure = URL structure:

```
src/app/api/feed/route.ts        → /api/feed
src/app/api/events/route.ts      → /api/events
src/app/api/events/[id]/route.ts → /api/events/123
```

### Example API Endpoint

```typescript
// src/app/api/feed/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // 1. Get logged-in user from session
  const user = await getServerSession();

  // 2. Query database
  const posts = await prisma.post.findMany({
    where: {
      // Filter by user's sports preferences
      sportsTags: { hasSome: user.interests },
    },
    include: {
      author: true, // Include author details
      likes: true, // Include likes
      comments: true, // Include comments
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Return JSON response
  return Response.json({ posts });
}
```

### Available API Endpoints

| Endpoint                  | Methods            | Purpose                       |
| ------------------------- | ------------------ | ----------------------------- |
| `/api/auth/*`             | POST               | Login, signup, logout         |
| `/api/feed`               | GET, POST          | Get posts, create posts       |
| `/api/events`             | GET, POST          | List events, create events    |
| `/api/events/[id]`        | GET, PATCH, DELETE | Event details, update, delete |
| `/api/applications`       | GET, POST          | List/submit applications      |
| `/api/connections`        | GET, POST          | Manage connections            |
| `/api/search`             | GET                | Search athletes/coaches       |
| `/api/profiles`           | GET, PATCH         | Get/update user profiles      |
| `/api/sports-preferences` | POST               | Save sports preferences       |
| `/api/upload`             | POST               | Upload images/videos          |
| `/api/user`               | GET                | Get current user info         |

---

## 🧩 How Components Connect

### Example: Creating a Post

**Frontend Flow:**

```
FeedPage (/feed)
  └─ CreatePostForm (component)
      └─ User types content
      └─ User uploads images
      └─ Clicks "Post"
      └─ Calls API: POST /api/feed
          └─ API validates data
          └─ Saves to database
          └─ Returns new post
      └─ Updates feed automatically
```

**Code Structure:**

```typescript
// src/app/feed/page.tsx
import FeedList from '@/components/feed/FeedList';
import CreatePostForm from '@/components/feed/CreatePostForm';

export default function FeedPage() {
  return (
    <div>
      <CreatePostForm />
      <FeedList />
    </div>
  );
}

// src/components/feed/CreatePostForm.tsx
export function CreatePostForm() {
  const handleSubmit = async (content, images) => {
    const response = await fetch('/api/feed', {
      method: 'POST',
      body: JSON.stringify({ content, images })
    });
    // Refresh feed after posting
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🎭 User Roles & Permissions

| Action              | Athlete | Coach | Academy | Admin |
| ------------------- | ------- | ----- | ------- | ----- |
| Create profile      | ✅      | ✅    | ✅      | ✅    |
| Create posts        | ✅      | ✅    | ✅      | ✅    |
| Apply to events     | ✅      | ❌    | ❌      | ✅    |
| Create events       | ❌      | ✅    | ✅      | ✅    |
| Search athletes     | ❌      | ✅    | ✅      | ✅    |
| Review applications | ❌      | ✅    | ✅      | ✅    |
| Send connections    | ✅      | ✅    | ✅      | ✅    |
| Access admin panel  | ❌      | ❌    | ❌      | ✅    |

### How Permissions Are Enforced

- **Frontend**: UI elements hidden based on role
- **Backend**: API checks `user.role` before allowing actions
- **Database**: Relations prevent unauthorized access

---

## 🚀 Getting Started (For New Developers)

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database running
- Git

### Setup Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd gameon_co

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (random string for encryption)
# - NEXTAUTH_URL (http://localhost:3000)

# 4. Set up database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Create database tables

# 5. Run development server
npm run dev

# 6. Open browser
http://localhost:3000
```

### First-Time Exploration

1. **Landing page**: Check out the hero section with skiing background
2. **Sign up**: Create a test account (Athlete role)
3. **Onboarding**: Select a sport in sports preferences
4. **Dashboard**: See the personalized feed
5. **Profile**: Fill out your athlete profile
6. **Events**: Browse and apply to an event (if any exist)
7. **Create another account**: Try Coach or Academy role to see different features

---

## 🐛 Common Development Tasks

### Creating a New Page

```typescript
// 1. Create file: src/app/my-new-page/page.tsx
export default function MyNewPage() {
  return <div>My New Page</div>;
}

// 2. Access at: http://localhost:3000/my-new-page

// 3. To protect the route, add to middleware.ts:
export const config = {
  matcher: [
    "/my-new-page",  // Add this line
    // ... existing routes
  ],
};
```

### Creating a New API Endpoint

```typescript
// 1. Create file: src/app/api/my-endpoint/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const data = await prisma.user.findMany();
  return Response.json({ data });
}

// 2. Call from frontend:
const response = await fetch("/api/my-endpoint");
const { data } = await response.json();
```

### Adding a New Database Table

```typescript
// 1. Edit: prisma/schema.prisma
model MyNewTable {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}

// 2. Run migration:
npx prisma db push

// 3. Regenerate Prisma client:
npx prisma generate

// 4. Use in code:
const items = await prisma.myNewTable.findMany();
```

---

## 🎨 Design Guidelines

### Styling Rules

1. **Use Tailwind classes only** - No custom CSS outside `globals.css`
2. **Follow 8px spacing** - Use `p-2` (8px), `p-4` (16px), `p-6` (24px), etc.
3. **Max-width 1280px** - Use `max-w-[1280px] mx-auto` for containers
4. **Support dark mode** - Always add `dark:` variants

### Component Patterns

**Card Component:**

```tsx
<div className="card-premium p-6 bg-white dark:bg-slate-900">Content here</div>
```

**Button Component:**

```tsx
<button className="btn-primary px-6 py-3">Click Me</button>
```

---

##🔒 Security Features

### What's Implemented

✅ **Password Hashing**: bcryptjs - passwords never stored in plain text  
✅ **Session Authentication**: Secure HTTP-only cookies  
✅ **SQL Injection Prevention**: Prisma ORM sanitizes all queries  
✅ **XSS Protection**: React automatically escapes output  
✅ **CSRF Protection**: Built into NextAuth  
✅ **Route Protection**: Middleware guards all protected routes  
✅ **Audit Logging**: All critical actions logged with IP/timestamp

### Security Notes for Developers

- Never log sensitive data (passwords, tokens)
- Always validate user input (use Zod for validation)
- Check authorization in API routes (don't trust frontend)
- Use HTTPS in production

---

## 📊 Key Architectural Decisions

### Why Next.js App Router?

- **File-based routing**: Folders = routes (intuitive)
- **Server components**: Faster initial loads
- **API routes**: Backend in same codebase
- **Built-in optimization**: Image optimization, code splitting

### Why Prisma?

- **Type-safe**: Catches database errors at compile time
- **Auto-completion**: IntelliSense for database queries
- **Migrations**: Version-controlled database changes
- **Relationships**: Easy to query related data

### Why PostgreSQL?

- **Relational data**: Our data has complex relationships
- **ACID compliance**: Data integrity guaranteed
- **Scalability**: Can handle millions of records
- **JSON support**: Flexible data in `additionalStats` fields

### Why No Microservices?

- **Monolith is simpler**: Everything in one codebase
- **Easier debugging**: Can trace entire flow
- **Faster development**: No inter-service communication overhead
- **Sufficient for scale**: Next.js scales well with proper hosting

---

## 🚧 Current Limitations & Trade-offs

### Technical Constraints

- **PostgreSQL only**: Can't switch to MongoDB without full refactor
- **Session-based auth**: Requires server state (not purely stateless)
- **Single-tenant**: Each deployment serves one organization
- **Web only**: No native mobile apps (responsive web design only)

### Business Constraints

- **English only**: No internationalization (yet)
- **USD only**: Event fees in USD (no multi-currency)
- **Limited sports**: Predefined list of sports in database

### Design Constraints

- **1280px max-width**: Strictly enforced across platform
- **8px spacing**: All margins/padding must be multiples of 8
- **Dark mode required**: All components must support dark mode
- **Tailwind only**: No custom CSS files allowed (except globals)

---

## 🗺️ What's Next? (Roadmap)

### ✅ Current (MVP - Working)

- User authentication & authorization
- Role-based profiles
- Social feed with posts, likes, comments
- Event creation & applications
- Search & discovery
- Connections/networking
- Dark mode & responsive design

### 🔄 In Progress

- File upload for videos/images
- Email notifications
- Advanced analytics dashboard

### 📋 Planned (Phase 2)

- Real-time chat/messaging
- Video streaming for highlights
- Payment integration for event fees
- Mobile apps (iOS/Android)
- Multi-language support

### 🌟 Future (Phase 3)

- AI-powered talent matching
- Performance prediction models
- Live match tracking integration
- Marketplace for coaching services
- Public API for third-party integrations

---

## 🤝 Working with the Codebase

### Code Style

- **TypeScript**: Strongly typed, no `any` types
- **Naming**: camelCase for variables, PascalCase for components
- **File organization**: Group by feature, not by file type
- **Comments**: Explain "why", not "what"

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Add my feature"

# 3. Push to remote
git push origin feature/my-feature

# 4. Open pull request on GitHub
```

### Testing (Recommended)

- Unit tests for utilities (`lib/utils/`)
- Integration tests for API routes (`app/api/`)
- Component tests for UI (`components/`)
- E2E tests for critical flows (signup → dashboard)

---

## 📞 Getting Help

### When Stuck

1. **Check this guide** - Re-read relevant sections
2. **Check existing code** - Find similar features
3. **Check documentation**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Tailwind Docs](https://tailwindcss.com/docs)
4. **Ask the team** - Don't struggle alone!

### Resources

- **PROJECT_DOCUMENTATION.md**: Technical details
- **README.md**: Quick setup guide
- **prisma/schema.prisma**: Database reference
- **tailwind.config.js**: Design system reference

---

## 🎓 Key Takeaways

### What Makes This Project Special

1. **All-in-one platform**: Handles frontend, backend, and database in one codebase
2. **Type-safe**: TypeScript + Prisma = fewer runtime errors
3. **Modern stack**: Uses latest web technologies
4. **Role-based logic**: Different experiences for Athletes, Coaches, Academies
5. **Production-ready**: Dark mode, responsive, secured, audited

### Mental Model for Understanding

Think of the project as:

- **Database (Prisma)** = The storage room
- **API Routes** = The kitchen (processes data)
- **Components** = The dining area (presents data beautifully)
- **Middleware** = The bouncer (controls access)
- **Pages** = The menu (what users can access)

---

**Last Updated**: February 2026  
**For**: New Developer Onboarding  
**Next Steps**: Run the project locally and explore!
