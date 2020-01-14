import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';


const routes: Routes = [ // Tableau pour le routing

  {path: 'heroes', component: HeroesComponent }, 
  {path: 'dashboard', component: DashboardComponent }, 
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'}, // Chemin par défaut quand on arrive sur le site
  { path: 'detail/:id', component: HeroDetailComponent }, // fiche de chaque hero par son id
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
