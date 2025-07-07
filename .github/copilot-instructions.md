# GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a modern library management system with the following architecture:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication with role-based access control

## Code Style Guidelines
- Use TypeScript for all new code
- Follow React functional components with hooks
- Use Tailwind CSS for styling
- Implement proper error handling and validation
- Use async/await for asynchronous operations
- Follow RESTful API conventions

## Key Features
- User authentication (Admin/User roles)
- Book management (CRUD operations)
- Issue/Return book functionality
- Fine calculation and payment
- Search and filter capabilities
- Mobile-responsive design

## Component Structure
- Separate admin and user components
- Use shared UI components from `/src/components/ui/`
- Implement proper TypeScript interfaces
- Use React Query for API state management
- Use Zustand for client-side state management

## API Guidelines
- Use proper HTTP status codes
- Implement request validation with Zod
- Use JWT middleware for protected routes
- Follow RESTful naming conventions
- Include proper error responses

## Database Guidelines
- Use Prisma ORM for database operations
- Implement proper relations between models
- Use transactions for complex operations
- Follow database naming conventions
