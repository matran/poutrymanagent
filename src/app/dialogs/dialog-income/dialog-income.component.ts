import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/customers.service';
import { FlockService } from 'src/app/services/flock.service';
import { IncomeCategoryService } from 'src/app/services/income-category.service';

@Component({
  selector: 'app-dialog-income',
  templateUrl: './dialog-income.component.html',
  styleUrls: ['./dialog-income.component.css']
})
export class DialogIncomeComponent implements OnInit {
  action:string;
  local_data:any;
  public errorMessage: string = '';
  public incomeForm: FormGroup;
  categories=[];
  customers=[];
  chicks=[];
  constructor( public dialogRef: MatDialogRef<DialogIncomeComponent>, private customerService: CustomersService,
    private incomeService: IncomeCategoryService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private flockService : FlockService) {
      this.local_data = data;
      this.action = this.local_data.action;
   
     }

     doAction(){
      this.dialogRef.close({event:this.action,data:this.local_data});
    } 
    closeDialog(){
      this.dialogRef.close({event:'Cancel'});
    }
  ngOnInit(): void {
       this.incomeForm = new FormGroup({
      batchno: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      customer: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      date: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      category: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      weight: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      quantity: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      amount: new FormControl('', [Validators.required, Validators.maxLength(30)])
      
    });
    this.incomeService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.categories =  data;
          
          });
          this.customerService.getData().pipe(
            catchError(err => of([]))
              ).subscribe(data => {
                  this.customers =  data;
                });
                this.flockService.getData().pipe(
                  catchError(err => of([]))
                    ).subscribe(data => {
                        this.chicks=  data;
                      });

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.incomeForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
