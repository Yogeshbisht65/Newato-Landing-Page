import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";

let cachedMongoClient;

async function saveToMongo(email) {
  if (!process.env.MONGODB_URI) return false;

  if (!cachedMongoClient) {
    cachedMongoClient = new MongoClient(process.env.MONGODB_URI);
    await cachedMongoClient.connect();
  }

  const database = cachedMongoClient.db(process.env.MONGODB_DB || "newato");
  const collection = database.collection(process.env.MONGODB_COLLECTION || "waitlist");

  const result = await collection.updateOne(
    { email },
    {
      $setOnInsert: {
        email,
        createdAt: new Date(),
        source: "landing-page-local",
      },
    },
    { upsert: true },
  );

  return Boolean(result.upsertedCount);
}

function waitlistApiPlugin() {
  const saveEmail = async (req, res) => {
    if (req.method !== "POST" || req.url !== "/api/waitlist") return false;

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { email } = JSON.parse(body || "{}");
        const normalizedEmail = String(email || "").trim().toLowerCase();

        if (!/.+@.+\..+/.test(normalizedEmail)) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "Invalid email" }));
          return;
        }

        const savedToMongo = await saveToMongo(normalizedEmail);

        const folder = path.resolve(process.cwd(), "waitlist-emails");
        const jsonPath = path.join(folder, "emails.json");
        const csvPath = path.join(folder, "emails.csv");
        fs.mkdirSync(folder, { recursive: true });

        const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8") || "[]") : [];
        const emails = Array.isArray(existing) ? existing : [];
        const alreadySaved = emails.some((entry) => entry.email === normalizedEmail);

        if (!alreadySaved) {
          emails.push({
            email: normalizedEmail,
            createdAt: new Date().toISOString(),
          });
          fs.writeFileSync(jsonPath, `${JSON.stringify(emails, null, 2)}\n`);
          fs.writeFileSync(
            csvPath,
            ["email,createdAt", ...emails.map((entry) => `${entry.email},${entry.createdAt}`)].join("\n") + "\n",
          );
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: true, saved: savedToMongo || !alreadySaved, savedToMongo }));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: false, error: "Could not save email" }));
      }
    });

    return true;
  };

  return {
    name: "newato-waitlist-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (await saveEmail(req, res)) return;
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (await saveEmail(req, res)) return;
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), waitlistApiPlugin()],
    server: {
      port: 5174,
    },
    preview: {
      port: 5174,
    },
  };
});
