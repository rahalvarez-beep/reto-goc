"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const sampleUsers = [
    {
        email: 'admin@smartcity.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'Smart City',
        role: client_1.UserRole.ADMIN,
        phone: '+1234567890',
        address: '123 City Hall St',
        city: 'Smart City',
        postalCode: '12345'
    },
    {
        email: 'operator@smartcity.com',
        password: 'Operator123!',
        firstName: 'Traffic',
        lastName: 'Operator',
        role: client_1.UserRole.OPERATOR,
        phone: '+1234567891',
        address: '456 Traffic Control Ave',
        city: 'Smart City',
        postalCode: '12345'
    },
    {
        email: 'citizen1@smartcity.com',
        password: 'Citizen123!',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: client_1.UserRole.CITIZEN,
        phone: '+1234567892',
        address: '789 Main St',
        city: 'Smart City',
        postalCode: '12345'
    },
    {
        email: 'citizen2@smartcity.com',
        password: 'Citizen123!',
        firstName: 'María',
        lastName: 'García',
        role: client_1.UserRole.CITIZEN,
        phone: '+1234567893',
        address: '321 Oak Ave',
        city: 'Smart City',
        postalCode: '12345'
    }
];
const sampleAccidents = [
    {
        location: 'Main St & Oak Ave',
        type: client_1.AccidentType.COLLISION,
        severity: client_1.AccidentSeverity.MODERATE,
        date: new Date('2024-01-15T10:30:00Z'),
        description: 'Two vehicles collided at intersection',
        latitude: 40.7128,
        longitude: -74.0060,
        reportedBy: null
    },
    {
        location: 'Broadway & 5th St',
        type: client_1.AccidentType.PEDESTRIAN,
        severity: client_1.AccidentSeverity.SEVERE,
        date: new Date('2024-01-16T14:20:00Z'),
        description: 'Pedestrian struck by vehicle',
        latitude: 40.7589,
        longitude: -73.9851,
        reportedBy: null
    },
    {
        location: 'Park Ave & 10th St',
        type: client_1.AccidentType.MOTORCYCLE,
        severity: client_1.AccidentSeverity.MINOR,
        date: new Date('2024-01-17T08:45:00Z'),
        description: 'Motorcycle accident with minor injuries',
        latitude: 40.7505,
        longitude: -73.9934,
        reportedBy: null
    },
    {
        location: 'Central Blvd & 3rd Ave',
        type: client_1.AccidentType.BICYCLE,
        severity: client_1.AccidentSeverity.MODERATE,
        date: new Date('2024-01-18T16:15:00Z'),
        description: 'Bicycle accident with vehicle',
        latitude: 40.7614,
        longitude: -73.9776,
        reportedBy: null
    },
    {
        location: 'Riverside Dr & 8th St',
        type: client_1.AccidentType.ROLLOVER,
        severity: client_1.AccidentSeverity.FATAL,
        date: new Date('2024-01-19T22:30:00Z'),
        description: 'Vehicle rollover with fatalities',
        latitude: 40.7831,
        longitude: -73.9712,
        reportedBy: null
    }
];
const sampleBikeLanes = [
    {
        name: 'Main Street Bike Lane',
        length: 2.5,
        condition: client_1.BikeLaneCondition.EXCELLENT,
        usage: 150,
        latitude: 40.7128,
        longitude: -74.0060,
        description: 'Protected bike lane with barriers'
    },
    {
        name: 'Oak Avenue Cycle Path',
        length: 1.8,
        condition: client_1.BikeLaneCondition.GOOD,
        usage: 120,
        latitude: 40.7589,
        longitude: -73.9851,
        description: 'Shared bike lane with markings'
    },
    {
        name: 'Park Avenue Bikeway',
        length: 3.2,
        condition: client_1.BikeLaneCondition.FAIR,
        usage: 95,
        latitude: 40.7505,
        longitude: -73.9934,
        description: 'Bike lane with some maintenance needed'
    },
    {
        name: 'Central Boulevard Cycle Track',
        length: 4.1,
        condition: client_1.BikeLaneCondition.EXCELLENT,
        usage: 200,
        latitude: 40.7614,
        longitude: -73.9776,
        description: 'Separated bike lane with planters'
    },
    {
        name: 'Riverside Drive Bike Path',
        length: 5.5,
        condition: client_1.BikeLaneCondition.POOR,
        usage: 60,
        latitude: 40.7831,
        longitude: -73.9712,
        description: 'Bike path needs major repairs'
    }
];
const sampleCityZones = [
    {
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
    },
    {
        name: 'Residential North',
        type: 'Residential',
        coordinates: {
            type: 'Polygon',
            coordinates: [[
                    [-74.02, 40.75],
                    [-74.01, 40.75],
                    [-74.01, 40.76],
                    [-74.02, 40.76],
                    [-74.02, 40.75]
                ]]
        },
        population: 25000
    },
    {
        name: 'Industrial South',
        type: 'Industrial',
        coordinates: {
            type: 'Polygon',
            coordinates: [[
                    [-74.00, 40.70],
                    [-73.99, 40.70],
                    [-73.99, 40.71],
                    [-74.00, 40.71],
                    [-74.00, 40.70]
                ]]
        },
        population: 10000
    }
];
const sampleTrafficData = [
    {
        street: 'Main St',
        speed: 35.5,
        volume: 1200,
        direction: 'Northbound',
        timestamp: new Date('2024-01-20T08:00:00Z')
    },
    {
        street: 'Oak Ave',
        speed: 28.2,
        volume: 800,
        direction: 'Eastbound',
        timestamp: new Date('2024-01-20T08:00:00Z')
    },
    {
        street: 'Broadway',
        speed: 42.1,
        volume: 2000,
        direction: 'Southbound',
        timestamp: new Date('2024-01-20T08:00:00Z')
    },
    {
        street: 'Park Ave',
        speed: 31.8,
        volume: 1500,
        direction: 'Westbound',
        timestamp: new Date('2024-01-20T08:00:00Z')
    }
];
const sampleNotifications = [
    {
        title: 'Welcome to Smart City',
        message: 'Thank you for joining our Smart City platform. Stay informed about city updates!',
        type: 'welcome',
        userId: ''
    },
    {
        title: 'Traffic Alert',
        message: 'Heavy traffic reported on Main St. Consider alternative routes.',
        type: 'traffic',
        userId: ''
    },
    {
        title: 'Bike Lane Maintenance',
        message: 'Riverside Drive bike path will be closed for maintenance tomorrow.',
        type: 'maintenance',
        userId: ''
    }
];
async function main() {
    console.log('🌱 Starting database seeding...');
    try {
        console.log('🧹 Clearing existing data...');
        await prisma.notification.deleteMany();
        await prisma.session.deleteMany();
        await prisma.accident.deleteMany();
        await prisma.trafficData.deleteMany();
        await prisma.bikeLane.deleteMany();
        await prisma.cityZone.deleteMany();
        await prisma.user.deleteMany();
        console.log('👥 Creating users...');
        const users = [];
        for (const userData of sampleUsers) {
            const hashedPassword = await bcryptjs_1.default.hash(userData.password, 12);
            const user = await prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword,
                    preferences: {
                        notifications: true,
                        language: 'es',
                        theme: 'light',
                        emailUpdates: true
                    }
                }
            });
            users.push(user);
        }
        if (users.length === 0) {
            throw new Error('No users created');
        }
        console.log('🏙️ Creating city zones...');
        const cityZones = [];
        for (const zoneData of sampleCityZones) {
            const zone = await prisma.cityZone.create({
                data: zoneData
            });
            cityZones.push(zone);
        }
        if (cityZones.length === 0) {
            throw new Error('No city zones created');
        }
        console.log('🚨 Creating accidents...');
        const accidents = [];
        for (const accidentData of sampleAccidents) {
            const accident = await prisma.accident.create({
                data: {
                    ...accidentData,
                    cityZoneId: cityZones[0]?.id
                }
            });
            accidents.push(accident);
        }
        console.log('🚴 Creating bike lanes...');
        const bikeLanes = [];
        for (const bikeLaneData of sampleBikeLanes) {
            const bikeLane = await prisma.bikeLane.create({
                data: {
                    ...bikeLaneData,
                    cityZoneId: cityZones[0]?.id
                }
            });
            bikeLanes.push(bikeLane);
        }
        console.log('🚦 Creating traffic data...');
        for (const trafficData of sampleTrafficData) {
            await prisma.trafficData.create({
                data: trafficData
            });
        }
        console.log('📢 Creating notifications...');
        for (const notificationData of sampleNotifications) {
            await prisma.notification.create({
                data: {
                    ...notificationData,
                    userId: users[2]?.id || users[0]?.id
                }
            });
        }
        console.log('✅ Database seeded successfully!');
        console.log(`   👥 Users created: ${users.length}`);
        console.log(`   🏙️ City zones created: ${cityZones.length}`);
        console.log(`   🚨 Accidents created: ${accidents.length}`);
        console.log(`   🚴 Bike lanes created: ${bikeLanes.length}`);
        console.log(`   🚦 Traffic data entries: ${sampleTrafficData.length}`);
        console.log(`   📢 Notifications created: ${sampleNotifications.length}`);
        console.log('\n🔑 Login Credentials:');
        console.log('   Admin: admin@smartcity.com / Admin123!');
        console.log('   Operator: operator@smartcity.com / Operator123!');
        console.log('   Citizen 1: citizen1@smartcity.com / Citizen123!');
        console.log('   Citizen 2: citizen2@smartcity.com / Citizen123!');
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map