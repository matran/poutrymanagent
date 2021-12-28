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
import { DialogIncomecategoryComponent } from 'src/app/dialogs/dialog-incomecategory/dialog-incomecategory.component';
import { IncomeCategory } from 'src/app/models/income-category';
import { IncomeCategoryService } from 'src/app/services/income-category.service';

@Component({
  selector: 'app-income-category',
  templateUrl: './income-category.component.html',
  styleUrls: ['./income-category.component.css']
})
export class IncomeCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id','name','action'];
  dataSource = new MatTableDataSource();
  incomecategory;
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

  constructor(private router : Router,private incomecategoryService: IncomeCategoryService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.incomecategoryService.getData().pipe(
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
    const dialogRef = this.dialog.open(DialogIncomecategoryComponent, {
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
     this.incomecategory=new IncomeCategory();
     this.incomecategory.id=row_obj.id;
     this.incomecategory.name=row_obj.name;
     this.incomecategoryService.updateData(this.incomecategory).pipe(
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
    this.incomecategoryService.deleteData(row_obj.id).pipe(
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
    this.incomecategoryService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.dataSource.data  =  products;
      this.IsWait=false;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
     
      }
      else{
        this.isnotfound=false
      
      }
    });
   }

  addItemData(row_obj){
     this.IsWaits=true;
     this.incomecategory=new IncomeCategory();
     this.incomecategory.name=row_obj.name
     this.incomecategoryService.saveData(this.incomecategory).pipe(
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
     () => console.log('vv'));
    
  }
   refreshData(){
    this.incomecategoryService.getData()
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
