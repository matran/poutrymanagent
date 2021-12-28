import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExpenseCategoryService } from 'src/app/services/expense-category.service';
import { FlockService } from 'src/app/services/flock.service';

@Component({
  selector: 'app-dialog-expenses',
  templateUrl: './dialog-expenses.component.html',
  styleUrls: ['./dialog-expenses.component.css']
})
export class DialogExpensesComponent implements OnInit {
  action:string;
  local_data:any;
  public errorMessage: string = '';
  public expensesForm: FormGroup;
  categories=[];
  constructor( public dialogRef: MatDialogRef<DialogExpensesComponent>, private  chicksService:FlockService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
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
       this.expensesForm = new FormGroup({
      batch: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      date: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      cost: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
    this.chicksService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.categories =  data;
          });
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.expensesForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
