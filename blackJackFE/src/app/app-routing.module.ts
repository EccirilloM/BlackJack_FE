import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { PersonalInfoComponent } from './components/profileMain/personal-info/personal-info.component';
import { ProfileContainerComponent } from './components/profileMain/profile-container/profile-container.component';
import { ChangeProfileDataComponent } from './components/profileMain/change-profile-data/change-profile-data.component';
import { ChargeMoneyComponent } from './components/charge-money/charge-money.component';
import { ForumComponent } from './components/forum/forum.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EconomistDashboardComponent } from './components/economist-dashboard/economist-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { EconomoGuard } from './guards/economo.guard';
import { TableComponent } from './components/table/table.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: 'registrazione', component: RegistrationComponent },
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "welcome", component: WelcomeComponent
      },
      {
        path: "dashboard", component: DashboardComponent
      },
      {
        path: "chargeMoney", component: ChargeMoneyComponent
      },
      {
        path: "forum/:tipoTavolo", component: ForumComponent
      },
      {
        path: "profile/:id", component: ProfileContainerComponent, children: [
          {
            path: "personalInfo", component: PersonalInfoComponent
          },
          {
            path: "changeProfileData", component: ChangeProfileDataComponent
          }
        ]
      },
      {
        path: "adminDashboard", component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: "economoDashboard", component: EconomistDashboardComponent, canActivate: [AuthGuard, EconomoGuard]
      },
      {
        path: "table/:tipoTavolo", component: TableComponent
      }

    ]
  },

  //404
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
