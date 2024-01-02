const roomController = require('../controllers/room.controller');
const { respondWithJSON, responseWithText, respondWithError } = require('./responses');


function router(req, res) {
  const path = req.url;

  switch (path) {
    case '/rooms':
      if (req.method === 'POST') {
        roomController.createRoom(req, res);
      } else {
        respondWithError(res, 405, 'Invalid method for /rooms');
      }
      break;

    case '/room/user':
      if (req.method === 'POST') {
        roomController.joinRoom(req, res);
      } else {
        respondWithError(res, 405, 'Invalid method for /room/user');
      }
      break;

    case '/room/hostname':
      if (req.method === 'POST') {
        roomController.getHost(req, res);
      } else {
        respondWithError(res, 405, 'Invalid method for /room/hostname');
      }
      break;

    case '/firebase-config':

      if (req.method === 'GET') {

        const firebaseConfig = {
          apiKey: process.env.FIREBASE_API,
          authDomain: process.env.AUTH_DOMAIN,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGING,
          appId: process.env.APP_ID
        };
        respondWithJSON(res, 200, firebaseConfig);

      } else {
        respondWithError(res, 405, 'Invalid method for /firebase-config');
      }
      break;
    default:
      responseWithText(res, 200, 'Not Found');
  }
}

module.exports = router;
