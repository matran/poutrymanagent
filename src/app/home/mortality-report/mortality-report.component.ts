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
import { DialogBatchDateComponent } from 'src/app/dialogs/dialog-batch-date/dialog-batch-date.component';
import { DialogBatchComponent } from 'src/app/dialogs/dialog-batch/dialog-batch.component';
import { DialogDateRangeComponent } from 'src/app/dialogs/dialog-date-range/dialog-date-range.component';
import { DateRange } from 'src/app/models/date-range';
import { FlockService } from 'src/app/services/flock.service';
import { ReportsService } from 'src/app/services/reports.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'
@Component({
  selector: 'app-mortality-report',
  templateUrl: './mortality-report.component.html',
  styleUrls: ['./mortality-report.component.css']
})
export class MortalityReportComponent implements OnInit {
  displayedColumns: string[] = ['batchno','datein','house','currentstock','personincharge','transferedtopen','date','number','confirmedby'];
  
  dataSource = new MatTableDataSource();
  flock;
  private response;
  IsWait=true;
  IsWaits=false;
  fb;
  isnotfound=false;
  isShow=false;
  mortalityreportdata;
  mortality
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  reportService: ReportsService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.findTotalMortality()
    this.getDataMortalityReport()
   }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   }

   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex;
    }

   exportExcel(){
    let options:JSON2SheetOpts  = {header: ['batchno','datein','house','currentstock','personincharge','transferedtopen','date','number','confirmedby']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.mortalityreportdata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mortality report');
    XLSX.writeFile(wb,  'MortalityReport.xlsx')
  }


  
   getDataMortalityReport(){
    this.IsWait=true;
    this.reportService.getDataMortalityReports().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.mortalityreportdata =products
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false;
   
    },err => this.showFailMessage(err,""),
    () => console.log(''));
     
   }

   findTotalMortality(){
    this.reportService.findTotalMortality().pipe(
      catchError(err => of([]))).subscribe(mortality => {
      this.mortality = mortality;
      if(this.mortality.total ==null){
        this.mortality.total =0
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
    this.reportService.filterByDateMortality(listdate).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
    this.mortalityreportdata=products
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
    this.reportService.filterByBatchMortality(batch).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
         this.mortalityreportdata=products
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
    var col = ['batchno','datein','house','currentstock','personincharge','transferedtopen','date','number','confirmedby'];
    var rows = [];
    this.mortalityreportdata.forEach(element => {      
      var temp = [element.batchno,element.datein,element.house,element.currentstock,element.personincharge,element.transferedtopen,element.date,element.number,element.confirmedby];
      rows.push(temp);
     });        
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
    this.reportService.filterByDateBatchMortality(batch,listdate).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.mortalityreportdata=products
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
