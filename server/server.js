const express = require('express');
const { ApolloServer } = require('@apollo/server');
 const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth')
const db = require('./config/connection');
const routes = require('./routes');

const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//create a new instance of ApolloServer with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
// Serve static assets from the 'dist' folder inside the 'client' directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// For all other routes, serve the 'index.html' file from the 'dist' folder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
}
app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware
}));

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
}

startApolloServer();