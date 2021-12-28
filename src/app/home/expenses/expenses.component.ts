import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogExpensesComponent } from 'src/app/dialogs/dialog-expenses/dialog-expenses.component';
import { DialogPasswordComponent } from 'src/app/dialogs/dialog-password/dialog-password.component';
import { Companies } from 'src/app/models/companies';
import { Expenses } from 'src/app/models/expenses';
import { CompaniesService } from 'src/app/services/companies.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  displayedColumns: string[] = ['id','batch','date','cost','action'];
  dataSource = new MatTableDataSource()
  expense
  private response
  IsWait=true
  IsWaits=false
  isnotfound=false
  isShow=false
  expensedata
  category=sessionStorage.getItem('category')
  downloadURL: Observable<string>
  @ViewChild(MatTable,{static:true}) table: MatTable<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  constructor(private router : Router,private  expenseService: ExpensesService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.expenseService.getData(this.category).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.expensedata=products
      this.dataSource.data  =  products
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false;
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
   }

   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex

   }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogExpensesComponent, {
      width: '350px',
      data:obj
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
       this.addItemData(result.data); 
      }else if(result.event == 'Update'){
     
      this.updateRowData(result.data);
      
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }
  updateRowData(row_obj){
     this.IsWaits=true
     this.expense=new Expenses()
     this.expense.id=row_obj.id
     this.expense.batch=row_obj.batch
     this.expense.cost=row_obj.cost
     this.expense.category=this.category
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale)
     this.expense.date=formattedDate
     this.expenseService.updateData(this.expense).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false
      this.response=results
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Updated","")
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail to Update ","")
      }else{
        this.showFailMessage("Connection Error","")
      }
     })
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.expenseService.deleteData(row_obj.id,this.category).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.refreshData();
        this.openSnackBar("Successfully deleted","");
      }else{
        this.showFailMessage("Fail to delete","");
      }
    })
  }

  refresh(){
    this.IsWait=true;
    this.expenseService.getData(this.category).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.dataSource.data  =  products;
      this.IsWait=false;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
      }
    });
   }

  addItemData(row_obj){
     this.IsWaits=true;
     this.expense=new Expenses();
     this.expense.batch=row_obj.batch
     this.expense.cost=row_obj.cost
     this.expense.category=this.category
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale);
     this.expense.date=formattedDate;
     this.expenseService.saveData(this.expense).pipe(
      catchError(err => of([]))).subscribe(results => {
       this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully added","");
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail to add ","");
      }else{
        this.showFailMessage("Connection error","");
      }
     });
    
  }
   refreshData(){
    this.expenseService.getData(this.category)
    .subscribe(products => {
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
     
      }
      else{
        this.isnotfound=false
      
      }
    });

   }
   exportExcel(){
    let options:JSON2SheetOpts  = {header: ['id','date','category','amount']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.expensedata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'expenses');
    XLSX.writeFile(wb,  'expenses.xlsx')
  }
   
  
  
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar']
    });
  }
  showFailMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['red-snackbar']
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
