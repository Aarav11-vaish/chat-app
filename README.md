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


## 🛠️ Future Improvements

- ✏️ Eraser tool  
- 📤 Image export (PNG/JPEG)  

- 🔒 Public/Private room access  
- 😊 Emoji reactions
- Group meetings
- 📷 Upload and annotate on images  

---


## 📬 Contact

**Author**: aaravvaish2004@gmail.com 



