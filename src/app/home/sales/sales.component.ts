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
import { DialogIncomeComponent } from 'src/app/dialogs/dialog-income/dialog-income.component';
import { Sales } from 'src/app/models/sales';
import { SalesService } from 'src/app/services/sales.service';
import * as XLSX from 'xlsx'; 
import { JSON2SheetOpts } from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable'
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  displayedColumns: string[] = ['batchno','customer','date','category','quantity','weight','amount','total','action']
  dataSource = new MatTableDataSource()
  sales
  private response
  IsWait=true
  IsWaits=false
  isnotfound=false
  isShow=false
  salesdata
  downloadURL: Observable<string>;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort, {static: true}) sort: MatSort

  constructor(private router : Router,private  salesService: SalesService,public dialog: MatDialog,public snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.salesService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
     this.salesdata=products
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }
      this.IsWait=false;
    });
  }


  getTotalCost() {
    var tot=this.salesdata.reduce((accum, curr) => accum + parseInt(curr.totalamount), 0); 
    return tot
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
   }

   getNext(event: PageEvent) {
    let offset = event.pageSize * event.pageIndex
    }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogIncomeComponent, {
      width: '350px',
      data:obj
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result.event);
      if(result.event == 'Add'){
       this.addItemData(result.data); 
      }else if(result.event == 'Update'){
     
      this.updateRowData(result.data)
      
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data)
      }
    });
  }
  updateRowData(row_obj){
     this.IsWaits=true
     this.sales=new Sales()
     this.sales.id=row_obj.id
     this.sales.batchno=row_obj.batchno
     this.sales.customer=row_obj.customer
     this.sales.category=row_obj.category
     this.sales.quantity=row_obj.quantity
     this.sales.amount=row_obj.amount
     this.sales.weight=row_obj.weight
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale)
     this.sales.date=formattedDate
     this.salesService.updateData(this.sales).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.IsWaits=false
      this.response=results
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Updated","")
        this.refreshData()
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Update " +this.response.message,"")
      }else{
        this.showFailMessage("Connection Error","")
      }
     })
  }

  deleteRowData(row_obj){
    this.IsWaits=true;
    this.salesService.deleteData(row_obj.id).pipe(
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
    this.salesService.getData().pipe(
      catchError(err => of([]))
  ).subscribe(products => {
    this.salesdata=products
     this.displayedColumns= ['batchno','customer','date','category','quantity','weight','amount','total','action']
      this.dataSource.data  =  products;
      this.IsWait=false;
    });
   }

   exportExcel(){
    let options:JSON2SheetOpts  = {header: ['id','batchno','customer','date','category','quantity','amount','total']};
    const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.salesdata, options);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb,  'expenses.xlsx')
  }

  addItemData(row_obj){
     this.IsWaits=true;
     this.sales=new Sales()
     this.sales.batchno=row_obj.batchno
     this.sales.customer=row_obj.customer
     this.sales.category=row_obj.category
     this.sales.quantity=row_obj.quantity
     this.sales.amount=row_obj.amount
     this.sales.weight=row_obj.weight
     const format = 'yyyy-MM-dd'
     const myDate = row_obj.date
     const locale = 'en-US'
     const formattedDate = formatDate(myDate, format, locale)
     this.sales.date=formattedDate
     this.salesService.saveData(this.sales).pipe(
      catchError(err => of([]))).subscribe(results => {
       this.IsWaits=false;
      this.response=results;
      if(this.response.status=='success'){
        this.openSnackBar("Successfully Added","");
        this.refreshData();
      }else if(this.response.status=='fail'){
        this.showFailMessage("Fail To Add. " +this.response.message,"");
      }else{
        this.showFailMessage("Connection Error","");
      }
     })
    
  }
   refreshData(){
    this.salesService.getData().subscribe(products => {
      this.salesdata=products
      this.dataSource.data  =  products;
      if(this.dataSource.data.length ==0){
        this.isnotfound=true
      }else{
        this.isnotfound=false
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
  this.salesService.filterByDateSales(listdate).pipe(
    catchError(err => of([]))
).subscribe(products => {
  this.salesdata=products
   this.displayedColumns= ['batchno','customer','date','category','quantity','weight','amount','total']
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
  this.salesService.filterByBatchSales(batch).pipe(
    catchError(err => of([]))
).subscribe(products => {
       this.salesdata=products
       this.displayedColumns= ['batchno','customer','date','category','quantity','weight','amount','total']
       this.dataSource.data  =  products;
    if(this.dataSource.data.length ==0){
      this.isnotfound=true
    }
    this.IsWait=false
  })
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
  this.salesService.filterByDateBatchSales(batch,listdate).pipe(
    catchError(err => of([]))
).subscribe(products => {
    this.salesdata=products
    this.displayedColumns= ['batchno','customer','date','category','quantity','weight','amount','total']
    this.dataSource.data  =  products
    if(this.dataSource.data.length ==0){
      this.isnotfound=true
    }else{
      this.isnotfound=false
    }
    this.IsWait=false
  })

}
  
   print(){
  var total=this.getTotalCost()   
  var pdfsize = 'a4';
  var doc = new jsPDF('l', 'pt', pdfsize);
  var col = ['batchno','customer','date','category','quantity','weight','amount','total'];
  var rows = [];
  this.salesdata.forEach(element => {      
    var temp = [element.batchno,element.customer,element.date,element.category,element.quantity,element.weight,element.amount,element.totalamount];
    rows.push(temp);
   });  
   var foot=["Grand Total","","","","","","",total]; 
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
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

}
