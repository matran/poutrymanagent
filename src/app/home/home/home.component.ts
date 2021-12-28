import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { HomeService } from 'src/app/services/home.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { formatDate } from "@angular/common";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Sales Price' },
  ];
  lineChartLabels: Label[] = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', ' Sat','Sun'];
  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'white'
    },
  ];
  lineChartLegend = false;
  lineChartPlugins = [];
  lineChartType = 'line';

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  barChartLabels: Label[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
  barChartType: ChartType = 'bar';
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33,56], label: 'Sales' }
  ];

  public barChartColors: any[] = [
    { 
      backgroundColor:["#a6de00", "#6bb0b0", "#3a212f", "#263a00", "#ff81fb","#fffc2f","#ff3f00"] 
    }];
  income:any;
  expenses:any;
  profit:any;
  mortality:any;
  chicks:any;
  feeds:any;
  
   constructor(private  homeService: HomeService) { }

  ngOnInit(): void {
   
    this.getTotalIncome()
    this.getTotalExpense()
    this.getTotalChick()
    this.getTotalMortality()
    this.getTotalFeeeds()
    this.profit=parseInt(this.income.total) - parseInt(this.expenses.total)
   
  }
  ngAfterViewInit() {
   
    this.profit=parseInt(this.income.total) - parseInt(this.expenses.total)
   }
  getTotalIncome(){
    this.homeService.getTotalIncome().pipe(
      catchError(err => of([]))
  ).subscribe(income => {
      this.income= income;
      this.profit=parseInt(this.income.total) - parseInt(this.expenses.total)
      if(this.income.total ==null){
        this.income.total =0
      }
    },err => console.log(''),
    () => console.log(''));
  }
  getTotalExpense(){
    this.homeService.getTotalExpense().pipe(
      catchError(err => of([]))).subscribe(expense => {
      this.expenses = expense;
      this.profit=parseInt(this.income.total) - parseInt(this.expenses.total)
      if(this.expenses.total ==null){
        this.expenses.total =0
      }
    },err => console.log(''),
    () => console.log(''));
   }
 
   getTotalChick(){
    this.homeService.getTotalChicks().pipe(
      catchError(err => of([]))).subscribe(chicks => {
      this.chicks = chicks;
      if(this.chicks.total ==null){
        this.chicks.total =0
      }
    },err => console.log(''),
    () => console.log(''));

   }
   getTotalMortality(){
    this.homeService.getTotalMortality().pipe(
      catchError(err => of([]))).subscribe(mortality => {
      this.mortality = mortality;
      if(this.mortality.total ==null){
        this.mortality.total =0
      }
    },err => console.log(''),
    () => console.log(''));

   }

   getTotalFeeeds(){
    this.homeService.getTotalFeeds().pipe(
      catchError(err => of([]))).subscribe(feeds => {
      this.feeds = feeds;
      if(this.feeds.total ==null){
        this.feeds.total =0
      }
    },err => console.log(''),
    () => console.log(''));


   }


}
