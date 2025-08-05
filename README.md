# 🖍️ Real-Time Collaborative Whiteboard

A powerful real-time collaborative whiteboard where users can draw, write, and annotate in a shared room using tools like **Pen**, **Text**, **Shapes**, and more — all synced live using **Socket.IO**.

Built with **React**, **Node.js**, and **Socket.IO**, this full-stack project demonstrates seamless multi-user live collaboration using a modular backend and a responsive frontend interface.

---

## 🌟 Features

- 🎨 **Drawing tools**: Pen, Text, Line, Rectangle, Circle  
- 🖌️ **Color picker** and adjustable **stroke thickness**
- 👥 **Room-based multi-user collaboration**
- 🔄 **Real-time sync** via WebSockets using Socket.IO
- ⚛️ **Frontend built with React** + **Tailwind CSS**
- 🧩 **Modular architecture**: Separate frontend, backend, and WebSocket servers

---

## 🧰 Tech Stack

| Layer     | Technologies                         |
|-----------|--------------------------------------|
| Frontend  | React, Tailwind CSS                  |
| Backend   | Node.js, Express.js                  |
| Real-Time | Socket.IO                            |
| Database  | MongoDB (optional, for room info)    |
| Other     | UUID (`uuid` npm package)            |

---

## 📁 Project Structure

```
whiteboard-app/
│
├── client/             # React frontend
│   └── ...             # Components, hooks, etc.
│
├── server/             # Main backend (room creation, REST APIs)
│   └── index.js
│
├── socketboard/        # WebSocket server (real-time whiteboard)
│   └── socketforboard.js
│
├── .env                # Environment variables
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/whiteboard-app.git
cd whiteboard-app
```

---

### 2. Install Dependencies

**Frontend:**

```bash
cd client
npm install
```

**Backend:**

```bash
cd ../server
npm install
```

**WebSocket Server:**

```bash
cd ../socketboard
npm install
```

---

### 3. Setup Environment Variables

Create `.env` files in both `server/` and `socketboard/` folders:

**server/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

**socketboard/.env**
```env
SOCKET_PORT=5001
```

---

### 4. Run the App Locally

In **three separate terminals**:

**Terminal 1 - Frontend**
```bash
cd client
npm start
```

**Terminal 2 - Backend Server**
```bash
cd server
node index.js
```

**Terminal 3 - WebSocket Server**
```bash
cd socketboard
node socketforboard.js
```

---

## 🌐 Deployment

### ✅ Frontend (Vercel / Netlify)

- Deploy the `client/` folder.
- Set build command: `npm run build`
- Set output directory: `build`

### ✅ Backend & WebSocket Server (Render / Railway)

- Deploy `server/index.js` and `socketboard/socketforboard.js` as **two separate services**.
- Add respective `.env` variables in each.
- Make sure **CORS** is enabled to allow requests from your frontend domain.

---

## 🧪 Usage Example

1. Visit: `http://localhost:3000/room/abc123` in one browser tab  
2. Open the **same room URL** in another tab or browser  
3. Start drawing — you'll see live updates in real-time!

---

## 📸 Screenshots

> Add screenshots or screen recordings of your app UI here

---

## 🛠️ Future Improvements

- ✏️ Eraser tool  
- 📤 Image export (PNG/JPEG)  
- 🔐 Authentication (login/signup)  
- 🔒 Public/Private room access  
- 😊 Emoji reactions  
- 📋 Persistent drawing history  
- 📷 Upload and annotate on images  

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a pull request or create an issue to discuss changes.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

**Author**: Your Name  
**Email**: your.email@example.com  
**GitHub**: [@your-username](https://github.com/your-username)

---

> Made with 💻, ☕, and a passion for real-time collaboration
