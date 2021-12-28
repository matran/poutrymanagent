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
import { DialogCustomersComponent } from 'src/app/dialogs/dialog-customers/dialog-customers.component';
import { Companies } from 'src/app/models/companies';
import { Customers } from 'src/app/models/customers';
import { CustomersService } from 'src/app/services/customers.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  displayedColumns: string[] = ['id','name','contact','action']
  dataSource = new MatTableDataSource();
  customer
  private response;
  IsWait=true;
  IsWaits=false;
  fb;
  isnotfound=false;
  isShow=false;
  customersdata
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  customerService: CustomersService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.customerService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
     this.customersdata=products
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

   }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogCustomersComponent, {
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
    })
  }
  updateRowData(row_obj){
     this.IsWaits=true
     this.customer=new Customers()
     this.customer.id=row_obj.id
     this.customer.name=row_obj.name
     this.customer.contact=row_obj.contact
     this.customerService.updateData(this.customer).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Updated","");
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Update ","");
      }else{
        this.showFailMessage("Connection Error","");
      }
     })
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.customerService.deleteData(row_obj.id).pipe(
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
    this.customerService.getData().pipe(
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
     this.customer=new Companies();
     this.customer.name=row_obj.name;
     this.customer.contact=row_obj.contact
     this.customerService.saveData(this.customer).pipe(
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
     });
    
  }
   refreshData(){
    this.customerService.getData()
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
    let options:JSON2SheetOpts  = {header: ['id','name','contact']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.customersdata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb,  'customers.xlsx')
     
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
