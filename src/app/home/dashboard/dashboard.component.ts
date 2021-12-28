import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { catchError } from 'rxjs/operators';
import {of } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogDateRangeComponent } from 'src/app/dialogs/dialog-date-range/dialog-date-range.component';
import { DialogCategoryComponent } from 'src/app/dialogs/dialog-category/dialog-category.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  name:string;
  orderno:number;
  activeordercount;
  isShow=false
  constructor(private router: Router,private  homeService: HomeService,public dialog: MatDialog) { }

  ngOnInit(): void {
   this.name=localStorage.getItem('name')
   var role=localStorage.getItem('role')
   if(role=="parcelmanager"){
    this.isShow=false
   }else if(role=="admin"){
     this.isShow=true
   }
  }
  logout() :void {  
    localStorage.clear()  
     localStorage.setItem('isLoggedIn','false');
    this.router.navigate(['/login']);      
    }  

    generateReport(){
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
        sessionStorage.setItem("startdate",startdate)
        sessionStorage.setItem("enddate",enddate)
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/reports']));
           }
    });
  
   }

   generateReportMortality(){
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
      sessionStorage.setItem("startdate",startdate)
      sessionStorage.setItem("enddate",enddate)
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
     this.router.navigate(['/mortalityreports']));
         }
  });

 }

 generateReportAllExpenses(){
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
    sessionStorage.setItem("startdate",startdate)
    sessionStorage.setItem("enddate",enddate)
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
     this.router.navigate(['/allexpenses']));
       }
});

}

 generateReportFeeds(){
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
    sessionStorage.setItem("startdate",startdate)
    sessionStorage.setItem("enddate",enddate)
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
     this.router.navigate(['/feedsreports']));
       }
});

}
  openxpenseDialog(){
   const dialogRef = this.dialog.open(DialogCategoryComponent, {
  width: '300px',
  data:''
});

dialogRef.afterClosed().subscribe(result => {
  if(result.event =='open'){
    sessionStorage.setItem("category",result.data)
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
     this.router.navigate(['/expenses']));
       }
});

  }
   
}
