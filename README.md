SlotSwapper

Peer-to-peer time-slot swapping application (MERN)
SlotSwapper lets users mark busy calendar slots as swappable, browse other users’ swappable slots, and request/accept/reject swaps. Built to be minimal, secure, and easy to run locally.

Overview & design choices

What it does

Users sign up / log in (JWT).

Users create/manage events (title, start/end time, status).

Events can be set to SWAPPABLE. Other users can view these and request swaps by offering one of their own SWAPPABLE slots.

Swap requests are PENDING until receiver accepts/rejects. On acceptance owners of both slots are exchanged and statuses updated.

Design choices

MERN stack: Node/Express backend with MongoDB (Mongoose) and React frontend for rapid development and familiarity with stateful UI.

JWT for stateless auth and easy integration with React.

Event statuses (BUSY, SWAPPABLE, SWAP_PENDING) prevent conflicts and double-offers.

SwapRequest document tracks request lifecycle (PENDING, ACCEPTED, REJECTED).

Backend-first development: API is the single source of truth; frontend consumes API and updates UI reactively.

Features

User registration / login (bcrypt + JWT)

CRUD events (create/update/delete)

Mark events as SWAPPABLE

Browse other users’ swappable slots

Create swap requests (mySlot ↔ theirSlot)

Accept / reject swap requests with atomic changes

Protected routes via authMiddleware middleware

Tech stack

Backend: Node.js, Express, Mongoose (MongoDB)

Frontend: React, React Router, Axios, Context API

Auth: bcrypt, jsonwebtoken

Quick start — run locally

Prerequisites: Node.js (>=16), npm, MongoDB (local or Atlas)

Backend

Clone the repo

git clone <https://github.com/yashraj013/SlotSwapper.git>
cd <SlotSwapper>/server


Install dependencies

npm install


Create .env 

Start server (development)

npm run dev


Server default: http://localhost:3000

Frontend

Open a new terminal, go to frontend

cd <SlotSwapper>/frontend
npm install
npm run dev 

Frontend default: http://localhost:5173

Environment variables

PORT=
CORS_ORIGIN=
MONGODB_URI=
JWT_SECRET=

API Endpoints

Postman Collection => https://web.postman.co/workspace/My-Workspace~8b854243-c4ef-45ec-86ff-d68ca310eae9/collection/40652536-2c97d00e-dd9b-4055-8b58-cd98c4fcc323?action=share&source=copy-link&creator=40652536

License

MIT — feel free to reuse and extend.