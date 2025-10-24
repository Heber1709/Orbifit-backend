import { PrismaClient, UserRole, PlayerPosition } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear administrador
  const admin = await prisma.user.upsert({
    where: { email: 'admin@orbifit.com' },
    update: {},
    create: {
      email: 'admin@orbifit.com',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Administrador',
      lastName: 'Sistema',
      role: UserRole.ADMINISTRADOR,
    },
  });

  // Crear entrenadores
  const coach1 = await prisma.user.upsert({
    where: { email: 'carlos@club.com' },
    update: {},
    create: {
      email: 'carlos@club.com',
      username: 'cmartinez',
      password: await bcrypt.hash('coach123', 10),
      firstName: 'Carlos',
      lastName: 'Martínez',
      role: UserRole.ENTRENADOR,
      specialization: 'Entrenamiento Físico',
      experienceYears: 8,
      license: 'UEFA Pro',
      phone: '+502 12345678',
    },
  });

  const coach2 = await prisma.user.upsert({
    where: { email: 'ana@club.com' },
    update: {},
    create: {
      email: 'ana@club.com',
      username: 'alopez',
      password: await bcrypt.hash('coach123', 10),
      firstName: 'Ana',
      lastName: 'López',
      role: UserRole.ENTRENADOR,
      specialization: 'Táctica',
      experienceYears: 5,
      license: 'CONCACAF A',
      phone: '+502 87654321',
    },
  });

  // Crear jugadores
  const player1 = await prisma.user.upsert({
    where: { email: 'juan@email.com' },
    update: {},
    create: {
      email: 'juan@email.com',
      username: 'jperez',
      password: await bcrypt.hash('player123', 10),
      firstName: 'Juan',
      lastName: 'Pérez',
      role: UserRole.JUGADOR,
      age: 24,
      position: PlayerPosition.MEDIOCAMPO,
      jerseyNumber: 10,
      phone: '+502 11111111',
    },
  });

  const player2 = await prisma.user.upsert({
    where: { email: 'maria@email.com' },
    update: {},
    create: {
      email: 'maria@email.com',
      username: 'mgarcia',
      password: await bcrypt.hash('player123', 10),
      firstName: 'María',
      lastName: 'García',
      role: UserRole.JUGADOR,
      age: 22,
      position: PlayerPosition.DEFENSA,
      jerseyNumber: 4,
      phone: '+502 22222222',
    },
  });

  const player3 = await prisma.user.upsert({
    where: { email: 'pedro@email.com' },
    update: {},
    create: {
      email: 'pedro@email.com',
      username: 'plopez',
      password: await bcrypt.hash('player123', 10),
      firstName: 'Pedro',
      lastName: 'López',
      role: UserRole.JUGADOR,
      age: 25,
      position: PlayerPosition.DELANTERO,
      jerseyNumber: 9,
      phone: '+502 33333333',
    },
  });

  // Crear eventos de ejemplo
  const events = await prisma.event.createMany({
    data: [
      {
        title: 'Entrenamiento Físico',
        description: 'Entrenamiento de resistencia y fuerza',
        type: 'ENTRENAMIENTO',
        date: new Date('2024-12-18T16:00:00'),
        time: '16:00',
        location: 'Campo Principal',
        createdById: coach1.id,
      },
      {
        title: 'Reunión Técnica',
        description: 'Análisis táctico del próximo partido',
        type: 'REUNION',
        date: new Date('2024-12-18T18:00:00'),
        time: '18:00',
        location: 'Sala de Reuniones',
        createdById: coach1.id,
      },
      {
        title: 'Práctica Táctica',
        description: 'Trabajo en estrategias defensivas',
        type: 'ENTRENAMIENTO',
        date: new Date('2024-12-20T17:30:00'),
        time: '17:30',
        location: 'Campo Principal',
        createdById: coach2.id,
      },
      {
        title: 'Partido vs Equipo B',
        description: 'Partido amistoso de preparación',
        type: 'PARTIDO',
        date: new Date('2024-12-22T19:00:00'),
        time: '19:00',
        location: 'Estadio Municipal',
        createdById: coach1.id,
      },
    ],
  });

  // Crear entrenamientos
  const training1 = await prisma.training.create({
    data: {
      title: 'Entrenamiento Físico Intensivo',
      description: 'Trabajo de resistencia y fuerza',
      type: 'FISICO',
      date: new Date('2024-12-18T16:00:00'),
      duration: 90,
      coachId: coach1.id,
      location: 'Campo Principal',
      status: 'CONFIRMADO',
      participants: {
        create: [
          { playerId: player1.id, confirmed: true },
          { playerId: player2.id, confirmed: true },
          { playerId: player3.id, confirmed: false },
        ],
      },
    },
  });

  // Crear estadísticas de jugadores
const statsData = [
  {
    playerId: player1.id,
    matchesPlayed: 24,
    goals: 8,
    assists: 12,
    year: 2024,
    month: 12,
  },
  {
    playerId: player2.id,
    matchesPlayed: 22,
    goals: 3,
    assists: 8,
    year: 2024,
    month: 12,
  },
  {
    playerId: player3.id,
    matchesPlayed: 20,
    goals: 6,
    assists: 4,
    year: 2024,
    month: 12,
  },
];

for (const stat of statsData) {
  await prisma.playerStat.upsert({
    where: {
      playerId_year_month: {
        playerId: stat.playerId,
        year: stat.year,
        month: stat.month,
      },
    },
    update: stat,
    create: stat,
  });
}

  // Crear mensajes de chat
  await prisma.message.createMany({
    data: [
      {
        content: '¡Buen entrenamiento hoy equipo! 💪',
        type: 'GENERAL',
        senderId: coach1.id,
      },
      {
        content: 'Gracias coach, me siento cada vez mejor',
        type: 'GENERAL',
        senderId: player1.id,
      },
      {
        content: 'El próximo partido será difícil, pero estamos listos',
        type: 'GENERAL',
        senderId: player2.id,
      },
      {
        content: 'Recuerden hidratarse bien antes del partido',
        type: 'GENERAL',
        senderId: coach2.id,
      },
    ],
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('Usuarios creados:');
  console.log(`- Admin: ${admin.email} (admin123)`);
  console.log(`- Entrenador 1: ${coach1.email} (coach123)`);
  console.log(`- Entrenador 2: ${coach2.email} (coach123)`);
  console.log(`- Jugador 1: ${player1.email} (player123)`);
  console.log(`- Jugador 2: ${player2.email} (player123)`);
  console.log(`- Jugador 3: ${player3.email} (player123)`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });