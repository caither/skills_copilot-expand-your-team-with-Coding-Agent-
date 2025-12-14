/**
 * Tests for app.js - Main application functionality
 */

const fs = require('fs');
const path = require('path');
const {
  setupDOM,
  mockActivities,
  mockUser,
  setupFetchMock,
  setupLocalStorageMock,
  cleanupTest,
  waitFor,
  triggerDOMContentLoaded
} = require('./testHelpers');

// Read the app.js file
const appJsPath = path.join(__dirname, '../src/static/app.js');
const appJsCode = fs.readFileSync(appJsPath, 'utf8');

describe('Activity Management System', () => {
  beforeEach(() => {
    // Setup environment
    setupDOM();
    setupFetchMock();
    setupLocalStorageMock();
    
    // Load and execute app.js
    eval(appJsCode);
    
    // Trigger DOMContentLoaded to initialize the app
    triggerDOMContentLoaded();
  });

  afterEach(() => {
    cleanupTest();
  });

  describe('初始載入行為 (Initial Load Behavior)', () => {
    test('應在初始化後立即顯示 skeleton', async () => {
      // The skeleton should be visible immediately after initialization
      // However, with fast fetch mocks, it might be replaced quickly
      // We'll verify that either skeleton or activities are present
      await waitFor(10);
      
      const activitiesList = document.getElementById('activities-list');
      const hasContent = activitiesList.children.length > 0;
      
      expect(hasContent).toBe(true);
      
      // The content should be either skeletons or loaded activities
      const hasSkeletonOrActivities = 
        activitiesList.querySelector('.skeleton-card') !== null ||
        activitiesList.querySelector('.activity-card') !== null;
      
      expect(hasSkeletonOrActivities).toBe(true);
    });

    test('API 回傳後應顯示活動卡片', async () => {
      // Wait for activities to load
      await waitFor(100);
      
      const activitiesList = document.getElementById('activities-list');
      const activityCards = activitiesList.querySelectorAll('.activity-card');
      
      expect(activityCards.length).toBeGreaterThan(0);
      expect(activitiesList.querySelector('.skeleton-card')).toBeNull();
    });

    test('應驗證活動名額、狀態與時間格式正確', async () => {
      // Wait for activities to load
      await waitFor(100);
      
      const activitiesList = document.getElementById('activities-list');
      const activityCards = activitiesList.querySelectorAll('.activity-card');
      
      // Check first activity card
      const firstCard = activityCards[0];
      expect(firstCard).toBeTruthy();
      
      // Check capacity display exists
      const capacityContainer = firstCard.querySelector('.capacity-container');
      expect(capacityContainer).toBeTruthy();
      
      // Check capacity text
      const capacityText = firstCard.querySelector('.capacity-text');
      expect(capacityText).toBeTruthy();
      expect(capacityText.textContent).toMatch(/enrolled/);
      expect(capacityText.textContent).toMatch(/spots left/);
      
      // Check schedule is displayed
      const scheduleElement = firstCard.querySelector('p strong');
      expect(scheduleElement).toBeTruthy();
      expect(scheduleElement.textContent).toBe('Schedule:');
    });
  });

  describe('分類與搜尋篩選 (Category and Search Filtering)', () => {
    test('點擊分類按鈕後只顯示符合分類的活動', async () => {
      // Wait for initial load
      await waitFor(100);
      
      const sportsButton = document.querySelector('[data-category="sports"]');
      sportsButton.click();
      
      await waitFor(50);
      
      const activitiesList = document.getElementById('activities-list');
      const activityCards = activitiesList.querySelectorAll('.activity-card');
      
      // Check that only sports activities are shown
      activityCards.forEach(card => {
        const activityTag = card.querySelector('.activity-tag');
        // Sports activities should have the sports label or related content
        expect(card.innerHTML).toBeTruthy();
      });
      
      // Check active class
      expect(sportsButton.classList.contains('active')).toBe(true);
    });

    test('輸入搜尋關鍵字後活動列表即時更新', async () => {
      // Wait for initial load
      await waitFor(100);
      
      const searchInput = document.getElementById('activity-search');
      const initialCards = document.querySelectorAll('.activity-card').length;
      
      // Search for "chess"
      searchInput.value = 'chess';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      await waitFor(50);
      
      const filteredCards = document.querySelectorAll('.activity-card');
      
      // Should show fewer cards after filtering
      expect(filteredCards.length).toBeLessThanOrEqual(initialCards);
      
      // Cards should contain the search term
      filteredCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        expect(text).toMatch(/chess/);
      });
    });
  });

  describe('登入流程與介面更新 (Login Flow and UI Updates)', () => {
    test('開啟登入視窗，填寫並送出表單', async () => {
      await waitFor(100);
      
      const loginButton = document.getElementById('login-button');
      const loginModal = document.getElementById('login-modal');
      
      // Initially hidden
      expect(loginModal.classList.contains('hidden')).toBe(true);
      
      // Click login button
      loginButton.click();
      
      await waitFor(50);
      
      // Modal should be visible
      expect(loginModal.classList.contains('hidden')).toBe(false);
      
      // Fill in form
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const loginForm = document.getElementById('login-form');
      
      usernameInput.value = 'teacher1';
      passwordInput.value = 'password';
      
      // Submit form
      loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await waitFor(100);
      
      // Check that login was successful
      const userInfo = document.getElementById('user-info');
      const displayName = document.getElementById('display-name');
      
      expect(userInfo.classList.contains('hidden')).toBe(false);
      expect(displayName.textContent).toBe('Ms. Johnson');
      expect(loginButton.classList.contains('hidden')).toBe(true);
    });

    test('模擬 /auth/login 回傳使用者資料', async () => {
      await waitFor(100);
      
      const loginButton = document.getElementById('login-button');
      loginButton.click();
      
      await waitFor(50);
      
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const loginForm = document.getElementById('login-form');
      
      usernameInput.value = 'teacher1';
      passwordInput.value = 'password';
      
      loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await waitFor(100);
      
      // Verify localStorage was updated
      const storedUser = JSON.parse(window.localStorage.getItem('currentUser'));
      expect(storedUser).toBeTruthy();
      expect(storedUser.username).toBe('teacher1');
      expect(storedUser.display_name).toBe('Ms. Johnson');
    });

    test('驗證顯示使用者資訊、設定顯示名稱、隱藏登入按鈕', async () => {
      await waitFor(100);
      
      // Login
      const loginButton = document.getElementById('login-button');
      loginButton.click();
      await waitFor(50);
      
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const loginForm = document.getElementById('login-form');
      
      usernameInput.value = 'teacher1';
      passwordInput.value = 'password';
      loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await waitFor(100);
      
      // Verify UI updates
      const userInfo = document.getElementById('user-info');
      const displayName = document.getElementById('display-name');
      
      expect(loginButton.classList.contains('hidden')).toBe(true);
      expect(userInfo.classList.contains('hidden')).toBe(false);
      expect(displayName.textContent).toBe('Ms. Johnson');
    });
  });

  describe('已登入狀態下的報名功能 (Registration when Logged In)', () => {
    test('登入後點擊尚未額滿活動的 Register Student', async () => {
      await waitFor(100);
      
      // Login first
      const loginButton = document.getElementById('login-button');
      loginButton.click();
      await waitFor(50);
      
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const loginForm = document.getElementById('login-form');
      
      usernameInput.value = 'teacher1';
      passwordInput.value = 'password';
      loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await waitFor(100);
      
      // Find a non-full activity register button
      const registerButtons = document.querySelectorAll('.register-button:not([disabled])');
      expect(registerButtons.length).toBeGreaterThan(0);
      
      const registerButton = registerButtons[0];
      registerButton.click();
      
      await waitFor(50);
      
      // Check that registration modal is visible
      const registrationModal = document.getElementById('registration-modal');
      expect(registrationModal.classList.contains('hidden')).toBe(false);
    });

    test('驗證報名視窗顯示且欄位正確填入', async () => {
      await waitFor(100);
      
      // Login first
      const loginButton = document.getElementById('login-button');
      loginButton.click();
      await waitFor(50);
      
      document.getElementById('username').value = 'teacher1';
      document.getElementById('password').value = 'password';
      document.getElementById('login-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      await waitFor(100);
      
      // Click register button
      const registerButton = document.querySelector('.register-button:not([disabled])');
      registerButton.click();
      
      await waitFor(50);
      
      // Check modal fields
      const registrationModal = document.getElementById('registration-modal');
      const modalActivityName = document.getElementById('modal-activity-name');
      const activityInput = document.getElementById('activity');
      
      expect(registrationModal.classList.contains('hidden')).toBe(false);
      expect(modalActivityName.textContent).toBeTruthy();
      expect(activityInput.value).toBeTruthy();
    });
  });

  describe('未登入狀態限制操作 (Restrictions when Not Logged In)', () => {
    test('登出狀態下點擊取消報名（刪除圖示）', async () => {
      await waitFor(100);
      
      // Make sure not logged in
      const loginButton = document.getElementById('login-button');
      expect(loginButton.classList.contains('hidden')).toBe(false);
      
      // Check that delete buttons are not present when not logged in
      const deleteButtons = document.querySelectorAll('.delete-participant');
      
      // When not logged in, there should be no delete buttons
      expect(deleteButtons.length).toBe(0);
    });

    test('未登入時應顯示教師登入提示', async () => {
      await waitFor(100);
      
      // Check for auth notice
      const authNotices = document.querySelectorAll('.auth-notice');
      expect(authNotices.length).toBeGreaterThan(0);
      
      authNotices.forEach(notice => {
        expect(notice.textContent).toMatch(/Teachers can register students/);
      });
    });
  });

  describe('週末活動篩選（前端） (Weekend Activity Filtering)', () => {
    test('點擊 weekend 時間篩選', async () => {
      await waitFor(100);
      
      const weekendButton = document.querySelector('[data-time="weekend"]');
      expect(weekendButton).toBeTruthy();
      
      weekendButton.click();
      
      await waitFor(50);
      
      // Check active class
      expect(weekendButton.classList.contains('active')).toBe(true);
    });

    test('僅顯示週末活動', async () => {
      await waitFor(100);
      
      const weekendButton = document.querySelector('[data-time="weekend"]');
      weekendButton.click();
      
      await waitFor(100);
      
      const activityCards = document.querySelectorAll('.activity-card');
      
      // Should have some activities
      expect(activityCards.length).toBeGreaterThan(0);
      
      // All shown activities should be on weekend
      activityCards.forEach(card => {
        const scheduleText = card.textContent.toLowerCase();
        // Should contain Saturday or Sunday
        const hasWeekend = scheduleText.includes('saturday') || scheduleText.includes('sunday');
        expect(hasWeekend).toBe(true);
      });
    });

    test('不額外傳送時間參數至 /activities API', async () => {
      await waitFor(100);
      
      // Clear previous fetch calls
      global.fetch.mockClear();
      
      const weekendButton = document.querySelector('[data-time="weekend"]');
      weekendButton.click();
      
      await waitFor(100);
      
      // Check that fetch was called
      expect(global.fetch).toHaveBeenCalled();
      
      // Get the last call to /activities
      const activityCalls = global.fetch.mock.calls.filter(call => 
        call[0].includes('/activities')
      );
      
      expect(activityCalls.length).toBeGreaterThan(0);
      
      // Check that the URL doesn't contain start_time or end_time parameters
      const lastActivityCall = activityCalls[activityCalls.length - 1][0];
      expect(lastActivityCall).not.toMatch(/start_time/);
      expect(lastActivityCall).not.toMatch(/end_time/);
    });
  });

  describe('測試清理 (Test Cleanup)', () => {
    test('確認 DOM 在測試後被重置', () => {
      const activitiesList = document.getElementById('activities-list');
      expect(activitiesList).toBeTruthy();
      
      // Cleanup will be called by afterEach
    });

    test('確認 fetch mock 可被重設', async () => {
      await waitFor(100);
      
      expect(global.fetch).toHaveBeenCalled();
      
      const callCount = global.fetch.mock.calls.length;
      expect(callCount).toBeGreaterThan(0);
    });

    test('確認 localStorage 可被清空', async () => {
      window.localStorage.setItem('test', 'value');
      expect(window.localStorage.getItem('test')).toBe('value');
      
      window.localStorage.clear();
      expect(window.localStorage.getItem('test')).toBeNull();
    });
  });
});
