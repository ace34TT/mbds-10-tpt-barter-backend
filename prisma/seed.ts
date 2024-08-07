import {
  PrismaClient,
  Post,
  Suggestion,
  SuggestionStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { Role, User } from "../src/shared/schemas/auth.schema";
import { Category } from "../src/shared/schemas/main.schema";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create Roles
  const roles: Role[] = [
    {
      title: "admin",
      description: "Administrator role with full permissions",
    },
    {
      title: "user",
      description: "Regular user role with limited permissions",
    },
  ];

  try {
    await prisma.role.createMany({ data: roles });
    console.log("Roles inserted successfully.");
  } catch (error) {
    console.error("Error inserting roles:", error);
  }

  // Fetch created roles
  const [adminRole, userRole] = await prisma.role.findMany();

  // Hash passwords
  const adminPassword = await bcrypt.hash("jkl;", 10);
  const userPassword = await bcrypt.hash("jkl;", 10);

  // Create Users
  const users: User[] = [
    {
      name: "Admin User",
      email: "admin@example.com",
      username: "admin",
      password: adminPassword,
      roleId: adminRole.id,
    },
    {
      name: "Regular User",
      email: "user@example.com",
      username: "user",
      password: userPassword,
      roleId: userRole.id,
    },
  ];

  try {
    await prisma.user.createMany({ data: users });
    console.log("Users inserted successfully.");
  } catch (error) {
    console.error("Error inserting users:", error);
  }

  // Fetch created users
  const createdUsers = await prisma.user.findMany();

  // Create Categories
  const categories = Array.from({ length: 10 }, () => ({
    title: faker.commerce.department(),
  }));

  try {
    await prisma.category.createMany({ data: categories });
    console.log("Categories inserted successfully.");
  } catch (error) {
    console.error("Error inserting categories:", error);
  }

  // Fetch created categories
  const createdCategories = await prisma.category.findMany();

  // Create Objects
  const objects = Array.from({ length: 50 }, () => ({
    name: faker.commerce.productName(),
    categoryId: faker.helpers.arrayElement(createdCategories).id,
    description: faker.commerce.productDescription(),
    ownerId: faker.helpers.arrayElement(createdUsers).id,
    photos: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
      faker.image.url()
    ),
  }));

  try {
    await prisma.object.createMany({ data: objects });
    console.log("Objects inserted successfully.");
  } catch (error) {
    console.error("Error inserting objects:", error);
  }

  // Fetch created objects
  const createdObjects = await prisma.object.findMany();

  // Create Posts
  const posts = Array.from({ length: 30 }, () => ({
    authorId: faker.helpers.arrayElement(createdUsers).id,
    description: faker.lorem.paragraph(),
  }));

  try {
    await prisma.post.createMany({ data: posts });
    console.log("Posts inserted successfully.");
  } catch (error) {
    console.error("Error inserting posts:", error);
  }

  // Fetch created posts
  const createdPosts = await prisma.post.findMany();

  // Create ObjectPosts
  const objectPosts = Array.from({ length: 60 }, () => ({
    objectId: faker.helpers.arrayElement(createdObjects).id,
    postId: faker.helpers.arrayElement(createdPosts).id,
  }));

  try {
    await prisma.objectPost.createMany({ data: objectPosts });
    console.log("ObjectPosts inserted successfully.");
  } catch (error) {
    console.error("Error inserting objectPosts:", error);
  }

  // Create Suggestions
  const suggestions = Array.from({ length: 20 }, () => ({
    status: faker.helpers.arrayElement([
      SuggestionStatus.PENDING,
      SuggestionStatus.ACCEPTED,
      SuggestionStatus.DECLINED,
    ]),
    postId: faker.helpers.arrayElement(createdPosts).id,
  }));

  try {
    await prisma.suggestion.createMany({ data: suggestions });
    console.log("Suggestions inserted successfully.");
  } catch (error) {
    console.error("Error inserting suggestions:", error);
  }

  // Fetch created suggestions
  const createdSuggestions = await prisma.suggestion.findMany();

  // Create ObjectSuggestions
  const objectSuggestions = Array.from({ length: 40 }, () => ({
    objectId: faker.helpers.arrayElement(createdObjects).id,
    suggestionId: faker.helpers.arrayElement(createdSuggestions).id,
  }));

  try {
    await prisma.objectSuggestion.createMany({ data: objectSuggestions });
    console.log("ObjectSuggestions inserted successfully.");
  } catch (error) {
    console.error("Error inserting objectSuggestions:", error);
  }

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
