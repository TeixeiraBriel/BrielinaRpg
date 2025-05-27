import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NarrativaComponent } from './narrativa/narrativa.component';
import { DetalhamentoNarrativaComponent } from './detalhamento-narrativa/detalhamento-narrativa.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignupComponent },
    { path: 'Historia', component: NarrativaComponent },
    { path: 'DetalhamentoNarrativa/:id', component: DetalhamentoNarrativaComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
