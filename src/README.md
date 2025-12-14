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

## Development Guide

For detailed setup and development instructions, please refer to our [Development Guide](../docs/how-to-develop.md).
