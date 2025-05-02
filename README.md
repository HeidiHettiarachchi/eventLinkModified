# EventLink - Event Management System

EventLink is a comprehensive event management system designed for organizations to create, manage, and track events. The system supports different user roles including presidents, staff advisors, and administrators.

## Table of Contents

1. Project Overview
2. Features
3. Getting Started
   - Prerequisites
   - Backend Setup
   - Frontend Setup
4. System Architecture
5. Core Services
   - Event Management
   - Organization Management
   - User Management
   - File Upload Service
   - Email Notification System
6. API Documentation
7. Contributors

## Project Overview

EventLink facilitates event management for organizations with a clear workflow from creation to approval. The system enables organizations to track their events, manage user roles, and coordinate between organization presidents and staff advisors.

## Features

- **User Role Management**: Different privileges for presidents, staff advisors, and administrators
- **Organization Management**: Create, update, view, and delete organizations
- **Event Management**: Create, update, delete events with comprehensive details
- **Event Approval Workflow**: Staff advisors can approve or reject event proposals
- **PDF Document Support**: Upload and view event proposals and forms
- **Email Notifications**: Automated emails for event creation, updates, status changes, and deletions
- **Responsive UI**: Table and grid views for mobile and desktop screens
- **Filtering & Search**: Find events by status, type, and name

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eventlink
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventlink
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the backend server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

5. Access the application at `http://localhost:5173`

## System Architecture

EventLink follows a client-server architecture:

- **Frontend**: React with TypeScript, using functional components and hooks
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system

## Core Services

### Event Management

The Event Management service handles all aspects of the event lifecycle:

- **Event Creation**: Presidents can create new events with comprehensive details including name, date, time, venue, and required documents
- **Event Updates**: Modify existing event details
- **Event Status Management**: Staff advisors can approve or reject events
- **Event Deletion**: Remove events with proper authorization
- **Event Viewing**: Public approved events list and detailed event views

#### Key API Endpoints:
- `POST /eventsAdmin/createEvent`: Create a new event
- `GET /eventsAdmin/getEvents/:organizationId`: Get events for a specific organization
- `PUT /eventsAdmin/updateEvent/:id`: Update an existing event
- `PUT /eventsAdmin/updateEventStatus/:id`: Update an event's status
- `DELETE /eventsAdmin/deleteEvent/:id`: Delete an event
- `GET /eventsAdmin/getAllEvents`: Get all approved events

### Organization Management

This service manages the organizational structure within the system:

- **Organization Creation**: Create new organizations with president and staff advisor assignments
- **Organization Updates**: Modify existing organization details
- **Organization Deletion**: Remove organizations (only if they have no events)
- **Organization Viewing**: View organization details including events and assigned users

#### Key API Endpoints:
- `POST /organizations`: Create a new organization
- `GET /organizations`: Get all organizations
- `GET /organizations/:id`: Get a specific organization
- `PUT /organizations/:id`: Update an organization
- `DELETE /organizations/:id`: Delete an organization

### User Management

Handles user accounts and authentication:

- **User Authentication**: Login and session management
- **User Role Management**: Assign and manage user roles (president, staff advisor, etc.)

### File Upload Service

Manages document uploads for events:

- **Proposal Uploads**: Store and retrieve event proposal documents
- **Form Uploads**: Store and retrieve event form documents
- **File Retrieval**: Access uploaded documents securely

### Email Notification System

Sends automated emails for key system events:

- **Club Creation Notifications**: Notify president and staff advisor when a club is created
- **Organization Update Notifications**: Alert relevant parties about organization changes
- **Event Creation Notifications**: Inform organization leaders about new events
- **Event Update Notifications**: Notify stakeholders about event changes
- **Event Status Notifications**: Alert when an event is approved or rejected
- **Event Deletion Notifications**: Inform of event cancellations

## API Documentation

The API is organized around RESTful principles. All requests and responses are in JSON format unless otherwise specified (such as file uploads).

### Authentication

All API requests (except public endpoints) require authentication using JWT tokens:

```
Authorization: Bearer <your-token>
```

## Contributors


---

<<<<<<< HEAD
*EventLink - Simplifying Event Management*
=======
*EventLink - Simplifying Event Management*
>>>>>>> 536afb3d4c0fe1dc7d2781c7aa48dca5f57e0a20
