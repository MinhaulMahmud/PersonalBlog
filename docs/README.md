# AISurfer Blog Documentation

![AISurfer Blog Banner](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=400&fit=crop)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [AI Integration](#ai-integration)
- [Deployment](#deployment)

## Overview

AISurfer Blog is a modern, AI-enhanced blogging platform built with React and Supabase. It features real-time analytics, AI-powered content optimization, and a beautiful dark mode interface.

## Features

### Core Features

📝 **Content Management**
- Rich text editor with image support
- Category organization
- Reading time estimation
- Cover image management

📊 **Analytics**
- Real-time view tracking
- Read-through rate monitoring
- Engagement metrics

🤖 **AI Capabilities**
- AI-powered content summarization
- SEO optimization suggestions
- Keyword recommendations

🎨 **User Experience**
- Responsive design
- Dark mode support
- Clean, modern interface
- Social sharing

🔒 **Security**
- Role-based access control
- Secure authentication
- Protected admin routes

## Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TipTap** - Rich text editor
- **Lucide React** - Icons
- **React Router** - Navigation

### Backend
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL database
  - Row Level Security
  - Storage
  - Edge Functions

### AI Integration
- **Google Gemini 1.5 Flash** - AI model
  - Content summarization
  - SEO optimization

## Project Structure

```
project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and configurations
│   ├── pages/         # Page components
│   └── types/         # TypeScript type definitions
├── supabase/
│   ├── functions/     # Edge functions
│   └── migrations/    # Database migrations
└── public/           # Static assets
```

## Getting Started

1. **Environment Setup**

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

2. **Environment Variables**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Start Development Server**

```bash
npm run dev
```

## Authentication

### Admin Access
- Default admin credentials:
  - Email: admin@example.com
  - Password: admin123

### Security Features
- JWT-based authentication
- Protected admin routes
- Row Level Security policies

## Database Schema

### Posts Table

| Column        | Type      | Description                    |
|--------------|-----------|--------------------------------|
| id           | uuid      | Primary key                    |
| title        | text      | Post title                     |
| content      | text      | Post content (HTML)            |
| category     | text      | Post category                  |
| created_at   | timestamp | Creation timestamp             |
| read_time    | integer   | Estimated reading time (mins)  |
| image_url    | text      | Cover image URL               |
| user_id      | uuid      | Author reference              |
| view_count   | integer   | Number of views               |
| read_count   | integer   | Number of complete reads      |

### Storage

- **blog-assets** bucket
  - Stores blog images
  - 50MB file size limit
  - Supported formats: JPEG, PNG, GIF, WEBP

## AI Integration

### Content Summarization
The platform uses Google's Gemini 1.5 Flash model for generating concise, two-sentence summaries of blog posts.

```typescript
// Example API call
const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-assistant`, {
  method: 'POST',
  body: JSON.stringify({ 
    content,
    type: 'summarize'
  })
});
```

### SEO Optimization
The AI assistant analyzes content and provides:
- SEO-optimized title suggestions
- Meta description recommendations
- Relevant keywords

## Deployment

### Prerequisites
- Supabase project
- Environment variables configured
- Database migrations applied

### Build Process
```bash
# Build the application
npm run build

# Preview build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

MIT License - See LICENSE file for details