# 📚 Book Review API

A RESTful API built with Node.js, Express.js, and MongoDB to manage books, users, and their reviews. It supports JWT-based authentication, pagination, filtering, and searching.

---

## 🚀 Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT (JSON Web Token)
* **Environment Variables**: Configured using `dotenv`

---

## 🛠️ Project Setup

### 1. Clone the repository:

```bash
git clone https://github.com/RakeshDevarakonda/Book-Review

```

### 2. Install dependencies:

```bash
npm install
```

### 3. Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the project:

```bash
node index.js
```

The server will run at `http://localhost:8000`.

---

## 📦 API Endpoints

### 🔐 Authentication

* `POST /api/signup` – Register a new user
* `POST /api/login` – Login and receive a JWT

### 📘 Books

* `POST /api/books` – Add a new book (Authenticated)
* `GET /api/books` – Get all books (with pagination & filters)
* `GET /api/books/:id` – Get book details by ID (with average rating and reviews)
* `GET /api/books/search?q=keyword` – Search books by title or author (case-insensitive)

### 📝 Reviews

* `POST /api/books/:id/reviews` – Add review for a book (Authenticated, 1 per user)
* `PUT /api/reviews/:id` – Update your review (Authenticated)
* `DELETE /api/reviews/:id` – Delete your review (Authenticated)

---




## 🗃️ Database Schema

### User

```json
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Book

```json
{
  title: String,
  author: String,
  genre: String,
  description: String
}
```

### Review

```json
{
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  rating: Number,
  comment: String,
  timestamps: true
}
```

---

## 📁 Folder Structure

```
book-review-api/
├── config/
│   └── db.js
├── controllers/
│   ├── auth-controller.js
│   ├── book-controller.js
│   └── review-controller.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Book.js
│   ├── Review.js
│   └── User.js
├── routes/
│   ├── auth-routes.js
│   ├── book-routes.js
│   └── review-routes.js
├── utils/
│   └── throw-error.js
├── .env
├── index.js
└── README.md
```

---


