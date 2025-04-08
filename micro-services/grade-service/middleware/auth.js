const fetch = require("node-fetch");

const authMiddleware = async (req) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return null;

    try {
        const response = await fetch(
            process.env.AUTH_SERVICE_URL || "http://localhost:8080/graphql",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
          query ValidateToken($token: String!) {
            validateToken(token: $token) {
              id
              email
              pseudo
              role
            }
          }
        `,
                    variables: { token },
                }),
            }
        );

        const data = await response.json();
        return data.data?.validateToken;
    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
};

module.exports = { authMiddleware };
