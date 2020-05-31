const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');
const {
  body,
  validationResult,
  param
} = require('express-validator');

const app = express();

const memberValidations = [
  body('firstName')
  .notEmpty()
  .withMessage('required')
  .isLength({
    min: 3
  })
  .withMessage('must be at least 3 chars long'),
  body('lastName')
  .notEmpty()
  .withMessage('required')
  .isLength({
    min: 3
  })
  .withMessage('must be at least 3 chars long'),
  body('jobTitle')
  .notEmpty()
  .withMessage('required')
  .isLength({
    min: 5
  })
  .withMessage('must be at least 5 chars long'),
  body('team').notEmpty().withMessage('required'),
  body('status').isIn(['Active', 'Inactive']).withMessage('not valid'),
];

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

// Get Members
app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// Get Teams
app.get('/api/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// Get Member by id
app.get('/api/member/:id', (req, res) => {
  request(`http://localhost:3000/members/${req.params.id}`, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// Delete Member
app.delete('/api/deleteMember/:id', (req, res) => {
  request.delete(`http://localhost:3000/members/${req.params.id}`, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// Update Member
app.put('/api/updateMember/:id', [
  param('id').notEmpty().isNumeric().withMessage('required'),
  ...memberValidations
], (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    request.put(`http://localhost:3000/members/${req.params.id}`, {
      json: req.body
    }, (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send(body);
      }
    });
  } else {
    res.status(422).json({
      errors: errors.array()
    });
  }
});

// Submit Form!
app.post('/api/addMember', memberValidations, (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    request.post('http://localhost:3000/members', {
      json: req.body
    }, (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send(body);
      }
    });
  } else {
    res.status(422).json({
      errors: errors.array()
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});