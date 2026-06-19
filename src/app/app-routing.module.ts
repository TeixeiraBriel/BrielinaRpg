import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { NarrativaComponent } from './Pages/narrativa/narrativa.component';
import { AuthGuard } from './Services/Auth/auth.guard';
import { TestesComponent } from './Pages/testes/testes.component';
import { SectionsComponent } from './Pages/sections/sections.component';
import { SerafinsHomeComponent } from './Pages/Serafins/home/home.component';
import { MoviesComponent } from './Pages/movies/movies.component';
import { MovieReviewsComponent } from './Pages/movies/movie-reviews.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignupComponent },
    { path: 'Historia', component: NarrativaComponent, canActivate: [AuthGuard]  },
    { path: 'Filmes', component: MoviesComponent },
    { path: 'Filmes/:id/reviews', component: MovieReviewsComponent },
    { path: 'Testes', component: TestesComponent, canActivate: [AuthGuard]  },
    { path: 'Sections', component: SectionsComponent, canActivate: [AuthGuard]  },
    { path: 'Serafins/Home', component: SerafinsHomeComponent, canActivate: [AuthGuard]  },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
