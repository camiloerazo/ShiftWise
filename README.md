# ShiftWise - Modern Work Schedule Manager

![ShiftWise](https://img.shields.io/badge/ShiftWise-Work%20Schedule%20Manager-purple)
![Next.js](https://img.shields.io/badge/Next.js-13.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC)

ShiftWise is a modern, intuitive work schedule management application designed to streamline the process of creating and managing employee schedules. Built with a focus on user experience and efficiency, it provides a powerful yet simple interface for managing worker shifts and tracking hours. 

## 🌟 Features

### Core Functionality
- **Interactive Schedule Grid**
  - Half-hour increment scheduling from Monday to Sunday
  - Visual color-coded worker assignments
  - Drag-and-drop shift management
  - Real-time schedule updates

### Worker Management
- **Comprehensive Worker Profiles**
  - Add and manage worker profiles
  - Custom color coding for easy identification
  - Automatic hour tracking per worker
  - Worker availability management

### Schedule Features
- **Smart Scheduling Tools**
  - Weekly hour tracking and calculations
  - Multiple worker assignments per time slot
  - Schedule export functionality
  - Visual schedule representation

### User Experience
- **Modern, Responsive Design**
  - Mobile-first approach
  - Responsive layout for all devices
  - Intuitive user interface
  - Smooth animations and transitions
  - Accessibility features (ARIA labels, keyboard navigation)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: 
  - TailwindCSS
  - CSS Modules
  - Custom utility classes
- **UI Components**: 
  - shadcn/ui
  - Radix UI primitives
  - Lucide icons

### State Management & Data Persistence
- React Hooks (useState, useEffect, useCallback, useMemo)
- Local Storage for data persistence
- Client-side data management

### Development Tools
- ESLint for code linting
- TypeScript for type safety
- Modern JavaScript features
- Component-based architecture

## 🚀 Getting Started

### Prerequisites
- Node.js 16.8 or later
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shiftwise.git
   cd shiftwise
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💡 Usage

1. **Adding Workers**
   - Click the "Add Worker" button
   - Enter worker details
   - Assign a unique color for identification

2. **Managing Schedule**
   - Select a worker from the list
   - Click on time slots to assign/unassign shifts
   - View total hours per worker in real-time

3. **Exporting Schedule**
   - Use the download button to export the current schedule
   - Schedule is exported as a high-quality PNG image

## 🎨 Design System

### Colors
- Primary: Soft Purple (#B19CD9)
- Background: Light Gray (#F0F0F0)
- Accent: Teal (#4DB6AC)
- Custom worker colors for easy identification

### Typography
- Font Family: PT Sans (sans-serif)
- Responsive text sizing
- Clear hierarchy with different font weights

## 🔒 Data Management

- All data is stored locally in the browser
- Automatic data persistence using localStorage
- Data migration support for future updates
- Secure client-side data handling

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layout
- Adaptive components for different screen sizes
- Touch-friendly interface
- Optimized for both desktop and mobile devices

## 🔍 Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Semantic HTML structure
- Focus management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

Created by Camilo Erazo

---

Built with ❤️ using Next.js and modern web technologies
