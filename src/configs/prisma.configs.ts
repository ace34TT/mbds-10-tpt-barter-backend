import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function runPrisma() {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log("Connection to the database was successful!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}
