CREATE TABLE participants (
  pid INTEGER PRIMARY KEY AUTOINCREMENT,
  uid INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  condition INTEGER NOT NULL DEFAULT 0, -- 0 is automatic, 1 is not
  duration REAL NOT NULL, -- total duration in seconds
  start TEXT NOT NULL,
  finish TEXT NOT NULL
);

CREATE TABLE events (
  eventid INTEGER PRIMARY KEY AUTOINCREMENT,
  pid INTEGER NOT NULL,
  duration REAL NOT NULL,
  time_stamp TEXT NOT NULL,
  FOREIGN KEY (pid) REFERENCES participants(pid)
);
