const express = require('express');
const app = express();
const port = 4000;
const routingAuth = require ("./routes/authentication");
const routingUser = require ("./routes/user");
const routingItem = require ("./routes/item");
const routingFavorites = require ("./routes/favorites");
const routingOrder = require ("./routes/order");
const routingAdmin = require ("./routes/admin");
const globalMiddleware = require ("./middleware/global_middleware");

globalMiddleware(app);
routingAuth(app);
routingUser(app);
routingItem(app);
routingFavorites(app);
routingOrder(app);
routingAdmin(app);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token.');
    }
  });