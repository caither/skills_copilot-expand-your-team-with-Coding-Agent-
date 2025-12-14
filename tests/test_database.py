"""
Tests for database.py - MongoDB database configuration and setup
"""

import sys
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

import pytest
from unittest.mock import Mock, patch, MagicMock
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Import functions to test
from backend.database import (
    hash_password,
    init_database,
    initial_activities,
    initial_teachers
)


class TestHashPassword:
    """測試密碼雜湊功能 (Test password hashing functionality)"""

    def test_hash_password_returns_string(self):
        """測試 hash_password 回傳字串"""
        result = hash_password("test_password")
        assert isinstance(result, str)
        assert len(result) > 0

    def test_hash_password_produces_different_hashes(self):
        """測試相同密碼產生不同的雜湊（因為 salt）"""
        password = "same_password"
        hash1 = hash_password(password)
        hash2 = hash_password(password)

        # 雜湊值應該不同（因為每次使用不同的 salt）
        assert hash1 != hash2

    def test_hash_password_can_be_verified(self):
        """測試產生的雜湊值可以被驗證"""
        password = "verify_me"
        hashed = hash_password(password)

        # 使用 Argon2 驗證
        ph = PasswordHasher()
        try:
            ph.verify(hashed, password)
            verified = True
        except VerifyMismatchError:
            verified = False

        assert verified is True

    def test_hash_password_verification_fails_with_wrong_password(self):
        """測試錯誤密碼無法通過驗證"""
        password = "correct_password"
        wrong_password = "wrong_password"
        hashed = hash_password(password)

        ph = PasswordHasher()
        with pytest.raises(VerifyMismatchError):
            ph.verify(hashed, wrong_password)

    def test_hash_password_handles_empty_string(self):
        """測試處理空字串"""
        result = hash_password("")
        assert isinstance(result, str)
        assert len(result) > 0

    def test_hash_password_handles_special_characters(self):
        """測試處理特殊字元"""
        special_password = "P@ssw0rd!#$%^&*()"
        result = hash_password(special_password)
        assert isinstance(result, str)

        # 驗證可以正確處理
        ph = PasswordHasher()
        ph.verify(result, special_password)

    def test_hash_password_handles_unicode(self):
        """測試處理 Unicode 字元"""
        unicode_password = "密碼123パスワード"
        result = hash_password(unicode_password)
        assert isinstance(result, str)

        # 驗證可以正確處理
        ph = PasswordHasher()
        ph.verify(result, unicode_password)


class TestInitDatabase:
    """測試資料庫初始化功能 (Test database initialization functionality)"""

    @patch('backend.database.activities_collection')
    @patch('backend.database.teachers_collection')
    def test_init_database_populates_empty_collections(
        self, mock_teachers_collection, mock_activities_collection
    ):
        """測試初始化空的資料庫集合"""
        # 模擬空集合
        mock_activities_collection.count_documents.return_value = 0
        mock_teachers_collection.count_documents.return_value = 0

        # 執行初始化
        init_database()

        # 驗證 count_documents 被呼叫
        mock_activities_collection.count_documents.assert_called_once_with({})
        mock_teachers_collection.count_documents.assert_called_once_with({})

        # 驗證 insert_one 被呼叫（每個活動和教師各一次）
        assert mock_activities_collection.insert_one.call_count == len(initial_activities)
        assert mock_teachers_collection.insert_one.call_count == len(initial_teachers)

    @patch('backend.database.activities_collection')
    @patch('backend.database.teachers_collection')
    def test_init_database_skips_populated_collections(
        self, mock_teachers_collection, mock_activities_collection
    ):
        """測試不會重複初始化已有資料的集合"""
        # 模擬已有資料的集合
        mock_activities_collection.count_documents.return_value = 10
        mock_teachers_collection.count_documents.return_value = 3

        # 執行初始化
        init_database()

        # 驗證 insert_one 沒有被呼叫
        mock_activities_collection.insert_one.assert_not_called()
        mock_teachers_collection.insert_one.assert_not_called()

    @patch('backend.database.activities_collection')
    @patch('backend.database.teachers_collection')
    def test_init_database_inserts_correct_activity_structure(
        self, mock_teachers_collection, mock_activities_collection
    ):
        """測試插入的活動資料結構正確"""
        mock_activities_collection.count_documents.return_value = 0
        mock_teachers_collection.count_documents.return_value = 1

        init_database()

        # 驗證第一個活動的插入
        first_call = mock_activities_collection.insert_one.call_args_list[0]
        inserted_doc = first_call[0][0]

        # 驗證必要欄位存在
        assert "_id" in inserted_doc
        assert "description" in inserted_doc
        assert "schedule" in inserted_doc
        assert "schedule_details" in inserted_doc
        assert "max_participants" in inserted_doc
        assert "participants" in inserted_doc

    @patch('backend.database.activities_collection')
    @patch('backend.database.teachers_collection')
    def test_init_database_inserts_correct_teacher_structure(
        self, mock_teachers_collection, mock_activities_collection
    ):
        """測試插入的教師資料結構正確"""
        mock_activities_collection.count_documents.return_value = 1
        mock_teachers_collection.count_documents.return_value = 0

        init_database()

        # 驗證第一個教師的插入
        first_call = mock_teachers_collection.insert_one.call_args_list[0]
        inserted_doc = first_call[0][0]

        # 驗證必要欄位存在
        assert "_id" in inserted_doc
        assert "username" in inserted_doc
        assert "display_name" in inserted_doc
        assert "password" in inserted_doc
        assert "role" in inserted_doc


class TestInitialData:
    """測試初始資料結構 (Test initial data structures)"""

    def test_initial_activities_structure(self):
        """測試 initial_activities 的資料結構"""
        assert isinstance(initial_activities, dict)
        assert len(initial_activities) > 0

        # 檢查每個活動的結構
        for name, details in initial_activities.items():
            assert isinstance(name, str)
            assert len(name) > 0

            # 檢查必要欄位
            assert "description" in details
            assert "schedule" in details
            assert "schedule_details" in details
            assert "max_participants" in details
            assert "participants" in details

            # 檢查 schedule_details 結構
            schedule_details = details["schedule_details"]
            assert "days" in schedule_details
            assert "start_time" in schedule_details
            assert "end_time" in schedule_details
            assert isinstance(schedule_details["days"], list)
            assert len(schedule_details["days"]) > 0

    def test_initial_activities_have_valid_time_format(self):
        """測試活動時間格式正確（HH:MM）"""
        import re
        time_pattern = re.compile(r'^([01]\d|2[0-3]):([0-5]\d)$')

        for name, details in initial_activities.items():
            schedule_details = details["schedule_details"]
            start_time = schedule_details["start_time"]
            end_time = schedule_details["end_time"]

            assert time_pattern.match(start_time), f"{name} has invalid start_time: {start_time}"
            assert time_pattern.match(end_time), f"{name} has invalid end_time: {end_time}"

    def test_initial_activities_have_valid_days(self):
        """測試活動日期為有效的星期名稱"""
        valid_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        for name, details in initial_activities.items():
            days = details["schedule_details"]["days"]
            for day in days:
                assert day in valid_days, f"{name} has invalid day: {day}"

    def test_initial_activities_max_participants_positive(self):
        """測試最大參與人數為正數"""
        for name, details in initial_activities.items():
            max_participants = details["max_participants"]
            assert isinstance(max_participants, int)
            assert max_participants > 0, f"{name} has non-positive max_participants"

    def test_initial_activities_participants_is_list(self):
        """測試參與者為列表"""
        for name, details in initial_activities.items():
            participants = details["participants"]
            assert isinstance(participants, list)

            # 檢查每個參與者是字串（email）
            for participant in participants:
                assert isinstance(participant, str)
                assert "@" in participant, f"Participant should be email format: {participant}"

    def test_initial_activities_with_difficulty(self):
        """測試部分活動有 difficulty 欄位"""
        activities_with_difficulty = [
            name for name, details in initial_activities.items()
            if "difficulty" in details
        ]

        # 確認至少有一些活動有 difficulty
        assert len(activities_with_difficulty) > 0

        # 檢查 difficulty 的值
        valid_difficulties = ["Beginner", "Intermediate", "Advanced"]
        for name in activities_with_difficulty:
            difficulty = initial_activities[name]["difficulty"]
            assert difficulty in valid_difficulties, f"{name} has invalid difficulty: {difficulty}"

    def test_all_activities_have_difficulty(self):
        """測試所有活動都有 difficulty 欄位"""
        valid_difficulties = ["Beginner", "Intermediate", "Advanced"]
        
        for name, details in initial_activities.items():
            # 驗證每個活動都有 difficulty 欄位
            assert "difficulty" in details, f"{name} is missing difficulty field"
            
            # 驗證 difficulty 的值是有效的
            difficulty = details["difficulty"]
            assert difficulty in valid_difficulties, f"{name} has invalid difficulty: {difficulty}"

    def test_initial_teachers_structure(self):
        """測試 initial_teachers 的資料結構"""
        assert isinstance(initial_teachers, list)
        assert len(initial_teachers) > 0

        # 檢查每個教師的結構
        for teacher in initial_teachers:
            assert "username" in teacher
            assert "display_name" in teacher
            assert "password" in teacher
            assert "role" in teacher

            # 檢查資料類型
            assert isinstance(teacher["username"], str)
            assert isinstance(teacher["display_name"], str)
            assert isinstance(teacher["password"], str)
            assert isinstance(teacher["role"], str)

    def test_initial_teachers_have_hashed_passwords(self):
        """測試教師密碼已經雜湊"""
        for teacher in initial_teachers:
            password = teacher["password"]

            # Argon2 雜湊值的特徵
            assert password.startswith("$argon2"), f"Password should be hashed: {teacher['username']}"
            assert len(password) > 50, "Hashed password should be long"

    def test_initial_teachers_have_valid_roles(self):
        """測試教師角色為有效值"""
        valid_roles = ["teacher", "admin"]

        for teacher in initial_teachers:
            role = teacher["role"]
            assert role in valid_roles, f"Invalid role: {role}"

    def test_initial_teachers_usernames_unique(self):
        """測試教師 username 不重複"""
        usernames = [teacher["username"] for teacher in initial_teachers]
        assert len(usernames) == len(set(usernames)), "Duplicate usernames found"


class TestDataIntegrity:
    """測試資料完整性 (Test data integrity)"""

    def test_activities_participants_not_exceed_max(self):
        """測試活動參與者不超過最大人數"""
        for name, details in initial_activities.items():
            participants_count = len(details["participants"])
            max_participants = details["max_participants"]
            assert participants_count <= max_participants, \
                f"{name} has {participants_count} participants but max is {max_participants}"

    def test_activities_end_time_after_start_time(self):
        """測試活動結束時間在開始時間之後"""
        for name, details in initial_activities.items():
            schedule_details = details["schedule_details"]
            start_time = schedule_details["start_time"]
            end_time = schedule_details["end_time"]

            # 轉換為分鐘數比較
            start_minutes = int(start_time.split(':')[0]) * 60 + int(start_time.split(':')[1])
            end_minutes = int(end_time.split(':')[0]) * 60 + int(end_time.split(':')[1])

            assert end_minutes > start_minutes, \
                f"{name} end time ({end_time}) should be after start time ({start_time})"

    def test_weekend_activities_exist(self):
        """測試確實有週末活動"""
        weekend_activities = []
        for name, details in initial_activities.items():
            days = details["schedule_details"]["days"]
            if any(day in ["Saturday", "Sunday"] for day in days):
                weekend_activities.append(name)

        assert len(weekend_activities) > 0, "Should have at least one weekend activity"

    def test_weekday_activities_exist(self):
        """測試確實有平日活動"""
        weekday_activities = []
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        for name, details in initial_activities.items():
            days = details["schedule_details"]["days"]
            if any(day in weekdays for day in days):
                weekday_activities.append(name)

        assert len(weekday_activities) > 0, "Should have at least one weekday activity"

    def test_at_least_one_admin_teacher(self):
        """測試至少有一位管理員"""
        admin_count = sum(1 for teacher in initial_teachers if teacher["role"] == "admin")
        assert admin_count > 0, "Should have at least one admin"

    def test_participant_emails_valid_format(self):
        """測試參與者 email 格式正確"""
        import re
        email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

        for name, details in initial_activities.items():
            for participant in details["participants"]:
                assert email_pattern.match(participant), \
                    f"Invalid email format in {name}: {participant}"
