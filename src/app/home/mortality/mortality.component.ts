import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogMortalityComponent } from 'src/app/dialogs/dialog-mortality/dialog-mortality.component';
import { Mortality } from 'src/app/models/mortality';
import { MortalityService } from 'src/app/services/mortality.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'
import { DialogBatchComponent } from 'src/app/dialogs/dialog-batch/dialog-batch.component';
import { DialogDateRangeComponent } from 'src/app/dialogs/dialog-date-range/dialog-date-range.component';
import { DialogBatchDateComponent } from 'src/app/dialogs/dialog-batch-date/dialog-batch-date.component';
@Component({
  selector: 'app-mortality',
  templateUrl: './mortality.component.html',
  styleUrls: ['./mortality.component.css']
})
export class MortalityComponent implements OnInit {

  displayedColumns: string[] = ['batch','date','number','cause','confirmedby','action']
  dataSource = new MatTableDataSource();
  mortality;
  private response;
  IsWait=true;
  IsWaits=false;
  isnotfound=false;
  isShow=false;
  mortalitydata
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router : Router,private  mortalityService: MortalityService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
 
    this.mortalityService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.mortalitydata=products
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
    const dialogRef = this.dialog.open(DialogMortalityComponent, {
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
  exportExcel(){
    let options:JSON2SheetOpts  = {header: ['id','batch','date','number','cause','confirmedby']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.mortalitydata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Data Export');
    XLSX.writeFile(wb,  'mortality.xlsx')
    
  }
  getTotalCost() {
    var tot=this.mortalitydata.reduce((accum, curr) => accum + parseInt(curr.number), 0); 
    return tot
  }
  updateRowData(row_obj){
     this.IsWaits=true;
     this.mortality=new Mortality();
     this.mortality.id=row_obj.id;
     this.mortality.batch=row_obj.batch
     this.mortality.number=row_obj.number
     this.mortality.cause=row_obj.cause
     this.mortality.confirmedby=row_obj.confirmedby
     const format = 'yyyy-MM-dd';
     const myDate = row_obj.date;
     const locale = 'en-US';
     const formattedDate = formatDate(myDate, format, locale);
     this.mortality.date=formattedDate
     this.mortalityService.updateData(this.mortality).pipe(
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
     });
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.mortalityService.deleteData(row_obj.id).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.refreshData();
        this.openSnackBar("Successfully deleted","");
      }else{
        this.showFailMessage("Fail to delete","");
      }
    });
  }

  refresh(){
    this.IsWait=true;
    this.mortalityService.getData().pipe(
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
     this.mortality=new Mortality();
     this.mortality.batch=row_obj.batch
     this.mortality.number=row_obj.number
     this.mortality.cause=row_obj.cause
     this.mortality.confirmedby=row_obj.confirmedby
     const format = 'yyyy-MM-dd';
     const myDate = row_obj.date;
     const locale = 'en-US';
     const formattedDate = formatDate(myDate, format, locale);
     this.mortality.date=formattedDate
     this.mortalityService.saveData(this.mortality).pipe(
      catchError(err => of([]))).subscribe(results => {
       this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully added","");
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail to add. " +this.response.message,"");
      }else{
        this.showFailMessage("Connection error","");
      }
     });
    
  }
   refreshData(){
    this.mortalityService.getData()
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

   print(){
    var pdfsize = 'a4';
    var doc = new jsPDF('l', 'pt', pdfsize);
    var col = ['batch','date','number','cause','confirmedby'];
    var rows = [];
    this.mortalitydata.forEach(element => {      
      var temp = [element.batch,element.date,element.number,element.cause,element.confirmedby]
      rows.push(temp);
     });   
     var foot=["Total Number","",this.getTotalCost(),"",""]    
     rows.push(foot)
     doc.autoTable({columnStyles: {
        0: {cellWidth: 'auto'},
      1: {cellWidth: 'auto'},
      2: {cellWidth: 'auto'} },columns:col, body: rows});
      doc.output('dataurlnewwindow')  
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
    this.mortalityService.filterByDateBatchMortality(batch,listdate).pipe(
      catchError(err => of([]))
  ).subscribe(products => {
      this.mortalitydata=products
      this.dataSource.data  =  products
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
      }
      this.IsWait=false
    })

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
  this.mortalityService.filterByDateMortality(listdate).pipe(
    catchError(err => of([]))
).subscribe(products => {
  this.mortalitydata=products
  this.displayedColumns=['batch','date','number','cause','confirmedby']
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
  this.mortalityService.filterByBatchMortality(batch).pipe(
    catchError(err => of([]))
).subscribe(products => {
       this.mortalitydata=products
       this.displayedColumns=['batch','date','number','cause','confirmedby']
       this.dataSource.data  =  products;
    if(this.dataSource.data.length ==0){
      this.isnotfound=true
    }
    this.IsWait=false
  })
}
}
