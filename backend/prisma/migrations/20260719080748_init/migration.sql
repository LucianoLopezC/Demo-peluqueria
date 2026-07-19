-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('PROPIETARIO', 'PROFESIONAL');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_ASISTIO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "hashContrasena" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "telefono" TEXT,
    "urlFoto" TEXT,
    "biografia" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenRefresco" (
    "id" TEXT NOT NULL,
    "hashToken" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "revocado" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenRefresco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioCentavos" INTEGER NOT NULL,
    "duracionMinutos" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'CONFIRMADA',
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioLaboral" (
    "id" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "inicioDescanso" TEXT,
    "finDescanso" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HorarioLaboral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "TokenRefresco_hashToken_key" ON "TokenRefresco"("hashToken");

-- CreateIndex
CREATE UNIQUE INDEX "Servicio_nombre_key" ON "Servicio"("nombre");

-- CreateIndex
CREATE INDEX "Cliente_telefono_idx" ON "Cliente"("telefono");

-- CreateIndex
CREATE INDEX "Reserva_profesionalId_horaInicio_idx" ON "Reserva"("profesionalId", "horaInicio");

-- CreateIndex
CREATE INDEX "Reserva_profesionalId_estado_horaInicio_idx" ON "Reserva"("profesionalId", "estado", "horaInicio");

-- CreateIndex
CREATE UNIQUE INDEX "HorarioLaboral_profesionalId_diaSemana_key" ON "HorarioLaboral"("profesionalId", "diaSemana");

-- AddForeignKey
ALTER TABLE "TokenRefresco" ADD CONSTRAINT "TokenRefresco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioLaboral" ADD CONSTRAINT "HorarioLaboral_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
