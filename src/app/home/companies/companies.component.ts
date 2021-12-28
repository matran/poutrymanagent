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
import { DialogCompaniesComponent } from 'src/app/dialogs/dialog-companies/dialog-companies.component';
import { Companies } from 'src/app/models/companies';
import { CompaniesService } from 'src/app/services/companies.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  displayedColumns: string[] = ['id','company','action'];
  dataSource = new MatTableDataSource();
  companies;
  private response;
  IsWait=true;
  IsWaits=false;
  fb;
  isnotfound=false;
  isShow=false;
  companiesdata
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  companyService: CompaniesService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.companyService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
     this.companiesdata=products
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
    const dialogRef = this.dialog.open(DialogCompaniesComponent, {
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
     this.IsWaits=true;
     this.companies=new Companies();
     this.companies.id=row_obj.id;
     this.companies.name=row_obj.name;
     this.companyService.updateData(this.companies).pipe(
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
    this.companyService.deleteData(row_obj.id).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.refreshData();
        this.openSnackBar("Successfully deleted","")
      }else{
        this.showFailMessage("Fail to delete","")
      }
    })
  }

  refresh(){
    this.IsWait=true;
    this.companyService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.dataSource.data  =  products;
      this.IsWait=false;
    });
   }

  addItemData(row_obj){
     this.IsWaits=true;
     this.companies=new Companies();
     this.companies.name=row_obj.name
     this.companyService.saveData(this.companies).pipe(
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
     })
    
  }
   refreshData(){
    this.companyService.getData()
    .subscribe(products => {
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
      }
    });

   }
   exportExcel(){
    let options:JSON2SheetOpts  = {header: ['id','company']}
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.companiesdata, options)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'companies');
    XLSX.writeFile(wb,  'companies.xlsx')
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
