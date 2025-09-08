# Gadget Store React Frontend

A functional React frontend for a gadget e-commerce platform. It supports product browsing, cart, checkout, authentication (login/signup), and order history. It integrates with a FastAPI backend via REST.

## Features
- Product listing with search
- Product detail page
- Cart with quantity management and totals
- Auth: Login & Sign Up (JWT token persisted in localStorage)
- Checkout (creates order from cart items)
- Order history (requires authentication)
- Theme toggle (light/dark)
- Clean CSS with minimal dependencies

## Environment Variables
Copy `.env.example` to `.env` and set:
- `REACT_APP_API_BASE_URL` – Base URL of the FastAPI backend (e.g., http://localhost:8000)

## Scripts
- `npm start` – Start dev server
- `npm test` – Run tests
- `npm run build` – Build production bundle

## API Contract
Frontend expects these endpoints on the backend:
- `POST /auth/login` -> { access_token }
- `POST /auth/register` -> { access_token? }
- `GET /users/me` -> user profile
- `GET /products` -> [ { id, name, price, image_url? } ]
- `GET /products/{id}` -> { id, name, price, description?, image_url? }
- `POST /orders` body: { items:[{product_id,quantity,price}], total_amount, shipping_address, note? } -> { id, ... }
- `GET /orders/my` -> list of user's orders

If your backend uses different paths or field names, adjust `src/api/client.js` accordingly.

## Folder Structure Highlights
- `src/api/client.js` – API wrapper with auth header support
- `src/context/AuthContext.js` – Auth state and actions
- `src/context/CartContext.js` – Cart state with localStorage persistence
- `src/pages/*` – Pages for all user flows
- `src/components/*` – UI components
- `src/AppRouter.js` – Routing and protected routes
- `src/App.js` – App shell with theme toggle

## Notes
- Authentication token is stored under `authToken` in `localStorage`.
- This app uses `react-router-dom@6`.
