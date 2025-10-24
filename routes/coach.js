// GET /coach/players - Obtener todos los jugadores activos
router.get('/players', auth, async (req, res) => {
  try {
    const players = await prisma.user.findMany({
      where: { 
        role: 'JUGADOR',
        isActive: true 
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
        jerseyNumber: true,
        age: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    const formattedPlayers = players.map(player => ({
      id: player.id,
      name: `${player.firstName} ${player.lastName}`,
      position: player.position || 'Sin posición',
      jerseyNumber: player.jerseyNumber,
      age: player.age
    }));

    res.json(formattedPlayers);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error al cargar los jugadores' });
  }
});

// GET /coach/stats - Obtener estadísticas del equipo
router.get('/stats', auth, async (req, res) => {
  try {
    const activePlayers = await prisma.user.count({
      where: { 
        role: 'JUGADOR',
        isActive: true 
      }
    });

    const trainings = await prisma.training.count({
      where: { coachId: req.userId }
    });

    // Aquí puedes agregar más estadísticas según tu lógica de negocio
    const stats = {
      activePlayers,
      trainings,
      matchesPlayed: 0, // Implementar según tu lógica
      wins: 0, // Implementar según tu lógica
      topPlayers: [] // Implementar según tu lógica
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({ message: 'Error al cargar las estadísticas' });
  }
});
// GET /coach/profile - Obtener perfil del entrenador (puedes usar el de users también)
router.get('/profile', auth, async (req, res) => {
  try {
    const coach = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        license: true,
        experienceYears: true,
        specialization: true
      }
    });

    if (!coach) {
      return res.status(404).json({ message: 'Entrenador no encontrado' });
    }

    res.json(coach);
  } catch (error) {
    console.error('Error fetching coach profile:', error);
    res.status(500).json({ message: 'Error al cargar el perfil del entrenador' });
  }
});

// POST /coach/trainings - Crear entrenamiento
router.post('/trainings', auth, async (req, res) => {
  try {
    const { type, date, time, duration, description, players } = req.body;

    // Crear el entrenamiento
    const training = await prisma.training.create({
      data: {
        title: type,
        description,
        type: type.toUpperCase().replace(' ', '_'),
        date: new Date(`${date}T${time}`),
        duration: parseInt(duration),
        coachId: req.userId,
        status: 'PROGRAMADO'
      }
    });

    // Agregar participantes al entrenamiento
    if (players && players.length > 0) {
      await prisma.trainingParticipant.createMany({
        data: players.map(playerId => ({
          trainingId: training.id,
          playerId: playerId,
          confirmed: false
        }))
      });
    }

    res.status(201).json({ 
      message: 'Entrenamiento creado exitosamente',
      training 
    });
  } catch (error) {
    console.error('Error creating training:', error);
    res.status(500).json({ message: 'Error al crear el entrenamiento' });
  }
});

// POST /coach/training-results - Guardar resultados de entrenamiento
router.post('/training-results', auth, async (req, res) => {
  try {
    const { evaluations, notes, rating, coachId } = req.body;

    // Aquí puedes implementar la lógica para guardar los resultados
    // Por ahora solo devolvemos un éxito
    res.json({ 
      message: 'Resultados guardados exitosamente',
      evaluations,
      notes,
      rating
    });
  } catch (error) {
    console.error('Error saving training results:', error);
    res.status(500).json({ message: 'Error al guardar los resultados' });
  }
});