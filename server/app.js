const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./event_segmentation.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to db.');
});

// enable CORS for all origins (CHANGE THIS TO BE SAFER AND ONLY FOR API)
app.use(cors());
// allows for JSON parsing
app.use(express.json());

const port = 3000;

// load experimenter page
app.get('/', (req, res) => {
  res.send();
})

// get all participants
app.get('/api/participants', (req, res) => {
  db.all('SELECT participants.pid, participants.condition, events.duration FROM participants JOIN events ON (participants.pid = events.pid) ORDER BY participants.condition',
    (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('INTERNAL SERVICE ERROR');
    } else {
      res.send(rows);
    }
  });
});

// check if participant exists given UID, if does not exist, send condition to run
app.get('/api/participants/:uid', (req, res) => {
  const { uid } = req.params;
  db.get('SELECT * FROM participants WHERE uid = ?', [uid], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('INTERNAL SERVICE ERROR');
    } else if (row) {
      res.status(409).send('Participant already exists!');
    } else {
      db.all('SELECT COUNT(*) FROM participants', (err, row) => {
        const condition = (row[0]['COUNT(*)'] % 2) == 0;
        res.status(200).json({'auto' : condition});
      });

    }
  });
});

// add a participant with their data
app.post('/api/participants', (req, res) => {
  const {uid, first, last, condition, durations} = req.body;
  // check if UID already exists in database
  db.get('SELECT * FROM participants WHERE uid = ?', [uid], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('INTERNAL SERVICE ERROR');
      return;
    } else if (row) {
      res.status(409).send("You've already completed this study!\n");
      return;
    }

    // add new participant to db
    let sql = 'INSERT INTO participants(uid, first_name, last_name, condition) VALUES (?, ?, ?, ?)';
    db.run(sql, [uid, first, last, condition], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('INTERNAL SERVICE ERROR');
        return;
      }
    });

    // get PID
    db.all('SELECT COUNT(*) FROM participants', (err, row) => {
      const pid = row[0]['COUNT(*)'];
      // add duration events into db
      sql = 'INSERT INTO events(pid, duration) VALUES (?, ?)';
      for (const i in durations) {
        db.run(sql, [pid, durations[i]], (err) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('INTERNAL SERVICE ERROR');
            return;
          }
        });
      }
      res.status(201).send('Response recorded!\n');
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
