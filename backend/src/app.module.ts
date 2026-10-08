import { Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}