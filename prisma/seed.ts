import { PrismaClient } from "@prisma/client";
import { Role } from "../src/shared/schemas/auth.schema";

export const prisma = new PrismaClient();

async function main() {
  const roles: Role[] = [
    {
      title: "admin",
      description: "admin",
    },
    {
      title: "user",
      description: "user",
    },
  ];
  try {
    await prisma.role.createMany({ data: roles });
    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("data inserted");

    await prisma.$disconnect();
  });
