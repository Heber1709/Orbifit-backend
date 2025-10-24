const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /users/profile - Obtener perfil completo del usuario
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        age: true,
        position: true,
        phone: true,
        jerseyNumber: true,
        license: true,
        experienceYears: true,
        specialization: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error al cargar el perfil' });
  }
});

// PUT /users/profile - Actualizar perfil de usuario
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      phone,
      license,
      experienceYears,
      specialization,
      age,
      position,
      jerseyNumber
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(phone !== undefined && { phone }),
        ...(license !== undefined && { license }),
        ...(experienceYears !== undefined && { experienceYears: parseInt(experienceYears) }),
        ...(specialization !== undefined && { specialization }),
        ...(age !== undefined && { age: parseInt(age) }),
        ...(position !== undefined && { position }),
        ...(jerseyNumber !== undefined && { jerseyNumber: parseInt(jerseyNumber) })
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        age: true,
        position: true,
        phone: true,
        jerseyNumber: true,
        license: true,
        experienceYears: true,
        specialization: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
});

module.exports = router;