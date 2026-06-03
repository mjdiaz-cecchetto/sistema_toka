import { Routes } from '@angular/router';
import { LayoutComponent } from './admin/ui/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/ui/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'competidores',
        loadComponent: () => import('./admin/ui/competitors/competitors.component').then(m => m.CompetitorsComponent)
      },
      {
        path: 'torneo/:id',
        loadComponent: () => import('./admin/ui/tournament-detail/tournament-detail.component').then(m => m.TournamentDetailComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./admin/ui/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'escuelas',
        loadComponent: () => import('./admin/ui/schools/schools.component').then(m => m.SchoolsComponent)
      },
      {
        path: 'llaves',
        loadComponent: () => import('./admin/ui/bracket/bracket.component').then(m => m.BracketComponent)
      },
      /*
      {
        path: 'config',
        loadComponent: () => import('./admin/ui/config/config.component').then(m => m.ConfigComponent)
      },
      {
        path: 'soporte',
        loadComponent: () => import('./admin/ui/soporte/soporte.component').then(m => m.SoporteComponent)
      }
      */
    ]
  }
];
