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
import { DialogMedicationComponent } from 'src/app/dialogs/dialog-medication/dialog-medication.component';
import { Medication } from 'src/app/models/medication';
import { MedicationService } from 'src/app/services/medication.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {
  displayedColumns: string[] = ['batch','name','date','quantity','cost','action']
  dataSource = new MatTableDataSource()
  medication
  private response
  IsWait=true
  IsWaits=false
  fb
  isnotfound=false
  isShow=false
  medicationdata
  downloadURL: Observable<string>
  @ViewChild(MatTable,{static:true}) table: MatTable<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  constructor(private router : Router,private  medicationService: MedicationService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.medicationService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.medicationdata=products
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false
    });
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
    const dialogRef = this.dialog.open(DialogMedicationComponent, {
      width: '350px',
      data:obj
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result.event);
      if(result.event == 'Add'){
       this.addItemData(result.data) 
      }else if(result.event == 'Update'){
     
      this.updateRowData(result.data)
      
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data)
      }
    });
  }
  updateRowData(row_obj){
     this.IsWaits=true
     this.medication=new Medication()
     this.medication.id=row_obj.id
     this.medication.name=row_obj.name
     this.medication.batch=row_obj.batch
     this.medication.quantity=row_obj.quantity
     this.medication.cost=row_obj.cost
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale)
     this.medication.date=formattedDate
     this.medicationService.updateData(this.medication).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false
      this.response=results
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Updated","")
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Update ","")
      }else{
        this.showFailMessage("Connection Error","")
      }
     });
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.medicationService.deleteData(row_obj.id).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false
      this.response=results
      if(this.response.status=='success'){
        this.refreshData();
        this.openSnackBar("Successfully deleted","")
      }else{
        this.showFailMessage("Fail to delete","")
      }
    });
  }

  refresh(){
    this.IsWait=true
    this.medicationService.getData().pipe(
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
     this.IsWaits=true
     this.medication=new Medication()
     this.medication.name=row_obj.name
     this.medication.batch=row_obj.batch
     this.medication.quantity=row_obj.quantity
     this.medication.cost=row_obj.cost
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale)
     this.medication.date=formattedDate
     this.medicationService.saveData(this.medication).pipe(
      catchError(err => of([]))).subscribe(results => {
       this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully added","")
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail to add ","")
      }else{
        this.showFailMessage("Connection error","")
      }
     });
    
  }
   refreshData(){
    this.medicationService.getData()
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
    let options:JSON2SheetOpts  = {header: ['id','name','type','date','batch','quantity','cost']}
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.medicationdata, options)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'All Data Export')
    XLSX.writeFile(wb,  'medication.xlsx')
     
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
