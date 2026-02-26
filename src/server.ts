import express from "express";
import { notes } from "./data.js";
import { connectDB, prismaClient } from "./prisma/prisma.client.js";

async function setupApp() {
  const app = express();

  // Middlewares
  app.use(express.json());

  app.post("/notes", (req, res) => {
    const newNote = req.body;
    notes.push(newNote);
    console.log(notes.length);
    res.status(201).json({ status: "success", data: { note: newNote } });
  });

  app.get("/notes", async (req, res) => {
    const tasks = await prismaClient.task.findMany();
    res.status(200).json({ status: "success", data: tasks });
  });

  app.get("/notes/:id", (req, res) => {
    const noteId = parseInt(req.params.id);
    const filteredNotes = notes.filter((note) => {
      if (note.id === noteId) return note;
    });
    res.status(200).json({ status: "success", data: filteredNotes });
  });

  app.post("/", (req, res) => {
    const myBody = req.body;
    console.log(myBody);
    res.json({ message: "my Message" });
  });

  return app;
}

async function runServer() {
  await connectDB();

  const app = await setupApp();
  const PORT = 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });

  process.on("SIGINT", async () => {
    await prismaClient.$disconnect();
    console.log("Disconnected successfully");
    server.close(() => {
      process.exit(0);
    });
  });

  process.on("SIGTERM", async () => {
    await prismaClient.$disconnect();
    console.log("Disconnected successfully");
    server.close(() => {
      process.exit(0);
    });
  });
}

runServer().catch(async (err) => {
  await prismaClient.$disconnect();
  console.log("Disconnected after an error");
  console.log(`Error: ${err}`);
  process.exit(1);
});
