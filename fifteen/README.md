# fifteen

A mobile-first iOS app built with SwiftUI that helps users document their day in 15-minute increments.

## Features

### Core Functionality
- **15-Minute Timeline**: Automatically generates a timeline divided into 15-minute blocks between wake and sleep times
- **Activity Tracking**: Three activity types with color coding:
  - 🟢 **Green**: Productive activities
  - 🟡 **Yellow**: Life activities  
  - 🔴 **Red**: Unproductive activities
- **Quick Actions**: 
  - Single tap to select activity
  - Double tap to mark as "same as previous"

### User Experience
- **First-Time Setup**: Simple wake and sleep time configuration
- **Vertical Timeline**: Clean, scrollable interface for easy navigation
- **Daily Summary**: Visual overview of time distribution with percentages
- **Calendar Navigation**: Browse and edit previous days
- **Local-First**: No login required, all data stored locally

### Technical Features
- **SwiftUI**: Modern iOS development framework
- **Local Storage**: UserDefaults for data persistence
- **Responsive Design**: Mobile-first interface optimized for iOS
- **Custom Colors**: Tailored color scheme for activities

## Getting Started

### Prerequisites
- Xcode 15.0+
- iOS 17.0+
- Swift 5.9+

### Installation
1. Clone the repository
2. Open `fifteen.xcodeproj` in Xcode
3. Build and run on your iOS device or simulator

### First Use
1. Launch the app
2. Set your wake-up time
3. Set your sleep time
4. Start tracking your day by tapping on time blocks

## Usage

### Adding Activities
- **Tap** any 15-minute block to open the activity picker
- **Select** from Productive (green), Life (yellow), or Unproductive (red)
- **Double-tap** to quickly mark as "same as previous"

### Navigating Days
- **Tap** the date header to open the calendar picker
- **Select** any date to view or edit that day's timeline
- **Scroll** through your timeline vertically

### Understanding Your Day
- **Daily Summary** shows percentage breakdown at the top
- **Progress Bar** provides visual representation of time distribution
- **Completion Counter** shows filled vs. total blocks

## Architecture

### Models
- `ActivityType`: Enum for the three activity categories
- `TimeBlock`: Individual 15-minute time slots
- `DayData`: Complete day with timeline and statistics

### Views
- `SetupView`: First-time configuration
- `TimelineView`: Main timeline interface
- `TimeBlockView`: Individual time block display
- `DailySummaryView`: Daily statistics overview

### Data Management
- `DataManager`: Handles data persistence and business logic
- Local storage using UserDefaults
- Automatic timeline generation based on wake/sleep times

## Design Principles

- **Minimal**: Clean, distraction-free interface
- **Fast**: Quick activity logging in under a minute
- **Intuitive**: Simple tap and double-tap interactions
- **Mobile-First**: Optimized for iOS devices and touch interaction

## Future Enhancements

### Stretch Goals
- Activity tags with auto-color coding
- Export functionality (image/text)
- Goal setting and tracking
- Data analytics and insights
- Cloud sync (optional)

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

Personal use project - not for commercial distribution.
