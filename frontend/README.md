# Deep JS Research

A modern web application for JavaScript code research and analysis.

## Features

- Real-time code analysis through WebSocket connection
- Live progress updates during processing
- Clean and responsive UI
- Dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/deep-js-research.git
cd deep-js-research
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following content:
```
NEXT_PUBLIC_WEBSOCKET_URL=ws://your-websocket-server:port
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## WebSocket Server

This frontend application requires a WebSocket server to process research queries. The WebSocket server should handle the following:

- Accept connections from the frontend
- Receive research queries
- Process the queries and send status updates
- Send the final result when processing is complete

The WebSocket server should respond with messages in the following format:

```json
// Status update
{
  "type": "status",
  "message": "Processing file: example.js"
}

// Final result
{
  "type": "result",
  "result": "Detailed analysis result here..."
}

// Error
{
  "type": "error",
  "message": "Error message here"
}
```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- WebSocket API

## License

This project is licensed under the MIT License - see the LICENSE file for details.
