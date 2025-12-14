# 測試指南 (Testing Guide)

## 概述 (Overview)

本專案使用 **Jest** 與 **JSDOM** 為 JavaScript 前端程式碼提供完整的單元測試與整合測試。

## 測試環境設定 (Test Environment Setup)

### 依賴項目 (Dependencies)

- **Jest**: JavaScript 測試框架
- **jest-environment-jsdom**: 提供 DOM 環境模擬

### 安裝 (Installation)

```bash
npm install
```

## 執行測試 (Running Tests)

### 基本指令 (Basic Commands)

```bash
# 執行所有測試
npm test

# 監看模式（檔案變更時自動重新執行）
npm run test:watch

# 產生測試覆蓋率報告
npm run test:coverage
```

### 測試結果解讀 (Understanding Test Results)

執行測試後會看到類似以下的輸出：

```
PASS  __tests__/app.test.js
  Activity Management System
    初始載入行為 (Initial Load Behavior)
      ✓ 應在初始化後立即顯示 skeleton (116 ms)
      ✓ API 回傳後應顯示活動卡片 (169 ms)
      ...

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        5.443 s
```

## 測試架構 (Test Structure)

### 檔案組織 (File Organization)

```
__tests__/
├── app.test.js         # 主要測試檔案
└── testHelpers.js      # 測試輔助工具與 mock 設定
```

### 測試輔助工具 (Test Helpers)

`testHelpers.js` 提供以下功能：

1. **setupDOM()**: 建立測試所需的 HTML 結構
2. **setupFetchMock()**: 模擬 fetch API 請求
3. **setupLocalStorageMock()**: 模擬 localStorage
4. **cleanupTest()**: 清理測試環境
5. **triggerDOMContentLoaded()**: 觸發 DOM 載入事件
6. **waitFor(ms)**: 等待非同步操作完成

## 測試涵蓋範圍 (Test Coverage)

### 1. 初始載入行為 (Initial Load Behavior)

測試應用程式啟動時的載入流程：

- 顯示 skeleton loading 畫面
- 從 API 載入活動資料
- 正確顯示活動卡片，包含名額、狀態、時間格式

**測試案例數**: 3

### 2. 分類與搜尋篩選 (Category and Search Filtering)

測試客戶端篩選功能：

- 依分類篩選活動（Sports、Arts、Academic 等）
- 即時搜尋功能
- 篩選結果正確性

**測試案例數**: 2

### 3. 登入流程與介面更新 (Login Flow and UI Updates)

測試教師登入功能：

- 開啟登入視窗
- 表單驗證與提交
- 模擬 API 回應
- UI 狀態更新（顯示使用者名稱、隱藏登入按鈕）

**測試案例數**: 3

### 4. 已登入狀態下的報名功能 (Registration when Logged In)

測試教師報名學生功能：

- 點擊 "Register Student" 按鈕
- 開啟報名視窗
- 自動填入活動名稱
- 驗證表單欄位

**測試案例數**: 2

### 5. 未登入狀態限制操作 (Restrictions when Not Logged In)

測試存取控制：

- 未登入時不顯示刪除按鈕
- 顯示登入提示訊息

**測試案例數**: 2

### 6. 週末活動篩選（前端） (Weekend Activity Filtering)

測試前端時間篩選：

- 點擊週末篩選按鈕
- 僅顯示週六、週日的活動
- **重要**: 確認不會傳送 `start_time` 或 `end_time` 參數至後端 API

**測試案例數**: 3

### 7. 測試清理 (Test Cleanup)

驗證測試環境正確清理：

- DOM 重置
- fetch mock 重設
- localStorage 清空

**測試案例數**: 3

## Mock 資料結構 (Mock Data Structure)

### 活動資料範例 (Activity Example)

```javascript
{
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
  }
}
```

### 使用者資料範例 (User Example)

```javascript
{
  username: "teacher1",
  display_name: "Ms. Johnson",
  role: "teacher"
}
```

## 測試前置作業 (Test Setup Process)

每個測試會執行以下步驟：

1. **設定 DOM 環境**: 使用 `setupDOM()` 建立必要的 HTML 元素
2. **設定 Mock**:
   - `setupFetchMock()`: 模擬 API 請求與回應
   - `setupLocalStorageMock()`: 模擬瀏覽器儲存
3. **載入應用程式**: 執行 `app.js` 程式碼
4. **觸發初始化**: 呼叫 `triggerDOMContentLoaded()` 啟動應用程式
5. **執行測試**: 驗證功能正確性
6. **清理環境**: 使用 `cleanupTest()` 重置測試環境

## API Mock 行為 (API Mock Behavior)

### GET /activities

回傳模擬的活動清單，包含 6 個預設活動（Chess Club、Soccer Practice、Art Workshop、Weekend Coding、Sunday Robotics、Full Activity）。

### POST /auth/login

- **成功**: `username=teacher1`, `password=password` → 回傳使用者資料
- **失敗**: 其他組合 → 回傳錯誤訊息

### GET /auth/check-session

驗證使用者 session：
- `username=teacher1` → 回傳使用者資料
- 其他 → 回傳 session 失效

### POST /activities/:name/signup

模擬學生報名成功。

### POST /activities/:name/unregister

模擬學生取消報名成功。

## 撰寫新測試 (Writing New Tests)

### 基本模板 (Basic Template)

```javascript
test('測試描述', async () => {
  // 等待應用程式初始化
  await waitFor(100);
  
  // 執行操作
  const button = document.getElementById('my-button');
  button.click();
  
  // 等待 UI 更新
  await waitFor(50);
  
  // 驗證結果
  const result = document.getElementById('result');
  expect(result.textContent).toBe('預期的文字');
});
```

### 最佳實踐 (Best Practices)

1. **使用適當的等待時間**: 使用 `waitFor()` 確保非同步操作完成
2. **獨立測試**: 每個測試應獨立運作，不依賴其他測試
3. **清楚的描述**: 使用清楚的測試名稱說明測試目的
4. **完整的驗證**: 不只驗證成功案例，也要測試錯誤處理
5. **避免脆弱測試**: 不要依賴具體的實作細節，專注於行為驗證

## 測試覆蓋率報告 (Coverage Report)

執行 `npm run test:coverage` 後，會產生覆蓋率報告：

```
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |   XX.XX |    XX.XX |   XX.XX |   XX.XX |                   
 src/static    |   XX.XX |    XX.XX |   XX.XX |   XX.XX |                   
  app.js       |   XX.XX |    XX.XX |   XX.XX |   XX.XX | ...               
---------------|---------|----------|---------|---------|-------------------
```

詳細的 HTML 報告位於 `coverage/lcov-report/index.html`。

## 疑難排解 (Troubleshooting)

### 測試執行緩慢

- 確認沒有不必要的長時間等待
- 檢查是否有未清理的定時器或事件監聽器

### Mock 未正確運作

- 確認 `setupFetchMock()` 在測試開始前被呼叫
- 檢查 URL 模式是否正確匹配

### DOM 元素找不到

- 確認 `setupDOM()` 已建立所有必要元素
- 檢查元素 ID 或 class 是否正確

### 記憶體洩漏警告

- 確保每個測試後呼叫 `cleanupTest()`
- 檢查是否有未清理的全域變數或事件監聽器

## 持續整合 (Continuous Integration)

測試可整合至 CI/CD 流程：

```yaml
# GitHub Actions 範例
- name: Run tests
  run: npm test
  
- name: Upload coverage
  run: npm run test:coverage
```

## 參考資源 (References)

- [Jest 官方文件](https://jestjs.io/docs/getting-started)
- [JSDOM 文件](https://github.com/jsdom/jsdom)
- [Testing Best Practices](https://testingjavascript.com/)
