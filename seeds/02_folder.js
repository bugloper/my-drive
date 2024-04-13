const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function seed() {
  try {
    const emails = [
      "suzal@gmail.com",
      "john@gmail.com",
      "nima@gmail.com",
      "fit@gmail.com"
    ];

    for (let i = 0; i < 4; i++) {
      const user = await prisma.user.findUnique({
        where: { email: emails[i] }
      });

      if (!user) {
        console.error(`User with email ${emails[i]} not found.`);
        continue;
      }

      let parentName = faker.person.fullName();
      console.log(`${i} creating main folder: ${parentName}`);

      const mainFolder = await prisma.folder.create({
        data: {
          name: parentName,
          userId: user.id
        },
      });

      for (let j = 0; j < 1000; j++) {
        let childName = faker.person.fullName();
        console.log(`${j} creating subfolder: ${childName} for ${parentName}`);

        const childFolder = await prisma.folder.create({
          data: {
            name: childName,
            userId: user.id,
            parentId: mainFolder.id,
          },
        });

        const grandChildName = faker.person.fullName();
        console.log(`${j} creating grandchild folder: ${grandChildName} for ${childName}`);

        await prisma.folder.create({
          data: {
            name: grandChildName,
            userId: user.id,
            parentId: childFolder.id,
          },
        });
      }
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
