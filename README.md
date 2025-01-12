# StoryForge

A web-based writing platform for creating and managing story projects. Built with React, Firebase, and Chakra UI.

## Features
- Project creation and management
- Real-time content autosave
- Project library with delete functionality
- Basic text editor
- Firebase integration for data persistence

## Setup

1. Clone the repository
```bash
git clone https://github.com/MoisesCard/storyforge.git
cd storyforge           
```
2. Install dependencies
```bash
npm install
```

3. Environment Setup
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials
bash
cp .env.example .env

4. Start the development server
```bash
npm start
```


## Tech Stack
- React
- Firebase/Firestore
- Chakra UI
- Zustand for state management
- React Router for navigation

## Project Structure
src/
├── components/ # Reusable components
├── pages/ # Page components
├── stores/ # State management
├── config/ # Configuration files
└── styles/ # CSS and theme files


## Version
Current version: v0.1.0-beta.1

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request