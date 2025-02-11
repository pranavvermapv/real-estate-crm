# Real Estate CRM Dashboard

This project is a full-stack Real Estate CRM Dashboard using React.js with TypeScript for the frontend and Node.js with Express for the backend.

## Technologies Used

### Frontend
- React.js
- TypeScript
- Next.js
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js
- Express.js
- UUID for generating unique IDs

## Steps to Run the Project Locally

### Frontend

1. Navigate to the project directory:
   \`\`\`
   cd real-estate-crm
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend

1. Navigate to the server directory:
   \`\`\`
   cd server
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Start the server:
   \`\`\`
   node server.js
   \`\`\`

The server will start running on [http://localhost:3001](http://localhost:3001).

## Features

- Leads Management
  - Create, edit, and delete leads
  - Search leads by name or phone number

- Property Management
  - Add, edit, and delete properties
  - Categorize properties as Residential, Commercial, or Land
  - Search properties by type, location, or availability status

- Error Handling
  - User-friendly error messages
  - Proper validation on both frontend and backend

## API Endpoints

### Leads

- GET /api/leads - Retrieve all leads
- POST /api/leads - Create a new lead
- PUT /api/leads/:id - Update a lead
- DELETE /api/leads/:id - Delete a lead

### Properties

- GET /api/properties - Retrieve all properties
- POST /api/properties - Create a new property
- PUT /api/properties/:id - Update a property
- DELETE /api/properties/:id - Delete a property

## Deployment

The frontend can be easily deployed on Vercel or Netlify. For the backend, consider using a service like Heroku or DigitalOcean.

## Future Improvements

- Implement authentication and authorization
- Add pagination for leads and properties lists
- Integrate with a database for persistent storage
- Implement file upload functionality for lead documents
- Add more detailed reporting and analytics features

