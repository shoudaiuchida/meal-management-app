CREATE TABLE meal_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO meal_types (name)
VALUES
  ('朝食'),
  ('昼食'),
  ('夕食');

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_type_id INTEGER NOT NULL REFERENCES meal_types(id),
  meal_date DATE NOT NULL,
  main_dish TEXT NOT NULL,
  side_dish TEXT,
  soup TEXT,
  memo TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);