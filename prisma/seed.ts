import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log(hashedPassword);
  // Création des rôles
  const adminRole = await prisma.role.create({
    data: {
      title: 'Admin',
      description: 'Administrator with full access',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      title: 'User',
      description: 'Regular user with limited access',
    },
  });

  // Création des utilisateurs

  const adminUser = await prisma.user.create({
    
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: { connect: { id: adminRole.id } },
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      username: 'user',
      password: hashedPassword,
      role: { connect: { id: userRole.id } },
    },
  });

  // Création des catégories
  const category1 = await prisma.category.create({
    data: {
      title: 'Category 1',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      title: 'Category 2',
    },
  });

  // Création des objets
  const objects = await prisma.object.createMany({
    data: [
      {
        name: 'Object 1',
        description: 'Description for Object 1',
        categoryId: category1.id,
        ownerId: adminUser.id,
        photos: ['photo1.jpg', 'photo2.jpg'],
      },
      {
        name: 'Object 2',
        description: 'Description for Object 2',
        categoryId: category2.id,
        ownerId: regularUser.id,
        photos: ['photo3.jpg', 'photo4.jpg'],
      },
      {
        name: 'Object 3',
        description: 'Description for Object 3',
        categoryId: category1.id,
        ownerId: adminUser.id,
        photos: ['photo5.jpg', 'photo6.jpg'],
      },
      {
        name: 'Object 4',
        description: 'Description for Object 4',
        categoryId: category2.id,
        ownerId: regularUser.id,
        photos: ['photo7.jpg', 'photo8.jpg'],
      },
      {
        name: 'Object 5',
        description: 'Description for Object 5',
        categoryId: category1.id,
        ownerId: adminUser.id,
        photos: ['photo9.jpg', 'photo10.jpg'],
      },
    ],
  });

  // Création des posts
  const posts = await prisma.post.createMany({
    data: [
      {
        authorId: adminUser.id,
      },
      {
        authorId: regularUser.id,
      },
      {
        authorId: adminUser.id,
      },
      {
        authorId: regularUser.id,
      },
      {
        authorId: adminUser.id,
      },
    ],
  });

  // Récupérer les objets créés pour les utiliser dans ObjectPost
  const allObjects = await prisma.object.findMany();
  const allPosts = await prisma.post.findMany();

  // Création des ObjectPosts
  for (let i = 0; i < allObjects.length; i++) {
    await prisma.objectPost.create({
      data: {
        objectId: allObjects[i].id,
        postId: allPosts[i % allPosts.length].id,
      },
    });
  }

  // Création des suggestions
  const suggestions = await prisma.suggestion.createMany({
    data: [
      {
        status: 'PENDING',
        postId: allPosts[0].id,
      },
      {
        status: 'ACCEPTED',
        postId: allPosts[1].id,
      },
      {
        status: 'DECLINED',
        postId: allPosts[2].id,
      },
      {
        status: 'PENDING',
        postId: allPosts[3].id,
      },
      {
        status: 'ACCEPTED',
        postId: allPosts[4].id,
      },
    ],
  });

  // Récupérer les suggestions créées pour les utiliser dans ObjectSuggestion
  const allSuggestions = await prisma.suggestion.findMany();

  // Création des ObjectSuggestions
  for (let i = 0; i < allObjects.length; i++) {
    await prisma.objectSuggestion.create({
      data: {
        objectId: allObjects[i].id,
        suggestionId: allSuggestions[i % allSuggestions.length].id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
