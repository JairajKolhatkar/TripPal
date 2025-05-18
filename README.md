# Interactive Itinerary Board

A modern, interactive travel itinerary planner with drag-and-drop functionality for organizing daily activities. Built with React, Tailwind CSS, and Framer Motion.

![Itinerary Board Demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2QxYXZndm52ZmF1c3hrOGlsaGN2eHZoMDM0dXFkZzU0NmhyamZiNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378yMgn5U8gyjug8/giphy.gif)

## Features

- **Interactive Drag-and-Drop Interface**: Easily reorder activities and move them between days
- **Customizable Day Plans**: Add, edit, and remove days and activities
- **Activity Types**: Categorize activities by type (meal, attraction, leisure, travel)
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Your itinerary is saved automatically in your browser
- **Animated UI**: Smooth animations and transitions for a modern user experience

## Tech Stack

- **React** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Beautiful DnD** - Drag and drop library
- **Framer Motion** - Animation library
- **UUID** - Unique ID generation

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/interactive-itinerary-board.git
   cd interactive-itinerary-board
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and visit `http://localhost:3000`

## Usage

- **Add a Day**: Click the "Add Day" button in the header
- **Add Activities**: Click the "+" button on any day column
- **Edit Day Title**: Click on the day title to edit
- **Reorder Activities**: Drag and drop activities within or between days
- **Reorder Days**: Drag and drop entire day columns to reorder them
- **Delete Activity**: Click the "x" button on any activity
- **Delete Day**: Click the trash icon on the day header

## Build for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build files will be in the `build` directory.

## Credits

- GIFs from [GIPHY](https://giphy.com/)
- Icons and UI inspiration from [Heroicons](https://heroicons.com/) and [Tailwind UI](https://tailwindui.com/)
- Project inspired by Trello and other Kanban-style boards

## License

MIT License 