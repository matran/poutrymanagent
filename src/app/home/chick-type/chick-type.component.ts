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
import { DialogChickTypeComponent } from 'src/app/dialogs/dialog-chick-type/dialog-chick-type.component';
import { DialogChickComponent } from 'src/app/dialogs/dialog-chick/dialog-chick.component';
import { ChickType } from 'src/app/models/chick-type';
import { Flock } from 'src/app/models/flock';
import { ChickTypeService } from 'src/app/services/chick-type.service';
import { FlockService } from 'src/app/services/flock.service';

@Component({
  selector: 'app-chick-type',
  templateUrl: './chick-type.component.html',
  styleUrls: ['./chick-type.component.css']
})
export class ChickTypeComponent implements OnInit {

  displayedColumns: string[] = ['type','breed','purpose','action'];
  
  dataSource = new MatTableDataSource();
  flock;
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

  constructor(private  flockService: ChickTypeService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.flockService.getData().pipe(
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
    const dialogRef = this.dialog.open(DialogChickTypeComponent, {
      width: '320px',
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
     this.IsWaits=true;
      this.flock=new ChickType();
     this.flock.id=row_obj.id;
     this.flock.type=row_obj.type;
     this.flock.breed=row_obj.breed;
     this.flock.purpose=row_obj.purpose;
     this.flockService.updateData(this.flock).pipe(
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
    this.flockService.deleteData(row_obj.id).pipe(
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
    this.flockService.getData().pipe(
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
     this.flock=new ChickType();
     this.flock.type=row_obj.type;
     this.flock.breed=row_obj.breed;
     this.flock.purpose=row_obj.purpose;
     this.flockService.saveData(this.flock).pipe(
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
    this.flockService.getData()
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
