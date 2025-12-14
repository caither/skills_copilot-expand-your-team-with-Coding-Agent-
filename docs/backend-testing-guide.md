# Backend Testing Guide - Python/Pytest

## 概述 (Overview)

本專案使用 **pytest** 為 Python 後端程式碼提供單元測試。

## 測試環境設定 (Test Environment Setup)

### 依賴項目 (Dependencies)

測試相關套件已列在 [`src/requirements.txt`](../src/requirements.txt) 中：

- **pytest**: Python 測試框架
- **pytest-cov**: 測試覆蓋率報告工具
- **pytest-mock**: Mock 功能擴充
- **mongomock**: MongoDB mock 工具（用於資料庫測試）

### 安裝 (Installation)

```bash
pip install -r src/requirements.txt
```

## 執行測試 (Running Tests)

### 基本指令 (Basic Commands)

```bash
# 執行所有測試
pytest tests/

# 執行特定測試檔案
pytest tests/test_database.py

# 詳細輸出模式
pytest tests/test_database.py -v

# 產生測試覆蓋率報告
pytest tests/test_database.py --cov=backend.database --cov-report=term-missing

# 產生 HTML 覆蓋率報告
pytest tests/test_database.py --cov=backend.database --cov-report=html
```

### 測試結果解讀 (Understanding Test Results)

執行測試後會看到類似以下的輸出：

```
============================= test session starts ==============================
platform linux -- Python 3.13.9, pytest-8.3.4, pluggy-1.6.0
rootdir: /workspaces/skills_copilot-expand-your-team
configfile: pytest.ini
collected 27 items

tests/test_database.py::TestHashPassword::test_hash_password_returns_string PASSED [  3%]
tests/test_database.py::TestHashPassword::test_hash_password_produces_different_hashes PASSED [  7%]
...

============================== 27 passed in 1.37s ===============================

---------- coverage: platform linux, python 3.13.9-final-0 -----------
Name                      Stmts   Miss  Cover   Missing
-------------------------------------------------------
src/backend/database.py      18      0   100%
-------------------------------------------------------
TOTAL                        18      0   100%
```

## 測試架構 (Test Structure)

### 檔案組織 (File Organization)

```
tests/
├── __init__.py           # 測試套件初始化
└── test_database.py      # database.py 測試
```

### pytest.ini 配置

專案根目錄的 [`pytest.ini`](../pytest.ini) 包含測試配置：

- 測試檔案路徑：`tests/`
- 測試檔案命名規則：`test_*.py`
- 測試類別命名規則：`Test*`
- 測試函式命名規則：`test_*`

## 測試涵蓋範圍 (Test Coverage)

### test_database.py

測試 [`src/backend/database.py`](../src/backend/database.py) 的功能：

#### 1. TestHashPassword - 密碼雜湊功能

測試 `hash_password()` 函式：

- ✅ 回傳字串類型
- ✅ 相同密碼產生不同雜湊（salt）
- ✅ 雜湊值可被驗證
- ✅ 錯誤密碼無法通過驗證
- ✅ 處理空字串
- ✅ 處理特殊字元
- ✅ 處理 Unicode 字元

**測試案例數**: 7

#### 2. TestInitDatabase - 資料庫初始化功能

測試 `init_database()` 函式：

- ✅ 初始化空的資料庫集合
- ✅ 不重複初始化已有資料的集合
- ✅ 插入正確的活動資料結構
- ✅ 插入正確的教師資料結構

**測試案例數**: 4

#### 3. TestInitialData - 初始資料結構驗證

測試 `initial_activities` 和 `initial_teachers` 資料：

- ✅ 活動資料結構完整性
- ✅ 活動時間格式正確（HH:MM）
- ✅ 活動日期為有效星期名稱
- ✅ 最大參與人數為正數
- ✅ 參與者為列表且格式正確
- ✅ 部分活動包含 difficulty 欄位
- ✅ 教師資料結構完整性
- ✅ 教師密碼已雜湊
- ✅ 教師角色為有效值
- ✅ 教師 username 不重複

**測試案例數**: 10

#### 4. TestDataIntegrity - 資料完整性驗證

測試資料的邏輯正確性：

- ✅ 活動參與者不超過最大人數
- ✅ 活動結束時間在開始時間之後
- ✅ 存在週末活動
- ✅ 存在平日活動
- ✅ 至少有一位管理員
- ✅ 參與者 email 格式正確

**測試案例數**: 6

### 覆蓋率統計

- **Statements**: 18/18 (100%)
- **Missing**: 0
- **Coverage**: **100%**

## Mock 使用說明 (Mock Usage)

### MongoDB Collection Mock

使用 `unittest.mock.patch` 模擬 MongoDB 集合：

```python
@patch('backend.database.activities_collection')
@patch('backend.database.teachers_collection')
def test_init_database_populates_empty_collections(
    self, mock_teachers_collection, mock_activities_collection
):
    # 模擬空集合
    mock_activities_collection.count_documents.return_value = 0
    mock_teachers_collection.count_documents.return_value = 0

    # 執行初始化
    init_database()

    # 驗證行為
    mock_activities_collection.count_documents.assert_called_once_with({})
```

## 撰寫新測試 (Writing New Tests)

### 基本模板 (Basic Template)

```python
import pytest

class TestYourFunction:
    """測試描述"""

    def test_basic_functionality(self):
        """測試基本功能"""
        # Arrange - 準備測試資料
        input_data = "test"

        # Act - 執行被測試的函式
        result = your_function(input_data)

        # Assert - 驗證結果
        assert result == expected_value

    def test_edge_case(self):
        """測試邊界情況"""
        with pytest.raises(ValueError):
            your_function(invalid_input)
```

### 最佳實踐 (Best Practices)

1. **明確的測試名稱**: 使用描述性的測試名稱說明測試目的
2. **AAA 模式**: Arrange（準備）、Act（執行）、Assert（驗證）
3. **獨立測試**: 每個測試應獨立運作，不依賴其他測試
4. **測試單一功能**: 每個測試只驗證一個功能點
5. **完整的驗證**: 測試成功案例、失敗案例和邊界情況
6. **使用 fixture**: 重複使用的測試資料應使用 pytest fixture
7. **清楚的斷言**: 使用清楚的斷言訊息

### Pytest Fixture 範例

```python
@pytest.fixture
def sample_activity():
    """提供測試用的活動資料"""
    return {
        "description": "Test activity",
        "schedule": "Monday, 3:00 PM - 4:00 PM",
        "schedule_details": {
            "days": ["Monday"],
            "start_time": "15:00",
            "end_time": "16:00"
        },
        "max_participants": 20,
        "participants": []
    }

def test_with_fixture(sample_activity):
    """使用 fixture 的測試"""
    assert sample_activity["max_participants"] == 20
```

## 疑難排解 (Troubleshooting)

### 模組導入錯誤

如果遇到 `ModuleNotFoundError`，確認：

1. 測試檔案在 `tests/` 目錄中
2. `sys.path` 已正確設定（參考 test_database.py）
3. 從專案根目錄執行 pytest

### Mock 未正確運作

- 確認 mock 路徑正確（使用完整的模組路徑）
- 檢查 mock 是否在正確的時間點設定
- 使用 `mock.assert_called_with()` 驗證 mock 被正確呼叫

### 測試執行緩慢

- 避免在測試中連接真實資料庫
- 使用 mock 模擬外部服務
- 考慮使用 `pytest-xdist` 平行執行測試

## 持續整合 (Continuous Integration)

測試可整合至 CI/CD 流程：

```yaml
# GitHub Actions 範例
- name: Install dependencies
  run: pip install -r src/requirements.txt

- name: Run tests
  run: pytest tests/ -v

- name: Upload coverage
  run: pytest tests/ --cov=backend --cov-report=xml
```

## 參考資源 (References)

- [Pytest 官方文件](https://docs.pytest.org/)
- [pytest-cov 文件](https://pytest-cov.readthedocs.io/)
- [Python unittest.mock 文件](https://docs.python.org/3/library/unittest.mock.html)
- [Testing Best Practices](https://docs.python-guide.org/writing/tests/)
