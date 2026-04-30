import { MongoClient } from "mongodb";

let cachedClient;

async function getClient() {
  if (cachedClient) return cachedClient;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  cachedClient = new MongoClient(process.env.MONGODB_URI);
  await cachedClient.connect();
  return cachedClient;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!/.+@.+\..+/.test(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    const client = await getClient();
    const database = client.db(process.env.MONGODB_DB || "newato");
    const collection = database.collection(process.env.MONGODB_COLLECTION || "waitlist");

    const result = await collection.updateOne(
      { email },
      {
        $setOnInsert: {
          email,
          createdAt: new Date(),
          source: "landing-page",
        },
      },
      { upsert: true },
    );

    return res.status(200).json({ ok: true, saved: Boolean(result.upsertedCount) });
  } catch (error) {
    console.error("Waitlist save failed:", error);
    return res.status(500).json({ ok: false, error: "Could not save email" });
  }
}
