# Doc Editor 📝

A modern, feature-rich document editor similar to Google Docs with real-time collaboration capabilities. Built with Node.js, Express, MongoDB, and Socket.IO.

![Doc Editor](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-ISC-green.svg)
![Node](https://img.shields.io/badge/Node.js-v16+-green.svg)

## 🌟 Features

### ✏️ Rich Text Editing
- **Quill.js Integration**: Advanced rich text editor with comprehensive formatting options
- **Real-time Autosave**: Documents are automatically saved every 2 seconds
- **Document Statistics**: Word count, character count, and paragraph statistics
- **Export Options**: Export documents as HTML or plain text

### 🤝 Collaboration
- **Real-time Collaboration**: Multiple users can edit documents simultaneously
- **Active User Indicators**: See who's currently viewing/editing the document
- **Live Updates**: Changes are instantly synchronized across all connected users
- **Socket.IO Integration**: Robust real-time communication

### 📋 Document Management
- **Create Documents**: Instant document creation with auto-generated titles
- **Search Functionality**: Search through document titles and content
- **Sort Options**: Sort documents by date modified, date created, or alphabetically
- **Delete Documents**: Remove documents with confirmation dialogs
- **Document Sharing**: Generate shareable links for documents

### 🎨 Modern UI/UX
- **Clean Interface**: Modern, Google Docs-inspired design
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Floating Action Button**: Quick access to common actions
- **Modal Dialogs**: Intuitive modal interfaces for various features
- **Notification System**: Real-time feedback for user actions

### ⌨️ Keyboard Shortcuts
- `Ctrl + S`: Manual save
- `Ctrl + Shift + W`: Show word count
- `Ctrl + Shift + S`: Show sharing options
- `F11`: Toggle fullscreen mode
- `Escape`: Close modals

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally on default port 27017)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Doc-Editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

4. **Run the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
Doc-Editor/
├── app.js                 # Main server file
├── package.json          # Dependencies and scripts
├── models/
│   └── Doc.js            # Document schema
├── views/
│   ├── Index.ejs         # Document dashboard
│   └── Edit.ejs          # Document editor
├── public/
│   ├── styles/
│   │   ├── Index.css     # Dashboard styles
│   │   ├── Edit.css      # Editor styles
│   │   └── templates/
│   │       └── topbar.css # Navigation bar styles
│   └── scripts/
│       ├── search.js     # Search functionality
│       ├── sort.js       # Sorting functionality
│       ├── documents.js  # Document operations
│       ├── autosave.js   # Auto-save functionality
│       ├── quill.js      # Editor configuration
│       └── collaboration.js # Collaboration features
├── assets/
│   └── images/           # Static images and icons
└── utils/
    ├── ExpressError.js   # Error handling utility
    └── CatchAsync.js     # Async error wrapper
```

## 🔧 Configuration

### Database Configuration
The application connects to MongoDB at `mongodb://localhost/ProjectDocs`. To change this:

1. Open `app.js`
2. Modify the connection string:
   ```javascript
   mongoose.connect('your-mongodb-connection-string')
   ```

### Session Configuration
Session settings can be modified in `app.js`:
```javascript
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: 'your-mongodb-url'}),
    cookie: {maxAge: 60000*60*24} // 24 hours
}))
```

## 🛠️ API Endpoints

### Document Routes
- `GET /` - Redirect to documents dashboard
- `GET /docs` - Document dashboard with optional sorting (`?q=sort-option`)
- `GET /docs/search` - Search documents (`?q=search-term`)
- `POST /docs/new` - Create new document
- `GET /docs/:id/edit` - Document editor
- `POST /docs/:id/edit` - Save document changes
- `DELETE /docs/:id` - Delete document

### Socket.IO Events
- `join-document` - Join document room for collaboration
- `send-changes` - Send document changes to other users
- `receive-changes` - Receive changes from other users
- `user-connected` - Notify when user joins
- `user-disconnected` - Notify when user leaves

## 🎯 Usage Guide

### Creating Documents
1. Click the "+ New Doc" button on the dashboard
2. A new untitled document will be created and opened in the editor
3. Start typing to add content and modify the title as needed

### Editing Documents
1. Click on any document from the dashboard to open it
2. Use the rich text toolbar for formatting
3. Documents auto-save every 2 seconds
4. Use keyboard shortcuts for quick actions

### Collaboration
1. Share the document URL with collaborators
2. Multiple users can edit simultaneously
3. See active users in the collaboration bar
4. Changes are synchronized in real-time

### Document Management
1. Use the search bar to find specific documents
2. Sort documents using the dropdown menu
3. Hover over documents to see action buttons
4. Delete or duplicate documents as needed

## 🔒 Security Features

- Session-based authentication
- MongoDB injection protection
- XSS protection through proper escaping
- CSRF protection through Express session handling
- Input validation and sanitization

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running on port 27017
- Check if the database path is correct
- Verify MongoDB service status

**Port Already in Use**
- Change the port in `app.js` if 3000 is occupied
- Use `lsof -i :3000` to find processes using the port

**Socket.IO Connection Issues**
- Check browser console for WebSocket errors
- Ensure firewall isn't blocking connections
- Verify Socket.IO client-server version compatibility

## 📈 Performance Optimization

- Documents are loaded on-demand
- Debounced autosave prevents excessive server requests
- Efficient MongoDB queries with proper indexing
- Optimized real-time updates through Socket.IO rooms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the package.json file for details.

## 👨‍💻 Author

**Sahil Batgeri**

## 🙏 Acknowledgments

- [Quill.js](https://quilljs.com/) for the rich text editor
- [Socket.IO](https://socket.io/) for real-time functionality
- [Express.js](https://expressjs.com/) for the web framework
- [MongoDB](https://www.mongodb.com/) for data storage

---

Made with ❤️ using Node.js, Express, MongoDB, and Socket.IO
