import { formatDate } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatSort } from '@angular/material/sort'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { DialogBatchDateComponent } from 'src/app/dialogs/dialog-batch-date/dialog-batch-date.component'
import { DialogBatchComponent } from 'src/app/dialogs/dialog-batch/dialog-batch.component'
import { DialogDateRangeComponent } from 'src/app/dialogs/dialog-date-range/dialog-date-range.component'
import { DateRange } from 'src/app/models/date-range'
import { ReportsService } from 'src/app/services/reports.service'
import * as XLSX from 'xlsx' 
import { JSON2SheetOpts } from 'xlsx'
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = ['date','batch','income','expense','profit']
  IsWait=true
  IsWaits=false
  isnotfound=false
  isShow=false
  reportdata
  dataSource = new MatTableDataSource();
  profit:number
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private reportService: ReportsService,public snackBar: MatSnackBar,public dialog: MatDialog) { }
  ngOnInit(): void {

    this.reportService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(report => {
      this.reportdata= report
      this.dataSource.data  = report
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false
    })
  
  }



  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   }
   getTotalCostIncome() {
    var tot=this.reportdata.reduce((accum, curr) => accum + parseInt(curr.income), 0); 
    return tot
  }

  getTotalCostExpense() {
    var tot=this.reportdata.reduce((accum, curr) => accum + parseInt(curr.expense), 0); 
    return tot
  }

  getTotalCostProfit() {
    var tot=this.reportdata.reduce((accum, curr) => accum + parseInt(curr.profit), 0); 
    return tot
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



filterByDateBatch(startDate:string,endDate:string,batch:string){
  this.IsWait=true
  var daterange=new DateRange()
  daterange.batch=batch
  daterange.enddate=endDate
  daterange.startdate=startDate
  this.reportService.filterByDateBatchIncomeExpense(daterange).pipe(
    catchError(err => of([]))
).subscribe(products => {
    this.reportdata=products
    this.dataSource.data  =  products
    if(this.dataSource.data.length ==0){
      this.isnotfound=true
    }else{
      this.isnotfound=false
    }
    this.IsWait=false
  })

}
refresh(){
  this.IsWait=true;
  this.reportService.getData().pipe(
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
 filterByDate(startDate:string,endDate:string){
  this.IsWait=true
  var daterange=new DateRange()
  daterange.enddate=endDate
  daterange.startdate=startDate
  this.reportService.filterByDateIncomeExpense(daterange).pipe(
    catchError(err => of([]))
).subscribe(products => {
    this.reportdata=products
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
  this.reportService.filterByBatchIncomeExpense(batch).pipe(
    catchError(err => of([]))
).subscribe(products => {
       this.reportdata=products
       this.dataSource.data  =  products;
    if(this.dataSource.data.length ==0){
      this.isnotfound=true
    }
    this.IsWait=false
  })
}


   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex;
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
  }

   exportExcel() {
    let options:JSON2SheetOpts  = {header: ['date','batch','income','expense','total']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.reportdata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'report');
    XLSX.writeFile(wb,  'report.xlsx')
  }
  print(){
    var pdfsize = 'a4';
    var doc = new jsPDF('l', 'pt', pdfsize);
    var col = ['date','batch','income','expense','profit'];
    var rows = [];
    this.reportdata.forEach(element => {      
      var temp = [element.date,element.batch,element.income,element.expense,element.profit]
      rows.push(temp);
     });   
     var foot=["Total","",this.getTotalCostIncome(),this.getTotalCostExpense(),this.getTotalCostProfit()] 
     rows.push(foot)
     doc.autoTable({columnStyles: {
      0: {cellWidth: 'auto'},
      1: {cellWidth: 'auto'},
      2: {cellWidth: 'auto'} },columns:col, body: rows});
      doc.output('dataurlnewwindow')  
  }


 }
