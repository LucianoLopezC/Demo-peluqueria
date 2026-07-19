const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const NOMBRES_SERVICIOS_ANTIGUOS = ['Corte', 'Corte + Barba', 'Corte y Tinte', 'Estilismo'];

const SERVICIOS = [
  // Barbería
  {
    nombre: 'Corte clásico',
    descripcion: 'Tijera y máquina, lavado incluido',
    precioCentavos: 1800000,
    duracionMinutos: 30,
    categoria: 'BARBERIA',
  },
  {
    nombre: 'Corte + barba',
    descripcion: 'Perfilado con toalla caliente',
    precioCentavos: 2600000,
    duracionMinutos: 45,
    categoria: 'BARBERIA',
  },
  {
    nombre: 'Barba ritual',
    descripcion: 'Toalla caliente, aceites y navaja',
    precioCentavos: 1400000,
    duracionMinutos: 30,
    categoria: 'BARBERIA',
  },
  {
    nombre: 'Diseño / freestyle',
    descripcion: 'Líneas y detalles a máquina',
    precioCentavos: 2200000,
    duracionMinutos: 30,
    categoria: 'BARBERIA',
  },
  // Estética
  {
    nombre: 'Limpieza facial',
    descripcion: 'Profunda, con vapor y extracción',
    precioCentavos: 2800000,
    duracionMinutos: 45,
    categoria: 'ESTETICA',
  },
  {
    nombre: 'Cejas y perfilado',
    descripcion: 'Diseño con cera o pinza',
    precioCentavos: 1200000,
    duracionMinutos: 15,
    categoria: 'ESTETICA',
  },
  {
    nombre: 'Color y matiz',
    descripcion: 'Coloración completa o retoque',
    precioCentavos: 3500000,
    duracionMinutos: 90,
    categoria: 'ESTETICA',
  },
  {
    nombre: 'Tratamiento capilar',
    descripcion: 'Hidratación y reparación',
    precioCentavos: 2400000,
    duracionMinutos: 45,
    categoria: 'ESTETICA',
  },
];

async function main() {
  await prisma.servicio.deleteMany({ where: { nombre: { in: NOMBRES_SERVICIOS_ANTIGUOS } } });

  // El input type="email" del navegador rechaza la "ñ" en la dirección, así
  // que el correo de la propietaria no puede llevarla aunque el nombre sí.
  await prisma.usuario.deleteMany({ where: { correo: 'dueña@peluqueria1.com' } });

  for (const servicio of SERVICIOS) {
    await prisma.servicio.upsert({
      where: { nombre: servicio.nombre },
      update: servicio,
      create: servicio,
    });
  }

  const hashContrasena = await bcrypt.hash('changeme123', 10);

  const propietaria = await prisma.usuario.upsert({
    where: { correo: 'duena@peluqueria1.com' },
    update: {},
    create: {
      correo: 'duena@peluqueria1.com',
      hashContrasena,
      rol: 'PROPIETARIO',
      nombreCompleto: 'Peluquería 1 - Dueña',
      biografia: 'Fundadora de Peluquería 1.',
    },
  });

  const PROFESIONALES = [
    {
      correo: 'profesional@peluqueria1.com',
      nombreCompleto: 'Profesional Demo',
      biografia: 'Estilista especializado en color y estilismo.',
    },
    {
      correo: 'camila@peluqueria1.com',
      nombreCompleto: 'Camila Rojas',
      biografia: 'Especialista en corte y coloración.',
    },
    {
      correo: 'diego@peluqueria1.com',
      nombreCompleto: 'Diego Fernández',
      biografia: 'Barbero y estilista, degradados y diseño.',
    },
  ];

  const profesionales = [];
  for (const datos of PROFESIONALES) {
    const profesional = await prisma.usuario.upsert({
      where: { correo: datos.correo },
      update: {},
      create: {
        correo: datos.correo,
        hashContrasena,
        rol: 'PROFESIONAL',
        nombreCompleto: datos.nombreCompleto,
        biografia: datos.biografia,
      },
    });
    profesionales.push(profesional);
  }

  for (const persona of [propietaria, ...profesionales]) {
    for (let diaSemana = 1; diaSemana <= 5; diaSemana += 1) {
      await prisma.horarioLaboral.upsert({
        where: { profesionalId_diaSemana: { profesionalId: persona.id, diaSemana } },
        update: {},
        create: {
          profesionalId: persona.id,
          diaSemana,
          horaInicio: '09:00',
          horaFin: '18:00',
          inicioDescanso: '13:00',
          finDescanso: '14:00',
        },
      });
    }
  }

  console.log('Semilla completada.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
