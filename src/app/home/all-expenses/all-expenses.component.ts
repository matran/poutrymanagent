import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { DialogDateRangeComponent } from 'src/app/dialogs/dialog-date-range/dialog-date-range.component';
import { AllExpensesService } from 'src/app/services/all-expenses.service';
import { DialogBatchDateComponent } from 'src/app/dialogs/dialog-batch-date/dialog-batch-date.component';
import { DialogBatchComponent } from 'src/app/dialogs/dialog-batch/dialog-batch.component';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'

 @Component({
  selector: 'app-all-expenses',
  templateUrl: './all-expenses.component.html',
  styleUrls: ['./all-expenses.component.css']
})
export class AllExpensesComponent implements OnInit {
  displayedColumns: string[] = ['date','batch','chicks','feeds','medicine','water','electricity','fuel','vetinary','labour','repairs','miscleneous','total'];
  dataSource = new MatTableDataSource()
  expense
  private response
  IsWait=true
  IsWaits=false
  isnotfound=false
  isShow=false
  expensedata:any
    downloadURL: Observable<string>
  @ViewChild(MatTable,{static:true}) table: MatTable<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort
  constructor(public dialog: MatDialog,public snackBar: MatSnackBar,private allexpenseService: AllExpensesService) { }
  ngOnInit(): void {
     this.allexpenseService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
         this.expensedata=products
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

   getTotalCost() {
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.total), 0); 
    return tot
  }
   
  getTotalCostChicks(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.chicks), 0); 
    return tot 
  }
  getTotalCostFeeds(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.feeds), 0); 
    return tot 
  }
  getTotalCostMedicine(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.medicine), 0); 
    return tot 

  }
  getTotalCostWater(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.water), 0); 
    return tot  
  }

  getTotalCostElectricity(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.electricity), 0); 
    return tot 
  }
  getTotalCostFuel(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.fuel), 0); 
    return tot 
  }
  getTotalCostVetenary(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.vetenary), 0); 
    return tot 

  }

  getTotalCostLabour(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.labour), 0); 
    return tot  
  }
  getTotalCostRepairs(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.repairs), 0); 
    return tot 
  }

  getTotalCostMeslenous(){
    var tot=this.expensedata.reduce((accum, curr) => accum + parseInt(curr.miscleneous), 0); 
    return tot 
  }


   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex

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

  refresh(){
    this.IsWait=true;
    this.allexpenseService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
    this.expensedata=products
      this.dataSource.data  =  products;
      this.IsWait=false;
    });
   }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDateRange(){
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const dialogRef = this.dialog.open(DialogDateRangeComponent, {
    width: '300px',
    data:''
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if(result.event =='generate'){
      const startdate = formatDate(result.startdate, format, locale);
      const enddate=formatDate(result.enddate, format, locale);
      this.filterByDate(startdate,enddate)
    }
  });

  }

  openDialogBatchDateRange(){
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const dialogRef = this.dialog.open(DialogBatchDateComponent, {
    width: '300px',
    data:''
  });
   dialogRef.afterClosed().subscribe(result => {
    if(result.event =='generate'){
      const startdate = formatDate(result.startdate, format, locale);
      const enddate=formatDate(result.enddate, format, locale);
      this.filterByDateBatch(startdate,enddate,result.batch)
    }
  });
  }

  exportExcel(){
    let options:JSON2SheetOpts  = {header: ['date','batch','chicks','feeds','medicine','water','electricity','fuel','vetinary','labour','repairs','miscleneous','total']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.expensedata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb,  'expenses.xlsx')
  }

  openDialogBatch(){
    const dialogRef = this.dialog.open(DialogBatchComponent, {
    width: '300px',
    data:''
    });
   dialogRef.afterClosed().subscribe(result => {
    if(result.event =='generate'){
      this.filterByBatch(result.batch)
    }
  })
}

  filterByDate(startDate:string,endDate:string){
    this.IsWait=true
    var listDate = [];
      var dateMove = new Date(startDate);
      var strDate = startDate;
      while (strDate < endDate){
        var strDate = dateMove.toISOString().slice(0,10);
        listDate.push(strDate);
        dateMove.setDate(dateMove.getDate()+1);
      };
    var listdate=JSON.stringify(listDate)
    this.allexpenseService.filterByDate(listdate).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
    this.expensedata=products
      this.dataSource.data  =  products
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
      }
      this.IsWait=false;
    })
  }
  filterByBatch(batch:string){
    this.IsWait=true
    this.allexpenseService.filterByBatch(batch).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
         this.expensedata=products
         this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false
    })
  }

  print(){
    var pdfsize = 'a4';
    var doc = new jsPDF('l', 'pt', pdfsize);
    var col = ['date','batch','chicks','feeds','medicine','water','electricity','fuel','vetinary','labour','repairs','miscleneous','total'];
    var rows = [];
    this.expensedata.forEach(element => {      
      var temp = [element.date,element.batch,element.chicks,element.feeds,element.medicine,element.water,element.electricity,element.fuel,element.vetenary,element.labour,element.repairs,element.miscleneous,element.total]
      rows.push(temp);
     });   
     var foot= ["Grand Total","",this.getTotalCostChicks(),this.getTotalCostFeeds(),this.getTotalCostMedicine(),this.getTotalCostWater(),this.getTotalCostElectricity(),this.getTotalCostFuel(),this.getTotalCostVetenary(),this.getTotalCostLabour(),this.getTotalCostRepairs(),this.getTotalCostMeslenous(),this.getTotalCost()]    
     rows.push(foot)   
     doc.autoTable({columnStyles: {
        0: {cellWidth: 'auto'},
      1: {cellWidth: 'auto'},
      2: {cellWidth: 'auto'} },columns:col, body: rows});
      doc.output('dataurlnewwindow')  
  }

  filterByDateBatch(startDate:string,endDate:string,batch:string){
    this.IsWait=true
    var listDate = []
      var dateMove = new Date(startDate)
      var strDate = startDate;
      while (strDate < endDate){
        var strDate = dateMove.toISOString().slice(0,10)
        listDate.push(strDate);
        dateMove.setDate(dateMove.getDate()+1)
      };
    var listdate=JSON.stringify(listDate)
    this.allexpenseService.filterByDateBatch(batch,listdate).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.expensedata=products
      this.dataSource.data  =  products
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
      }
      this.IsWait=false
    })

  }

 

}
