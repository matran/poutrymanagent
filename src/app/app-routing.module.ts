import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './home/login/login.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './home/register/register.component';
import { ProductionComponent } from './home/production/production.component';
import { FlockComponent } from './home/flock/flock.component';
import { FeedsComponent } from './home/feeds/feeds.component';
import { MedicationComponent } from './home/medication/medication.component';
import { CompaniesComponent } from './home/companies/companies.component';
import { CustomersComponent } from './home/customers/customers.component';
import { SalesComponent } from './home/sales/sales.component';
import { ExpensesComponent } from './home/expenses/expenses.component';
import { OrdersComponent } from './home/orders/orders.component';
import { ReportsComponent } from './home/reports/reports.component';
import { IncomeCategoryComponent } from './home/income-category/income-category.component';
import { ExpenseCategoryComponent } from './home/expense-category/expense-category.component';
import { MortalityComponent } from './home/mortality/mortality.component';
import { ChickTypeComponent } from './home/chick-type/chick-type.component';
import { MortalityReportComponent } from './home/mortality-report/mortality-report.component';
import { FeedsReportComponent } from './home/feeds-report/feeds-report.component';
import { FeedsCategoryComponent } from './home/feeds-category/feeds-category.component';
import { AllExpensesComponent } from './home/all-expenses/all-expenses.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,canActivate : [AuthGuard] ,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'production',
        component: ProductionComponent
      }
      ,
      {
        path: 'chicks',
        component: FlockComponent
      }
      ,
      {
        path: 'feeds',
        component: FeedsComponent
      }
      ,
      {
        path: 'medication',
        component: MedicationComponent
      }
      ,
      {
        path: 'companies',
        component: CompaniesComponent
      }
      ,
      {
        path: 'customers',
        component: CustomersComponent
      }
      ,
      {
        path: 'sales',
        component: SalesComponent
      }
      ,
      {
        path: 'expenses',
        component: ExpensesComponent
       }
      ,
      {
        path: 'orders',
        component: OrdersComponent
      }
      ,
      {
        path: 'reports',
        component: ReportsComponent
      }
      ,
      {
        path: 'incomecategory',
        component: IncomeCategoryComponent
      }
      ,
      {
        path: 'expensecategory',
        component: ExpenseCategoryComponent
      }
      ,
      {
        path: 'mortality',
        component: MortalityComponent
      }
      ,
      {
        path: 'chicktype',
        component:ChickTypeComponent
      }
      ,
      {
        path: 'mortalityreports',
        component:MortalityReportComponent
      }
      ,
      {
        path: 'feedsreports',
        component:FeedsReportComponent
      }
      ,
      {
        path: 'feedscategory',
        component:FeedsCategoryComponent
      }
      ,
      {
        path: 'allexpenses',
        component:AllExpensesComponent
      }
    ]
  },
  {path: 'login', component: LoginComponent },
  {path: 'register',component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
