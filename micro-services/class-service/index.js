const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const bodyParser = require("body-parser");
const schema = require("./graphql/schema");
const connectDB = require("./config/db");
const { authMiddleware } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 8082;

async function startApolloServer() {
    const server = new ApolloServer({
        schema,
    });

    await server.start();

    app.use(
        "/graphql",
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const user = await authMiddleware(req);
                return { req, user };
            },
        })
    );

    connectDB();

    app.listen(PORT, () => {
        console.log(
            `🚀 Class Service running at http://localhost:${PORT}/graphql`
        );
    });
}

startApolloServer();
