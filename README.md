# AI Image Stylization API

This project provides an API for stylizing images using AI. It uses Firebase for storage and database, and Replicate for AI image processing. The application follows the Onion Architecture pattern for clean separation of concerns.

## Features

- Upload images and apply different styles (anime, pixel, cartoon)
- Asynchronous processing with status tracking
- RESTful API endpoints
- Firebase Storage for image storage
- Firestore for request tracking
- Replicate AI for image stylization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Replicate account

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   STORAGE_BUCKET=your-firebase-storage-bucket
   REPLICATE_API_TOKEN=your-replicate-api-token
   ```

## Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Enable Storage
5. Create a storage bucket (or use the default one)
6. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `firebase-adminsdk.json` in the project root directory

## Replicate Configuration

1. Sign up for a [Replicate account](https://replicate.com/)
2. Generate an API token from your account settings
3. Add the token to your `.env` file

## Running the Application

1. Start the API server:

   ```bash
   npm start
   # or
   yarn start
   ```

2. Start the worker process (in a separate terminal):
   ```bash
   npm run start:worker
   # or
   yarn start:worker
   ```

For development with auto-reload:

1. Start the API server in development mode:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Start the worker process in development mode (in a separate terminal):
   ```bash
   npm run dev:worker
   # or
   yarn dev:worker
   ```

For production:

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the API server:

   ```bash
   npm run serve
   # or
   yarn serve
   ```

3. Start the worker process (in a separate terminal):
   ```bash
   npm run serve:worker
   # or
   yarn serve:worker
   ```

The API server will run on port 3000 by default (or the port specified in your `.env` file).

## API Endpoints

### Process Image

Upload an image and apply a style to it.

```
POST /images/process
```

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `image`: Image file (JPEG, PNG)
  - `style`: Style to apply (`anime`, `pixel`, or `cartoon`)

**Response:**

```json
{
  "requestId": "abc123",
  "url": "https://storage.googleapis.com/your-bucket/abc123.jpg",
  "statusInfo": "/images/abc123/status"
}
```

### Get Request Status

Check the status of an image processing request.

```
GET /images/:id/status
```

**Response:**

```json
{
  "status": "pending|processing|done|error",
  "url": "https://storage.googleapis.com/your-bucket/abc123.jpg",
  "stylizedImageUrl": "https://storage.googleapis.com/your-bucket/stylized_abc123.jpg",
  "errorMessage": "Error message (if status is error)"
}
```

## Status Values

- `pending`: Request has been received but processing hasn't started
- `processing`: Image is currently being processed
- `done`: Processing is complete, stylized image is available
- `error`: An error occurred during processing

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing or invalid parameters)
- `404`: Resource not found
- `500`: Server error

Error responses include a message explaining what went wrong:

```json
{
  "message": "Error description"
}
```