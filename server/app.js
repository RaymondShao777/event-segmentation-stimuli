const z = require('zod');
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
  res.send('uwu');
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

// create zod schema (for input validation)
const Participant = z.object({
  uid: z.number(),
  first: z.string(),
  last: z.string(),
  condition: z.number(),
  duration: z.number(),
  start: z.string().datetime(),
  finish: z.string().datetime(),
  durations: z.union([z.number(), z.string().datetime()]).array().array(),
});

// add a participant with their data
app.post('/api/participants', (req, res) => {
  console.log(req.body);
  Participant.parse(req.body);
  const {uid, first, last, condition, duration, start, finish, durations} = req.body;
  // check if UID already exists in database
  db.get('SELECT * FROM participants WHERE uid = ?', [uid], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('INTERNAL SERVICE ERROR');
      return;
    }

    if (row) {
      res.status(409).send("You've already completed this study!\n");
      return;
    }
  });

  // add new participant to db
  let sql = 'INSERT INTO participants(uid, first_name, last_name, condition, duration, start, finish) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [uid, first, last, condition, duration, start, finish], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('INTERNAL SERVICE ERROR');
    }
  });

  // get PID
  db.all('SELECT COUNT(*) FROM participants', (err, row) => {
    const pid = row[0]['COUNT(*)'];
    // add duration events into db
    sql = 'INSERT INTO events(pid, duration, time_stamp) VALUES (?, ?, ?)';
    for (const i in durations) {
      db.run(sql, [pid, durations[i][0], durations[i][1]], (err) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*-------------------------------------------------------------
 Helper functions
-------------------------------------------------------------*/

/**
 * Counts the number of rows in a table
 * @param {sqlite3.Database} db - The database to access
 * @param {string} tableName - The table to count
 * @returns {int} Number of rows in table
 */
/* IDK HOW TO GET THE CALLBACK INFO OUT INTO THE MAIN FUNCTION RETURN TT
function count (db, tableName) {
  let callback = (err, rows) => { 
    if (err) {
      console.error(err.message);
    }
    return rows['COUNT(*)'];
  };
  const res = db.get(`SELECT COUNT(*) FROM ${tableName}`, callback).rows;
  console.log(res);
  return res;
}*/
