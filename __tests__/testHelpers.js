/**
 * Test helpers for setting up DOM environment and mocks
 */

/**
 * Creates a minimal HTML structure required for tests
 */
function setupDOM() {
  document.body.innerHTML = `
    <header>
      <h1>Mergington High School</h1>
      <h2>Extracurricular Activities</h2>
      <div id="user-controls">
        <button id="dark-mode-toggle" aria-label="Toggle dark mode">🌙</button>
        <div id="user-status">
          <button id="login-button" class="icon-button">
            <span class="user-icon">👤</span>
            <span>Login</span>
          </button>
          <div id="user-info" class="hidden">
            <span id="display-name"></span>
            <button id="logout-button">Logout</button>
          </div>
        </div>
      </div>
    </header>
    
    <main>
      <section id="activities-container">
        <div class="main-content-layout">
          <aside class="sidebar-filters">
            <h3>Filter Activities</h3>
            <div class="search-box">
              <input type="text" id="activity-search" placeholder="Search activities..." />
              <button id="search-button" aria-label="Search">
                <span class="search-icon">🔍</span>
              </button>
            </div>
            
            <div class="filter-container">
              <div class="filter-label">Filter by category:</div>
              <div class="category-filters" id="category-filters">
                <button class="category-filter active" data-category="all">All</button>
                <button class="category-filter" data-category="sports">Sports</button>
                <button class="category-filter" data-category="arts">Arts</button>
                <button class="category-filter" data-category="academic">Academic</button>
                <button class="category-filter" data-category="community">Community</button>
                <button class="category-filter" data-category="technology">Technology</button>
              </div>
            </div>
            
            <div class="filter-container day-filter-container">
              <div class="filter-label">Filter by day:</div>
              <div class="day-filters" id="day-filters">
                <button class="day-filter active" data-day="">All Days</button>
                <button class="day-filter" data-day="Monday">Monday</button>
                <button class="day-filter" data-day="Tuesday">Tuesday</button>
                <button class="day-filter" data-day="Wednesday">Wednesday</button>
                <button class="day-filter" data-day="Thursday">Thursday</button>
                <button class="day-filter" data-day="Friday">Friday</button>
                <button class="day-filter" data-day="Saturday">Saturday</button>
                <button class="day-filter" data-day="Sunday">Sunday</button>
              </div>
            </div>
            
            <div class="filter-container time-filter-container">
              <div class="filter-label">Filter by time:</div>
              <div class="time-filters">
                <button class="time-filter active" data-time="">All Times</button>
                <button class="time-filter" data-time="morning">Before School</button>
                <button class="time-filter" data-time="afternoon">After School</button>
                <button class="time-filter" data-time="weekend">Weekend</button>
              </div>
            </div>
            
            <div class="filter-container difficulty-filter-container">
              <div class="filter-label">Filter by difficulty:</div>
              <div class="difficulty-filters">
                <button class="difficulty-filter active" data-difficulty="">All Levels</button>
                <button class="difficulty-filter" data-difficulty="Beginner">Beginner</button>
                <button class="difficulty-filter" data-difficulty="Intermediate">Intermediate</button>
                <button class="difficulty-filter" data-difficulty="Advanced">Advanced</button>
              </div>
            </div>
          </aside>
          
          <div class="main-content">
            <div id="activities-list"></div>
            <div id="message" class="hidden"></div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Registration Modal -->
    <div id="registration-modal" class="modal hidden">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3>Register Student</h3>
        <h4 id="modal-activity-name"></h4>
        <form id="signup-form">
          <input type="hidden" id="activity" name="activity" />
          <label for="email">Student Email:</label>
          <input type="email" id="email" name="email" required />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
    
    <!-- Login Modal -->
    <div id="login-modal" class="modal hidden">
      <div class="modal-content">
        <span class="close-login-modal">&times;</span>
        <h3>Teacher Login</h3>
        <form id="login-form">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <button type="submit">Login</button>
        </form>
        <div id="login-message" class="hidden"></div>
      </div>
    </div>
  `;
}

/**
 * Mock data for activities
 */
const mockActivities = {
  "Chess Club": {
    description: "Learn and practice chess strategies in academic competitions",
    schedule: "Mondays and Wednesdays, 3:30 PM - 5:00 PM",
    schedule_details: {
      days: ["Monday", "Wednesday"],
      start_time: "15:30",
      end_time: "17:00"
    },
    max_participants: 20,
    participants: ["student1@example.com", "student2@example.com"],
    difficulty: "Beginner"
  },
  "Soccer Practice": {
    description: "Join our soccer team for training and sports activities",
    schedule: "Tuesdays and Thursdays, 4:00 PM - 5:30 PM",
    schedule_details: {
      days: ["Tuesday", "Thursday"],
      start_time: "16:00",
      end_time: "17:30"
    },
    max_participants: 25,
    participants: ["student3@example.com"],
    difficulty: "Intermediate"
  },
  "Art Workshop": {
    description: "Creative arts and painting sessions for artistic expression",
    schedule: "Fridays, 3:15 PM - 5:00 PM",
    schedule_details: {
      days: ["Friday"],
      start_time: "15:15",
      end_time: "17:00"
    },
    max_participants: 15,
    participants: [],
    difficulty: "Beginner"
  },
  "Weekend Coding": {
    description: "Learn programming and technology on weekends",
    schedule: "Saturdays, 10:00 AM - 12:00 PM",
    schedule_details: {
      days: ["Saturday"],
      start_time: "10:00",
      end_time: "12:00"
    },
    max_participants: 20,
    participants: ["student4@example.com", "student5@example.com", "student6@example.com"]
  },
  "Sunday Robotics": {
    description: "Build and program robots with technology",
    schedule: "Sundays, 2:00 PM - 4:00 PM",
    schedule_details: {
      days: ["Sunday"],
      start_time: "14:00",
      end_time: "16:00"
    },
    max_participants: 12,
    participants: ["student7@example.com"]
  },
  "Full Activity": {
    description: "This academic activity is completely full",
    schedule: "Mondays, 3:30 PM - 4:30 PM",
    schedule_details: {
      days: ["Monday"],
      start_time: "15:30",
      end_time: "16:30"
    },
    max_participants: 2,
    participants: ["student8@example.com", "student9@example.com"]
  }
};

/**
 * Mock user data
 */
const mockUser = {
  username: "teacher1",
  display_name: "Ms. Johnson",
  role: "teacher"
};

/**
 * Setup fetch mock with controlled responses
 * Note: The mock matches the actual API implementation which uses query parameters
 * for authentication (not request body). This is intentional to match app.js behavior.
 */
function setupFetchMock() {
  global.fetch = jest.fn((url, options) => {
    // Parse URL to handle both relative and absolute URLs
    // Using 'http://localhost' as base for relative URL resolution
    const urlObj = new URL(url, 'http://localhost');
    const pathname = urlObj.pathname;
    
    // Mock /activities endpoint
    if (pathname === '/activities') {
      return Promise.resolve({
        ok: true,
        json: async () => mockActivities
      });
    }
    
    // Mock /auth/login endpoint
    if (pathname === '/auth/login') {
      const username = urlObj.searchParams.get('username');
      const password = urlObj.searchParams.get('password');
      
      if (username === 'teacher1' && password === 'password') {
        return Promise.resolve({
          ok: true,
          json: async () => mockUser
        });
      } else {
        return Promise.resolve({
          ok: false,
          json: async () => ({ detail: 'Invalid username or password' })
        });
      }
    }
    
    // Mock /auth/check-session endpoint
    if (pathname === '/auth/check-session') {
      const username = urlObj.searchParams.get('username');
      if (username === 'teacher1') {
        return Promise.resolve({
          ok: true,
          json: async () => mockUser
        });
      } else {
        return Promise.resolve({
          ok: false,
          json: async () => ({ detail: 'Session invalid' })
        });
      }
    }
    
    // Mock signup endpoint
    if (pathname.includes('/signup')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ 
          message: 'Student registered successfully',
          activity: pathname.split('/')[2],
          participants: [...mockActivities["Chess Club"].participants, 'newstudent@example.com']
        })
      });
    }
    
    // Mock unregister endpoint
    if (pathname.includes('/unregister')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ 
          message: 'Student unregistered successfully'
        })
      });
    }
    
    // Default response
    return Promise.resolve({
      ok: false,
      json: async () => ({ detail: 'Not found' })
    });
  });
}

/**
 * Setup localStorage mock
 */
function setupLocalStorageMock() {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
}

/**
 * Clean up after each test
 */
function cleanupTest() {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
  if (window.localStorage) {
    window.localStorage.clear();
  }
}

/**
 * Wait for DOM updates and animations
 */
function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Trigger DOMContentLoaded event
 */
function triggerDOMContentLoaded() {
  const event = new Event('DOMContentLoaded', {
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
}

module.exports = {
  setupDOM,
  mockActivities,
  mockUser,
  setupFetchMock,
  setupLocalStorageMock,
  cleanupTest,
  waitFor,
  triggerDOMContentLoaded
};
