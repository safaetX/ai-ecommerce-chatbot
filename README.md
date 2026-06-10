# AI E-Commerce Chatbot

An AI-powered e-commerce platform that combines traditional online shopping with a conversational shopping assistant. Users can browse products, manage carts, and interact with an AI chatbot to search products, receive recommendations, add/remove items from the cart, and complete checkout using natural language.

## Live Demo

Deployed Application:

https://ai-ecommerce-chatbot-seven.vercel.app/

GitHub Repository:

https://github.com/safaetX/ai-ecommerce-chatbot

---

## Features

### AI Shopping Assistant

* Natural language product search
* AI-powered product recommendations
* Conversational shopping experience
* Add products to cart through chat
* Remove products from cart through chat
* Checkout through chat
* Multi-turn conversation support
* Product cards displayed directly in chat
* Chat history persistence for authenticated users
* Product request workflow for out-of-stock items

### E-Commerce Features

* User registration and login
* Secure authentication with NextAuth
* Product catalog with filtering and sorting
* MongoDB product management
* Shopping cart management
* Inventory tracking by size
* Checkout workflow
* Responsive UI

### User Experience

* Persistent chat history
* Auto-scrolling chat interface
* Product previews in conversation
* Mobile-friendly design

---

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* NextAuth
* MongoDB
* Mongoose

### AI

* Google Gemini API

### Deployment

* Vercel

---

## System Architecture

User Interface (Next.js)
↓
AI Chat Widget
↓
API Routes
↓
Gemini AI + Business Logic
↓
MongoDB Database

Collections:

* Users
* Products
* Carts
* Conversations
* Product Requests

---

## AI Workflow

### Product Search

User:
"Show me black t-shirts under 1000"

AI:

* Extracts filters
* Queries MongoDB
* Returns matching products
* Displays product cards in chat

### Cart Management

User:
"Add Black T-Shirt size M"

AI:

* Identifies product
* Validates stock
* Updates cart
* Returns confirmation

### Out-of-Stock Handling

User:
"Add Black Pants size S"

System:

* Detects unavailable stock
* Creates Product Request
* Notifies user

---

## Installation

Clone the repository:

```bash
git clone https://github.com/safaetX/ai-ecommerce-chatbot.git
cd ai-ecommerce-chatbot
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Future Improvements

* Fuzzy product matching
* Product reference resolution ("add the first one")
* Order history
* Admin dashboard
* Advanced recommendation engine
* Rate limiting
* AI function calling

---

## Author

Md Safaet

Computer Science & Engineering Student

Focused on AI-powered web applications, full-stack development, and intelligent user experiences.
