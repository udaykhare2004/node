# School Management APIs

This is a Node.js-based backend application for a school management system, built using Express.js and MySQL. It provides APIs to manage school information and retrieve schools based on their proximity to a user's location.

## Features

- **Store School Information**: Stores schools along with their address, latitude, and longitude in a MySQL database.
- **Geographical Distance Calculation**: Retrieves a list of schools sorted by their distance from a specific geographic coordinate.

## Prerequisites

- **Node.js**
- **MySQL Server** 

## Getting Started

### 1. Install Dependencies
Run the following command in your terminal to install the necessary packages (like `express`, `mysql2`, `dotenv`):
```bash
npm install
```

### 2. Environment Variables
Ensure you have a `.env` file in the root of your project directory configured with your database and server details:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
```
*(Update `your_password` and `your_database_name` accordingly)*

### 3. Database Initialization
When the server starts, it will automatically connect to MySQL and execute an initialization function to create the `schools` table if it doesn't already exist. The table structure explicitly tracks:
- `id`: Primary Key
- `name`: String
- `address`: String
- `latitude`: Float
- `longitude`: Float

### 4. Start the Application
Start the Node.js server:
```bash
node index.js
```
The server will handle incoming requests on the port specified in your `.env` file or default to `3000`.

## API Endpoints

### 1. Add a School
**Endpoint:** `POST /addSchool`

Adds a new school to the database.

**Request Body (JSON):**
```json
{
  "name": "Greenwood High",
  "address": "123 Education Lane, NY",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Responses:**
- `201 Created`: School added successfully. Returns ID of generated school.
- `400 Bad Request`: Validation failure (e.g., empty strings or invalid data types for required fields).
- `500 Internal Server Error`: Server/Database error.

### 2. List Schools by Proximity
**Endpoint:** `GET /listSchools`

Fetches all schools sorted by their distance from the user's provided coordinates. Internally uses the Haversine formula to dynamically determine proper distances.

**Query Parameters:**
- `latitude` (Float): The user's latitude.
- `longitude` (Float): The user's longitude.

**Example Request:**
```
GET /listSchools?latitude=40.730610&longitude=-73.935242
```

**Responses:**
- `200 OK`: Returns an array of school objects, including the newly calculated `distance` in kilometers, sorted closest to furthest.
- `400 Bad Request`: Validation failure for coordinate numbers.
- `500 Internal Server Error`: Server/Database error.

## Postman Collection
A Postman collection named `School_Management_APIs.postman_collection.json` is automatically included in this repository block. You can import it seamlessly into Postman to quickly test both documented APIs. It heavily covers example endpoints and expected responses.
