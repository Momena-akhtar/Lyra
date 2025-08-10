import express, { Request, Response } from "express";
import dotenv from "dotenv";

// Load the correct .env file based on NODE_ENV
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const app = express();
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || "development";

app.get("/", (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Bella AI</title>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
            background-color: #f5f5f5;
            color: #333;
            padding: 2rem;
        }
        h1 {
            color: #4a4a4a;
        }
        a {
            color: #007acc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Bella AI</h1>
    <p>Version: 1.0.0 (Initial Release)</p>
    <p>© Momena Akhtar - 2025</p>
    <p><strong>Environment:</strong> ${ENV}</p>
    <a href="/api/docs/">View API Documentation</a>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`[${ENV}] Server running on http://localhost:${PORT}`);
});
