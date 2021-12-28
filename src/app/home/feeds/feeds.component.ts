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
import { DialogBatchComponent } from 'src/app/dialogs/dialog-batch/dialog-batch.component';
import { DialogDateRangeComponent } from 'src/app/dialogs/dialog-date-range/dialog-date-range.component';
import { DialogFeedsComponent } from 'src/app/dialogs/dialog-feeds/dialog-feeds.component';
import { Feeds } from 'src/app/models/feeds';
import { FeedsService } from 'src/app/services/feeds.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'
import { DialogBatchDateComponent } from 'src/app/dialogs/dialog-batch-date/dialog-batch-date.component';
@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {

  displayedColumns: string[] = ['batchno','date','category','quantity','cost','confirmedby','action'];
  dataSource = new MatTableDataSource();
  feeds;
  private response;
  IsWait=true;
  IsWaits=false;
  isnotfound=false;
  isShow=false;
  feedsdata
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  feedsService: FeedsService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.feedsService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.feedsdata=products
      this.dataSource.data  =  products
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

   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex;
       }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogFeedsComponent, {
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
    });
  }
  updateRowData(row_obj){
     this.IsWaits=true
     this.feeds=new Feeds()
     this.feeds.id=row_obj.id
     this.feeds.batchno=row_obj.batchno
     this.feeds.category=row_obj.category
     this.feeds.quantity=row_obj.quantity
     this.feeds.cost=row_obj.cost
     this.feeds.confirmedby=row_obj.confirmedby
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale)
     this.feeds.date=formattedDate
     this.feedsService.updateData(this.feeds).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false
      this.response=results
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Updated","")
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail to Update ","")
      }else{
        this.showFailMessage("Connection Error","")
      }
     })
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.feedsService.deleteData(row_obj.id).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.refreshData();
        this.openSnackBar("Successfully Deleted","");
      }else{
        this.showFailMessage("Fail To Delete","");
      }
    });
  }

  getTotalCost() {
    var tot=this.feedsdata.reduce((accum, curr) => accum + parseInt(curr.totalcost), 0); 
    return tot
  }

  getTotalQuantity(){
    var tot=this.feedsdata.reduce((accum, curr) => accum + parseInt(curr.quantity), 0); 
    return tot
  }

  refresh(){
    this.IsWait=true;
    this.feedsService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.feedsdata =products
      this.dataSource.data  =  products
      this.IsWait=false
    })
   }

  addItemData(row_obj){
     this.IsWaits=true
     this.feeds=new Feeds()
      this.feeds.batchno=row_obj.batchno
     this.feeds.category=row_obj.category
     this.feeds.quantity=row_obj.quantity
     this.feeds.confirmedby=row_obj.confirmedby
     this.feeds.cost=row_obj.cost
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale)
     this.feeds.date=formattedDate
     this.feedsService.saveData(this.feeds).pipe(
      catchError(err => of([]))).subscribe(results => {
       this.IsWaits=false
      this.response=results
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Added","")
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Add ","")
      }else{
        this.showFailMessage("Connection Error","")
      }
     })
    
  }
   refreshData(){
    this.feedsService.getData()
    .subscribe(products => {
       this.feedsdata = products
      this.dataSource.data =products
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
      }
    })
   }
   exportExcel(){
    let options:JSON2SheetOpts  = {header: ['batchno','date','category','quantity','confirmedby']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.feedsdata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Feeds');
    XLSX.writeFile(wb, 'feeds.xlsx')
     
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
  this.feedsService.filterByDateFeeds(listdate).pipe(
    catchError(err => of([]))
).subscribe(products => {
  this.displayedColumns=['batchno','date','category','quantity','cost','confirmedby']
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
  this.feedsService.filterByBatchFeeds(batch).pipe(
    catchError(err => of([]))
).subscribe(products => {
       this.displayedColumns=['batchno','date','category','quantity','cost','confirmedby']
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
  var col = ['batchno','date','category','quantity','cost','confirmedby'];
  var rows = [];
  this.feedsdata.forEach(element => {      
    var temp = [element.batchno,element.date,element.category,element.quantity,element.cost,element.confirmedby]
    rows.push(temp);
   }); 
   var foot= ["Total","","",this.getTotalQuantity(),this.getTotalCost(),""]
   rows.push(foot)      
   doc.autoTable({columnStyles: {
    0: {cellWidth: 'auto'},
    1: {cellWidth: 'auto'},
    2: {cellWidth: 'auto'} },columns:col, body: rows});
    doc.output('dataurlnewwindow')  
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
  this.feedsService.filterByDateBatchFeeds(batch,listdate).pipe(
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
