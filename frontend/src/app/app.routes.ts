import { Routes } from '@angular/router';
import { PetListComponent } from './pets/pet-list/pet-list.component';
import { PetDetailComponent } from './pets/pet-detail/pet-detail.component';
import { PetAdoptComponent } from './pets/pet-adopt/pet-adopt';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { PetFormComponent } from './pets/pet-form/pet-form';

export const routes: Routes = [
  { path: '', component: PetListComponent },
  { path: 'pets/:id', component: PetDetailComponent },
  { path: 'pets/:id/adopt', component: PetAdoptComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'admin/new', component: PetFormComponent },
  { path: 'admin/:id/edit', component: PetFormComponent },
  { path: '**', redirectTo: '' },
];