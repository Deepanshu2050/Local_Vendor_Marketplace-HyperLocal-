# LocalVendor

A modern, hyperlocal service marketplace connecting customers with verified local professionals—plumbers, electricians, tutors, tiffin services, and more. Built with React Native, Expo, and Node.js.

## Tech Stack

**Client**
- React Native & Expo (SDK 54)
- TypeScript (Strict Mode)
- Expo Router (File-based routing)
- React Native Paper (Material Design 3)
- Zustand (State management)
- Socket.IO-client (Real-time updates)

**Server**
- Node.js & Express
- MongoDB & Mongoose
- Socket.IO (WebSockets)
- JWT Authentication

## Core Features

- **Location-Based Discovery:** Uses MongoDB GeoJSON indexing to find the closest verified vendors to the user.
- **Service Bookings:** Real-time booking system with schedule conflict prevention.
- **Chat System:** WebSocket-powered messaging between customers and vendors.
- **Role-Based Access:** Distinct experiences for Customers, Vendors, and Admins.
- **Vendor Dashboard:** Vendors can manage services, availability, and bookings directly from the app.
- **Admin Panel:** Platform analytics and vendor approval workflow.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas cluster)
- iOS Simulator or Android Emulator (or a physical device with Expo Go)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start the development server
npm run dev
```

*Note: The backend runs natively on port 5000. Ensure your local MongoDB instance is running.*

### 2. Mobile App Setup

```bash
# In the root directory
npm install

# Start Expo development server
npx expo start
```

*If testing on a physical device, ensure you update `src/constants/index.ts` to use your computer's local network IP address instead of `localhost`.*

## Project Structure

```text
├── app/                  # Expo Router screens based on file hierarchy
│   ├── (auth)/           # Login, Register, Onboarding flows
│   ├── (tabs)/           # Main tab navigation (Home, Search, Chat, Bookings, Profile)
│   ├── vendor/           # Vendor profile & booking flows
│   └── vendor-dashboard/ # Vendor management screens
├── backend/              # Node.js/Express server
│   ├── src/models/       # Mongoose Schemas
│   ├── src/routes/       # API endpoints
│   └── src/socket/       # WebSocket handlers
├── src/                  # React Native app source
│   ├── components/       # Reusable UI components
│   ├── services/         # API clients (Axios)
│   ├── store/            # Zustand global state
│   ├── theme/            # Material 3 styling tokens
│   └── types/            # TypeScript interfaces
```

## Contributing

While this is primarily a personal project, suggestions and feedback are always welcome.

## License

MIT
