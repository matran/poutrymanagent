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
import { DialogChickComponent } from 'src/app/dialogs/dialog-chick/dialog-chick.component';
import { Flock } from 'src/app/models/flock';
import { FlockService } from 'src/app/services/flock.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';

@Component({
  selector: 'app-flock',
  templateUrl: './flock.component.html',
  styleUrls: ['./flock.component.css']
})
export class FlockComponent implements OnInit {
  displayedColumns: string[] = ['batchno','datein','breed','currentstock','currentage','cost','house','personincharge','transferedtopen','status','action'];
  dataSource = new MatTableDataSource()
  flock
  private response
  IsWait=true
  IsWaits=false
  isnotfound=false
  isShow=false
  chicksdata
  downloadURL: Observable<string>
  @ViewChild(MatTable,{static:true}) table: MatTable<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  constructor(private flockService: FlockService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
  this.flockService.getAllData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.chicksdata=products
      this.dataSource.data  =  products;
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
    let offset = event.pageSize * event.pageIndex;
   }

   exportExcel(){
    let options:JSON2SheetOpts  = {header:['batchno','datein','breed','currentstock','currentage','cost','house','personincharge','transferedtopen','timestamp']}
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.chicksdata, options)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'chicks')
    XLSX.writeFile(wb,  'chicks.xlsx')
  }
  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogChickComponent, {
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
     this.IsWaits=true
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.datein
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale);
     this.flock=new Flock()
     this.flock.id=row_obj.id
     this.flock.batchno=row_obj.batchno
     this.flock.datein=formattedDate
     this.flock.breed=row_obj.breed
     this.flock.currentstock=row_obj.currentstock
     this.flock.cost=row_obj.cost
     this.flock.house=row_obj.house
     this.flock.currentage=row_obj.currentage
     this.flock.personincharge=row_obj.personincharge
     this.flock.transferedtopen=row_obj.transferedtopen
     this.flockService.updateData(this.flock).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Updated","")
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Update ","")
      }else{
        this.showFailMessage("Connection Error","")
      }
     })
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.flockService.deleteData(row_obj.id).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.refreshData();
        this.openSnackBar("Successfully Deleted","");
      }else{
        this.showFailMessage("Fail To Delete","");
      }
    })
  }

  refresh(){
    this.IsWait=true;
    this.flockService.getAllData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
    this.chicksdata=products
      this.dataSource.data  =  products;
      this.IsWait=false;
    });
   }

  addItemData(row_obj){
     this.IsWaits=true;
     const format = 'yyyy-MM-dd';
     const myDate = row_obj.datein;
     const locale = 'en-US';
     const formattedDate = formatDate(myDate, format, locale);
     this.flock=new Flock();
     this.flock.batchno=row_obj.batchno;
     this.flock.datein=formattedDate;
     this.flock.breed=row_obj.breed;
     this.flock.currentstock=row_obj.currentstock;
     this.flock.cost=row_obj.cost;
     this.flock.house=row_obj.house;
     this.flock.currentage=row_obj.currentage;
     this.flock.personincharge=row_obj.personincharge;
     this.flock.transferedtopen=row_obj.transferedtopen;
     this.flockService.saveData(this.flock).pipe(
      catchError(err => of([]))).subscribe(results => {
       this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Added","");
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Add ","");
      }else{
        this.showFailMessage("Connection Error","");
      }
     })
    
  }
  changeStatus(status,id){
    this.IsWaits=true;
    let flock=new  Flock();
    flock.id=id;
    flock.status=status
    this.flockService.changeStatus(flock).pipe(
      catchError(err => of([]))
  ).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
       if(this.response.status=='success'){
        this.openSnackBar('Updated Successfully', "")
         this.refreshData();
         this.table.renderRows();
       }else if(this.response.status=='fail'){
        this.showFailMessage('Fail To Update', "")
       }else{
        this.showFailMessage('Connection Error', "")
       }
    })
  }
   refreshData(){
    this.flockService.getAllData()
    .subscribe(products => {
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
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
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }


}
