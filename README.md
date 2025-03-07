# Would You Rather - Backend

This is the backend service for the **Would You Rather** game, which allows users to vote on two-option questions and view results dynamically. It is built with **Node.js**, **Express.js**, and **MongoDB** to handle API requests and manage question data efficiently.

## 🚀 Features
- Fetch random **Would You Rather** questions
- Submit votes for questions
- Store and retrieve voting data from **MongoDB**
- RESTful API with **Express.js**
- Data persistence with **MongoDB**

## 🛠️ Tech Stack
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## 📦 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rajeshkrishnait/Would_You_Rather_backend.git
   cd Would_You_Rather_backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     MONGO_URI=your_mongodb_connection_string
     PORT=5000
     ```
4. Start the server:
   ```bash
   npm start
   ```

## 🔌 API Endpoints
| Method | Endpoint               | Description                   |
|--------|------------------------|-------------------------------|
| GET    | `/api/questions/random` | Fetch a random question       |
| POST   | `/api/questions/vote`   | Submit a vote for a question  |

## 🏗️ Project Structure
```
Would_You_Rather_backend/
│-- src/
│   │-- models/        # Mongoose schemas
│   │-- routes/        # API route handlers
│   │-- controllers/   # Business logic for API
│   │-- config/        # Database and environment setup
│-- .env               # Environment variables (not committed)
│-- server.js          # Entry point
│-- package.json       # Dependencies and scripts
```

## 📜 License
This project is licensed under the **MIT License**.

## 🤝 Contributing
Feel free to submit issues or pull requests to enhance the project!

## ✨ Acknowledgments
Thanks to all contributors and open-source libraries that made this project possible.

