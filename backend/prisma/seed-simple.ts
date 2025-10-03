import { PrismaClient, UserRole, AccidentType, AccidentSeverity, BikeLaneCondition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.notification.deleteMany();
    await prisma.session.deleteMany();
    await prisma.accident.deleteMany();
    await prisma.trafficData.deleteMany();
    await prisma.bikeLane.deleteMany();
    await prisma.cityZone.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    console.log('👥 Creating admin user...');
    await prisma.user.create({
      data: {
        email: 'admin@smartcity.com',
        password: await bcrypt.hash('Admin123!', 12),
        firstName: 'Admin',
        lastName: 'Smart City',
        role: UserRole.ADMIN,
        phone: '+1234567890',
        address: '123 City Hall St',
        city: 'Smart City',
        postalCode: '12345',
        preferences: {
          notifications: true,
          language: 'es',
          theme: 'light',
          emailUpdates: true
        }
      }
    });

    // Create citizen user
    console.log('👥 Creating citizen user...');
    const citizenUser = await prisma.user.create({
      data: {
        email: 'citizen1@smartcity.com',
        password: await bcrypt.hash('Citizen123!', 12),
        firstName: 'Juan',
        lastName: 'Pérez',
        role: UserRole.CITIZEN,
        phone: '+1234567892',
        address: '789 Main St',
        city: 'Smart City',
        postalCode: '12345',
        preferences: {
          notifications: true,
          language: 'es',
          theme: 'light',
          emailUpdates: true
        }
      }
    });

    // Create city zone
    console.log('🏙️ Creating city zone...');
    const cityZone = await prisma.cityZone.create({
      data: {
        name: 'Downtown District',
        type: 'Commercial',
        coordinates: {
          type: 'Polygon',
          coordinates: [[
            [-74.01, 40.71],
            [-74.00, 40.71],
            [-74.00, 40.72],
            [-74.01, 40.72],
            [-74.01, 40.71]
          ]]
        },
        population: 50000
      }
    });

    // Create sample accident
    console.log('🚨 Creating sample accident...');
    await prisma.accident.create({
      data: {
        location: 'Main St & Oak Ave',
        type: AccidentType.COLLISION,
        severity: AccidentSeverity.MODERATE,
        date: new Date('2024-01-15T10:30:00Z'),
        description: 'Two vehicles collided at intersection',
        latitude: 40.7128,
        longitude: -74.0060,
        reportedBy: citizenUser.id,
        cityZoneId: cityZone.id
      }
    });

    // Create sample bike lane
    console.log('🚴 Creating sample bike lane...');
    await prisma.bikeLane.create({
      data: {
        name: 'Main Street Bike Lane',
        length: 2.5,
        condition: BikeLaneCondition.EXCELLENT,
        usage: 150,
        latitude: 40.7128,
        longitude: -74.0060,
        description: 'Protected bike lane with barriers',
        cityZoneId: cityZone.id
      }
    });

    // Create sample traffic data
    console.log('🚦 Creating sample traffic data...');
    await prisma.trafficData.create({
      data: {
        street: 'Main St',
        speed: 35.5,
        volume: 1200,
        direction: 'Northbound',
        timestamp: new Date('2024-01-20T08:00:00Z')
      }
    });

    // Create sample notification
    console.log('📢 Creating sample notification...');
    await prisma.notification.create({
      data: {
        title: 'Welcome to Smart City',
        message: 'Thank you for joining our Smart City platform. Stay informed about city updates!',
        type: 'welcome',
        userId: citizenUser.id
      }
    });

    console.log('✅ Simple database seeded successfully!');
    console.log('🔑 Login Credentials:');
    console.log('   Admin: admin@smartcity.com / Admin123!');
    console.log('   Citizen: citizen1@smartcity.com / Citizen123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
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
