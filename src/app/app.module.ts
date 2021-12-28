import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule} from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HomeComponent } from './home/home/home.component'
import { UserService } from './services/user.service';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { LoginComponent } from './home/login/login.component';
import { RegisterComponent } from './home/register/register.component';
import { ChartsModule } from 'ng2-charts';
import { AuthGuard } from './guards/auth.guard';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import {AngularFireStorageModule} from "@angular/fire/storage";
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatMomentDateModule} from 	'@angular/material-moment-adapter'
import {MatSortModule} from '@angular/material/sort';
import {NgxPrintModule} from 'ngx-print';
import { DialogPasswordComponent } from './dialogs/dialog-password/dialog-password.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FlockComponent } from './home/flock/flock.component';
import { FeedsComponent } from './home/feeds/feeds.component';
import { MedicationComponent } from './home/medication/medication.component';
import { CompaniesComponent } from './home/companies/companies.component';
import { CustomersComponent } from './home/customers/customers.component';
import { SalesComponent } from './home/sales/sales.component';
import { ExpensesComponent } from './home/expenses/expenses.component';
import { OrdersComponent } from './home/orders/orders.component';
import { ProductionComponent } from './home/production/production.component';
import { ReportsComponent } from './home/reports/reports.component';
import { ExpenseCategoryComponent } from './home/expense-category/expense-category.component';
import { IncomeCategoryComponent } from './home/income-category/income-category.component';
import { DialogChickComponent } from './dialogs/dialog-chick/dialog-chick.component';
import { DialogFeedsComponent } from './dialogs/dialog-feeds/dialog-feeds.component';
import { DialogMedicationComponent } from './dialogs/dialog-medication/dialog-medication.component';
import { DialogCompaniesComponent } from './dialogs/dialog-companies/dialog-companies.component';
import { DialogCustomersComponent } from './dialogs/dialog-customers/dialog-customers.component';
import { DialogIncomeComponent } from './dialogs/dialog-income/dialog-income.component';
import { DialogExpensesComponent } from './dialogs/dialog-expenses/dialog-expenses.component';
import { DialogOrdersComponent } from './dialogs/dialog-orders/dialog-orders.component';
import { DialogFreportsComponent } from './dialogs/dialog-freports/dialog-freports.component';
import { DialogExpecategoryComponent } from './dialogs/dialog-expecategory/dialog-expecategory.component';
import { DialogIncomecategoryComponent } from './dialogs/dialog-incomecategory/dialog-incomecategory.component';
import { MortalityComponent } from './home/mortality/mortality.component';
import { DialogMortalityComponent } from './dialogs/dialog-mortality/dialog-mortality.component';
import { ChickTypeComponent } from './home/chick-type/chick-type.component';
import { DialogChickTypeComponent } from './dialogs/dialog-chick-type/dialog-chick-type.component';
import { DialogDateRangeComponent } from './dialogs/dialog-date-range/dialog-date-range.component';
import { MortalityReportComponent } from './home/mortality-report/mortality-report.component';
import { FeedsReportComponent } from './home/feeds-report/feeds-report.component';
import { FeedsCategoryComponent } from './home/feeds-category/feeds-category.component';
import { DialogCategoryComponent } from './dialogs/dialog-category/dialog-category.component';
import { AllExpensesComponent } from './home/all-expenses/all-expenses.component';
import { DialogBatchDateComponent } from './dialogs/dialog-batch-date/dialog-batch-date.component';
import { DialogBatchComponent } from './dialogs/dialog-batch/dialog-batch.component';
import { DialogFeedCategoryComponent } from './dialogs/dialog-feed-category/dialog-feed-category.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
     DialogPasswordComponent,
     FlockComponent,
     FeedsComponent,
     MedicationComponent,
     CompaniesComponent,
     CustomersComponent,
     SalesComponent,
     ExpensesComponent,
     OrdersComponent,
     ProductionComponent,
     ReportsComponent,
     ExpenseCategoryComponent,
     IncomeCategoryComponent,
     DialogChickComponent,
     DialogFeedsComponent,
     DialogMedicationComponent,
     DialogCompaniesComponent,
     DialogCustomersComponent,
     DialogIncomeComponent,
     DialogExpensesComponent,
     DialogOrdersComponent,
     DialogFreportsComponent,
     DialogExpecategoryComponent,
     DialogIncomecategoryComponent,
     MortalityComponent,
     DialogMortalityComponent,
     ChickTypeComponent,
     DialogChickTypeComponent,
     DialogDateRangeComponent,
     MortalityReportComponent,
     FeedsReportComponent,
     FeedsCategoryComponent,
     DialogCategoryComponent,
     AllExpensesComponent,
     DialogBatchDateComponent,
     DialogBatchComponent,
     DialogFeedCategoryComponent
     ],
  entryComponents: [
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ChartsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatPaginatorModule,
    AngularFireModule,
    AngularFireStorageModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatSortModule,
    NgxPrintModule,
    MatTooltipModule,
    MatMenuModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [UserService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
