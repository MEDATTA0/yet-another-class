import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.js";

export let prismaClient: PrismaClient;

export async function connectDB() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString === undefined) {
      throw new Error("DATABASE_URL is not set");
    }
    const adapter = new PrismaPg({ connectionString });

    prismaClient = new PrismaClient({
      adapter,
    });
    await prismaClient.$connect();
    console.log("Successfully connected to the database");
  } catch (err) {
    console.log(`Error connection to the database: ${err}\n`);
    throw err;
  }
}
