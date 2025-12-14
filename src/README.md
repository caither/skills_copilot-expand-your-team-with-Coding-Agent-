# Mergington High School Activities

A comprehensive web application that enables teachers to manage and students to explore extracurricular activities at Mergington High School.

## Features

### Activity Management
- **Browse Activities**: View all available extracurricular activities with detailed information including:
  - Activity descriptions
  - Schedules with formatted times
  - Enrollment capacity and current participant count
  - Activity categories (Sports, Arts, Academic, Community, Technology)

### Teacher Authentication
- **Secure Login**: Teacher accounts with password-protected access
- **Session Management**: Persistent login sessions with automatic validation

### Student Registration (Teacher-Only)
- **Register Students**: Teachers can enroll students in activities using their school email
- **Unregister Students**: Teachers can remove students from activities
- **Duplicate Prevention**: System prevents students from signing up for the same activity twice

### Advanced Filtering & Search
- **Search**: Find activities by name or description
- **Category Filter**: Filter by activity type (Sports, Arts, Academic, Community, Technology)
- **Day Filter**: View activities by day of the week (Monday-Sunday)
- **Time Filter**: Filter by schedule:
  - Before School (morning activities)
  - After School (afternoon activities)
  - Weekend activities

### Technology Stack
- **Backend**: FastAPI with Python
- **Database**: MongoDB for persistent data storage
- **Frontend**: Vanilla JavaScript with responsive CSS
- **API**: RESTful API with automatic documentation
- **Testing**: Jest with JSDOM for JavaScript unit and integration tests

## Testing

This project includes comprehensive testing for the JavaScript frontend using Jest and JSDOM.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:
- **Initial Load Behavior**: Skeleton loading and activity card display
- **Category and Search Filtering**: Client-side filtering functionality
- **Authentication Flow**: Login process and UI updates
- **Registration Features**: Student enrollment when authenticated
- **Access Control**: Restrictions for unauthenticated users
- **Weekend Filtering**: Frontend-only time filtering logic
- **Test Cleanup**: Proper test isolation and cleanup

All tests are located in the `__tests__/` directory.

## Development Guide

For detailed setup and development instructions, please refer to our [Development Guide](../docs/how-to-develop.md).
