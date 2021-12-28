import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogFeedCategoryComponent } from 'src/app/dialogs/dialog-feed-category/dialog-feed-category.component';
import { ExpenseCategory } from 'src/app/models/expense-category';
import { FeedsCategoryService } from 'src/app/services/feeds-category.service';

@Component({
  selector: 'app-feeds-category',
  templateUrl: './feeds-category.component.html',
  styleUrls: ['./feeds-category.component.css']
})
export class FeedsCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id','name','cost','action'];
  dataSource = new MatTableDataSource();
  expensecategory;
  private response;
  IsWait=true;
  IsWaits=false;
  isnotfound=false;
  isShow=false;
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  feedscategoryService: FeedsCategoryService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.feedscategoryService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false;
    })
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
    const dialogRef = this.dialog.open(DialogFeedCategoryComponent, {
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
     this.expensecategory=new ExpenseCategory()
     this.expensecategory.id=row_obj.id
     this.expensecategory.name=row_obj.name
     this.expensecategory.cost=row_obj.cost
     this.feedscategoryService.updateData(this.expensecategory).pipe(
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
     })
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.feedscategoryService.deleteData(row_obj.id).pipe(
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
    this.feedscategoryService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.dataSource.data  =  products;
      this.IsWait=false;
    });
   }

  addItemData(row_obj){
     this.IsWaits=true;
     this.expensecategory=new ExpenseCategory();
     this.expensecategory.name=row_obj.name
     this.expensecategory.cost=row_obj.cost
     this.feedscategoryService.saveData(this.expensecategory).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully added","");
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Add ","");
      }else{
        this.showFailMessage("Connection Error","");
      }
     })
    
  }
   refreshData(){
    this.feedscategoryService.getData()
    .subscribe(products => {
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
      }
    })
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
