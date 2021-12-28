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
import { DialogExpecategoryComponent } from 'src/app/dialogs/dialog-expecategory/dialog-expecategory.component';
import { ExpenseCategory } from 'src/app/models/expense-category';
import { ExpenseCategoryService } from 'src/app/services/expense-category.service';


@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.css']
})
export class ExpenseCategoryComponent implements OnInit {

  displayedColumns: string[] = ['id','name','action'];
  dataSource = new MatTableDataSource();
  expensecategory;
  private response;
  IsWait=true;
  IsWaits=false;
  fb;
  isnotfound=false;
  isShow=false;
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  expensecategoryService: ExpenseCategoryService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.expensecategoryService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false;
      console.log(products)
    },err => this.showFailMessage(err,""),
    () => console.log(''));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   }

   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex;
    console.log(offset)
   }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogExpecategoryComponent, {
      width: '350px',
      data:obj
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result.event);
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
     this.IsWaits=true;
     this.expensecategory=new ExpenseCategory();
     this.expensecategory.id=row_obj.id;
     this.expensecategory.name=row_obj.name;
     this.expensecategoryService.updateData(this.expensecategory).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Updated","");
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail to Update ","");
      }else{
        this.showFailMessage("Connection Error","");
      }
     },err => this.showFailMessage(err,""),
     () => console.log(''));
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.expensecategoryService.deleteData(row_obj.id).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.refreshData();
        this.openSnackBar("Successfully deleted","");
      }else{
        this.showFailMessage("Fail to delete","");
      }
    },err => console.log('HTTP Error', err),
    () => console.log(''));
  }

  refresh(){
    this.IsWait=true;
    this.expensecategoryService.getData().pipe(
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
     this.expensecategory=new ExpenseCategory();
     this.expensecategory.name=row_obj.name
     this.expensecategoryService.saveData(this.expensecategory).pipe(
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
     },err => this.showFailMessage(err,""),
     () => console.log(''));
    
  }
   refreshData(){
    this.expensecategoryService.getData()
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
