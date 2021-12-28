import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DateRange } from 'src/app/models/date-range';
import { ReportsService } from 'src/app/services/reports.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';
import { formatDate } from '@angular/common';
import { DialogDateRangeComponent } from 'src/app/dialogs/dialog-date-range/dialog-date-range.component';
import { DialogBatchDateComponent } from 'src/app/dialogs/dialog-batch-date/dialog-batch-date.component';
import { DialogBatchComponent } from 'src/app/dialogs/dialog-batch/dialog-batch.component';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'
@Component({
  selector: 'app-feeds-report',
  templateUrl: './feeds-report.component.html',
  styleUrls: ['./feeds-report.component.css']
})
export class FeedsReportComponent implements OnInit {

  displayedColumns: string[] = ['batchno','datein','currentstock','house','personincharge','transferedtopen','date','category','quantity','confirmedby'];
  
  dataSource = new MatTableDataSource();
  flock;
  private response;
  IsWait=true;
  IsWaits=false;
  fb;
  isnotfound=false;
  isShow=false;
  feedsdata
  feeds
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  reportService: ReportsService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
   this.fintTotalFeeds()
   this.getDataFeedReport()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   }

   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex;
   }


   getDataFeedReport(){
    this.IsWait=true;
      this.reportService.getDataFeedsReports().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.feedsdata=products
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false;
   
    },err => this.showFailMessage(err,""),
    () => console.log(''));
     
   }
   
  
   exportExcel(){
    let options:JSON2SheetOpts  = {header: ['batchno','datein','currentstock','house','personincharge','transferedtopen','date','category','quantity','confirmedby']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.feedsdata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Data Export');
    XLSX.writeFile(wb,  'feedsreport.xlsx')
     
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
   fintTotalFeeds(){
     this.reportService.findTotalFeeds().pipe(
      catchError(err => of([]))).subscribe(feeds => {
      this.feeds =feeds;
      if(this.feeds.total ==null){
        this.feeds.total =0
      }
    },err => console.log(''),
    () => console.log(''));
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
    this.reportService.filterByDateFeeds(listdate).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
    this.feedsdata=products
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
    this.reportService.filterByBatchFeeds(batch).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
         this.feedsdata=products
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
    this.feedsdata.forEach(element => {      
      var temp = [element.date,element.batch,element.chicks,element.feeds,element.medicine,element.water,element.electricity,element.fuel,element.vetenary,element.labour,element.repairs,element.miscleneous,element.total];
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
    this.reportService.filterByDateBatchFeeds(batch,listdate).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.feedsdata=products
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
