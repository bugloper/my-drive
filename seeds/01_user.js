const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const hashPassword = require("../utils/password.hasher");

async function seed() {
  try {
    const userData = [
      {
        name: "Suzal Wakhley",
        email: "suzal@gmail.com",
        password: "suzal@gmail.com"
      },
      {
        name: "John Doe",
        email: "john@gmail.com",
        password: "john@gmail.com"
      },
      {
        name: "Nima Yonten",
        email: "nima@gmail.com",
        password: "nima@gmail.com"
      },
      {
        name: "Fit Dev",
        email: "fit@gmail.com",
        password: "fit@gmail.com"
      }
    ];

    for (let data of userData) {
      console.log(`Creating user: ${data.email}`);
      const hashedPassword = await hashPassword(data.password);

      await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword
        },
      });
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
