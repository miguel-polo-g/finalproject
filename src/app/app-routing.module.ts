import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldwideComponent } from './worldwide/worldwide.component';
import { CountryComponent } from './country/country.component';
import { AddnewsComponent } from './addnews/addnews.component';
import { SecurePagesGuard } from './secure-pages.guard';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: "country/:name", component: CountryComponent},
  { path: "worldwide", component: WorldwideComponent,
  canActivate: [SecurePagesGuard]},
  { path: "addnews", component: AddnewsComponent,
  canActivate: [AuthGuard]},
  { path: "", pathMatch: "full", redirectTo: "worldwide"},
  { path: "**", redirectTo: "worldwide"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
