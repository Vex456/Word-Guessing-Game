import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Create default avatars
  const avatars = [
    { name: 'Male 1', imageUrl: '/avatars/male1.png', category: 'male', isDefault: true },
    { name: 'Male 2', imageUrl: '/avatars/male2.png', category: 'male', isDefault: true },
    { name: 'Female 1', imageUrl: '/avatars/female1.png', category: 'female', isDefault: true },
    { name: 'Female 2', imageUrl: '/avatars/female2.png', category: 'female', isDefault: true },
    { name: 'Robot', imageUrl: '/avatars/robot.png', category: 'robot', isDefault: true },
    { name: 'Wizard', imageUrl: '/avatars/wizard.png', category: 'wizard', isDefault: true },
    { name: 'Ninja', imageUrl: '/avatars/ninja.png', category: 'ninja', isDefault: true },
    { name: 'Alien', imageUrl: '/avatars/alien.png', category: 'alien', isDefault: true },
  ];

  for (const avatar of avatars) {
    await prisma.avatar.upsert({
      where: { name: avatar.name },
      update: {},
      create: avatar,
    });
  }

  console.log('Avatars seeded successfully');

  // Create sample players for testing
  const sampleAvatars = await prisma.avatar.findMany();
  
  for (let i = 1; i <= 5; i++) {
    await prisma.player.upsert({
      where: { id: `sample-player-${i}` },
      update: {},
      create: {
        id: `sample-player-${i}`,
        displayName: `Player${i}`,
        avatarId: sampleAvatars[i - 1]?.id || sampleAvatars[0]?.id,
        guestId: null,
        gamesPlayed: i * 10,
        gamesWon: i * 5,
        totalPoints: i * 100,
        correctWords: i * 50,
      },
    });
  }

  console.log('Sample players created');
  console.log('Seeding completed!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
