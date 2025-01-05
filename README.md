# ExpressJS Project - APP_ Stage Two Task Backend

## Overview

This project is part of the APP_ Internship, focusing on user authentication and organization management using Express.js, and TypeORM. The project implements various endpoints to handle user registration, login, and organization management, adhering to the provided acceptance criteria.

## Features

- _User Management:_
  - User can retrieve their own records or records of users in organizations they belong to or created.
  - Users can register, and automatically create a default organization.
- _Organisation Management:_

  - Create a new organisations;
  - View organizations;
  - View single organisation detail;
  - Add user to organization;

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js and npm: Download and install from [nodejs.org](https://nodejs.org)

## Installation

1. Clone the repository

```bash
    git clone https://github.com/Heccubernny/Stage-two.git
```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

clone `.env.sample` and change the environment name to `.env`

## Running the Project

Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:8000`.

## API Endpoints

### Auth API Endpoint

```
[POST] /auth/register
```

```
[POST] /auth/login
```

### User API Endpoint

```
[GET] /api/users/:id
```

### Organizations API Endpoint

```
[GET] /api/organisations
```

```
[GET] /api/organisations/:ordId
```

```
[POST] /api/organisations
```

```
[POST] /api/organisations/:orgId/users
```

### API Documentation

For a more detailed API documentation, see the documentation in the postman collection below:

[API Documentation URL](https://documenter.getpostman.com/view/11213515/2sA3e1ApmM)

## Technologies Used

- Express.js
- TypeORM
- PostgreSQL
- JsonWebToken
- Class Validator
