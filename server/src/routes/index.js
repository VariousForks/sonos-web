
// Dependencies
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const router = require('express').Router();

const Zones = require('./zones');
const Groups = require('./groups');


module.exports = function Routes(sonosNetwork) {
  this.router = router;
  this.sonosNetwork = sonosNetwork;

  // the directory of the client code in production
  const clientDir = `${process.cwd()}/dist`;
  const clientIndex = `${clientDir}/index.html`;
  if (process.env.NODE_ENV === 'production') {
    // In Production, all the client code will be in the 'dist' folder
    this.router.use(serveStatic(clientDir));
    // Redirect any GET requests to our client's router
    this.router.use(history({ index: clientIndex }));
  }

  // All router
  const zones = new Zones(this.sonosNetwork);
  const groups = new Groups(this.sonosNetwork);

  this.router.use('/api/zones', zones.router);
  this.router.use('/api/groups', groups.router);
  // End All router

  // This MUST come last - all router that we do not have endpoints for
  if (process.env.NODE_ENV === 'production') {
    // send back to the client index
    this.router.get('*', (req, res) => {
      res.sendFile(clientIndex);
    });
  } else {
    // send 404 error message
    this.router.get('*', (req, res) => {
      console.log('404');
      res.status(404).send({ status: '404', message: 'endpoint not found' });
    });
  }
};
