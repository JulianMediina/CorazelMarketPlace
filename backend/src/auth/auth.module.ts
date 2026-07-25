import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // Los env vars siempre llegan como string; si se le pasa "604800" (string) a
          // jsonwebtoken en vez del número 604800, la librería `ms` lo interpreta como
          // MILISEGUNDOS (~10 min) en lugar de segundos (7 días) — de ahí sesiones que
          // expiraban casi de inmediato. parseInt fuerza el número real.
          expiresIn: parseInt(
            config.get<string>('JWT_EXPIRES_IN_SECONDS', '604800'),
            10,
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // Protege toda la API por defecto; usar @Public() para exponer rutas del catálogo.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
