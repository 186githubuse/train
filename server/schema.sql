CREATE DATABASE IF NOT EXISTS ganjue_training
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE ganjue_training;

CREATE TABLE IF NOT EXISTS student_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_uid VARCHAR(32) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(50) NOT NULL,
  grade TINYINT UNSIGNED NOT NULL,
  stage CHAR(1) NOT NULL,
  ability_index DECIMAL(4,2) NOT NULL DEFAULT 0.00,
  total_stars INT UNSIGNED NOT NULL DEFAULT 0,
  status TINYINT UNSIGNED NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_student_users_uid (student_uid),
  UNIQUE KEY uk_student_users_phone (phone),
  KEY idx_student_users_name (name),
  KEY idx_student_users_grade (grade),
  KEY idx_student_users_stage (stage),
  KEY idx_student_users_status (status),
  KEY idx_student_users_last_login_at (last_login_at),
  KEY idx_student_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS student_devices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  device_id VARCHAR(64) NOT NULL,
  last_seen_at DATETIME NULL,
  app_version VARCHAR(32) DEFAULT NULL,
  schema_version INT NOT NULL DEFAULT 4,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_student_devices_device_id (device_id),
  KEY idx_student_devices_student_user_id (student_user_id),
  KEY idx_student_devices_last_seen_at (last_seen_at),
  CONSTRAINT fk_student_devices_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS student_lesson_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  lesson_id TINYINT UNSIGNED NOT NULL,
  passed TINYINT(1) NOT NULL DEFAULT 0,
  stars TINYINT UNSIGNED NOT NULL DEFAULT 0,
  xp INT UNSIGNED NOT NULL DEFAULT 0,
  total_xp INT UNSIGNED NOT NULL DEFAULT 0,
  attempt_count INT UNSIGNED NOT NULL DEFAULT 0,
  video_watched TINYINT(1) NOT NULL DEFAULT 0,
  rounds_used INT UNSIGNED NOT NULL DEFAULT 0,
  first_passed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_student_lesson_progress_student_lesson (student_user_id, lesson_id),
  KEY idx_student_lesson_progress_lesson_id (lesson_id),
  KEY idx_student_lesson_progress_first_passed_at (first_passed_at),
  KEY idx_student_lesson_progress_updated_at (updated_at),
  CONSTRAINT fk_student_lesson_progress_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS student_mistakes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  lesson_id TINYINT UNSIGNED NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  question_text TEXT NOT NULL,
  user_answer VARCHAR(128) DEFAULT NULL,
  correct_answer VARCHAR(128) DEFAULT NULL,
  difficulty TINYINT UNSIGNED NOT NULL,
  explanation TEXT DEFAULT NULL,
  reviewed TINYINT(1) NOT NULL DEFAULT 0,
  reward_claimed TINYINT(1) NOT NULL DEFAULT 0,
  status VARCHAR(16) NOT NULL DEFAULT 'open',
  review_streak TINYINT UNSIGNED NOT NULL DEFAULT 0,
  first_wrong_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_review_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_student_mistakes_student_question (student_user_id, question_id),
  KEY idx_student_mistakes_student_status (student_user_id, status),
  KEY idx_student_mistakes_lesson_id (lesson_id),
  KEY idx_student_mistakes_difficulty (difficulty),
  KEY idx_student_mistakes_first_wrong_at (first_wrong_at),
  KEY idx_student_mistakes_last_review_at (last_review_at),
  KEY idx_student_mistakes_updated_at (updated_at),
  CONSTRAINT fk_student_mistakes_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE,
  CONSTRAINT chk_student_mistakes_status
    CHECK (status IN ('open', 'cleared'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS student_challenge_records (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  score INT UNSIGNED NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  duration INT UNSIGNED NOT NULL DEFAULT 0,
  source_event_id VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_student_challenge_records_source_event_id (source_event_id),
  KEY idx_student_challenge_records_student_created (student_user_id, created_at),
  KEY idx_student_challenge_records_score (score),
  CONSTRAINT fk_student_challenge_records_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS topic_compositions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  topic_id VARCHAR(32) NOT NULL,
  sub_id VARCHAR(64) NOT NULL,
  task_type VARCHAR(16) NOT NULL,
  unit_key VARCHAR(64) DEFAULT NULL,
  content_text MEDIUMTEXT NOT NULL,
  ai_total_score INT UNSIGNED DEFAULT NULL,
  ai_score_payload JSON DEFAULT NULL,
  passed TINYINT(1) NOT NULL DEFAULT 0,
  stars_awarded INT UNSIGNED NOT NULL DEFAULT 0,
  source VARCHAR(16) NOT NULL DEFAULT 'manual',
  source_event_id VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_topic_compositions_source_event_id (source_event_id),
  KEY idx_topic_compositions_student_topic_sub (student_user_id, topic_id, sub_id),
  KEY idx_topic_compositions_task_type (task_type),
  KEY idx_topic_compositions_passed (passed),
  KEY idx_topic_compositions_created_at (created_at),
  CONSTRAINT fk_topic_compositions_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE,
  CONSTRAINT chk_topic_compositions_source
    CHECK (source IN ('manual', 'ocr_append'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(64) DEFAULT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'viewer',
  status TINYINT UNSIGNED NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_users_username (username),
  KEY idx_admin_users_role (role),
  KEY idx_admin_users_status (status),
  KEY idx_admin_users_last_login_at (last_login_at),
  CONSTRAINT chk_admin_users_role
    CHECK (role IN ('admin', 'teacher', 'viewer'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS admin_student_scope (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  student_user_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_student_scope_admin_student (admin_user_id, student_user_id),
  KEY idx_admin_student_scope_student_user_id (student_user_id),
  CONSTRAINT fk_admin_student_scope_admin_user_id
    FOREIGN KEY (admin_user_id) REFERENCES admin_users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_admin_student_scope_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS sync_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  device_id VARCHAR(64) NOT NULL,
  event_id VARCHAR(64) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_key VARCHAR(128) NOT NULL,
  payload JSON NOT NULL,
  processed TINYINT(1) NOT NULL DEFAULT 0,
  processed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sync_events_event_id (event_id),
  KEY idx_sync_events_student_created (student_user_id, created_at),
  KEY idx_sync_events_device_id (device_id),
  KEY idx_sync_events_event_type (event_type),
  KEY idx_sync_events_entity_type (entity_type),
  KEY idx_sync_events_entity_key (entity_key),
  KEY idx_sync_events_processed (processed),
  CONSTRAINT fk_sync_events_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS sync_snapshots (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  source VARCHAR(16) NOT NULL,
  schema_version INT NOT NULL,
  snapshot_json LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sync_snapshots_student_user_id (student_user_id),
  KEY idx_sync_snapshots_source (source),
  KEY idx_sync_snapshots_created_at (created_at),
  CONSTRAINT fk_sync_snapshots_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE CASCADE,
  CONSTRAINT chk_sync_snapshots_source
    CHECK (source IN ('bootstrap', 'manual_backup'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS sync_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED DEFAULT NULL,
  device_id VARCHAR(64) DEFAULT NULL,
  action VARCHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL,
  message VARCHAR(255) DEFAULT NULL,
  detail TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sync_logs_student_user_id (student_user_id),
  KEY idx_sync_logs_device_id (device_id),
  KEY idx_sync_logs_action (action),
  KEY idx_sync_logs_status (status),
  KEY idx_sync_logs_created_at (created_at),
  CONSTRAINT fk_sync_logs_student_user_id
    FOREIGN KEY (student_user_id) REFERENCES student_users (id)
    ON DELETE SET NULL,
  CONSTRAINT chk_sync_logs_action
    CHECK (action IN ('bootstrap', 'push', 'pull')),
  CONSTRAINT chk_sync_logs_status
    CHECK (status IN ('success', 'failed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
