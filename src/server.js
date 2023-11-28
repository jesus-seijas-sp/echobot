const express = require('express');
const cors = require('cors');

class Server {
  constructor(settings = {}) {
    this.settings = settings;
    this.app = express();
    this.initialize();
  }

  initialize() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  start() {
    this.app.listen(this.settings.port, () => {
      console.log(`Server listening on port ${this.settings.port}`);
    });
  }
}

module.exports = {
  Server,
}