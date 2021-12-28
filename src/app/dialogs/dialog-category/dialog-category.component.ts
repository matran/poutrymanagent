import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExpenseCategoryService } from 'src/app/services/expense-category.service';
import { DialogExpecategoryComponent } from '../dialog-expecategory/dialog-expecategory.component';

@Component({
  selector: 'app-dialog-category',
  templateUrl: './dialog-category.component.html',
  styleUrls: ['./dialog-category.component.css']
})
export class DialogCategoryComponent implements OnInit {
  action:string;
  local_data:any;
  public errorMessage: string = '';
  public categoryForm: FormGroup;
  category:string
  categories=[]
  constructor( public dialogRef: MatDialogRef<DialogCategoryComponent >, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private categoryService:ExpenseCategoryService ) {
      this.local_data = data;
      }

     doAction(){
      this.dialogRef.close({event:'open',data:this.category});
    } 
    closeDialog(){
      this.dialogRef.close({event:'Cancel'});
    }
  ngOnInit(): void {
       this.categoryForm = new FormGroup({
      category: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
    this.categoryService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.categories =  data;
          });
    }
  public hasError = (controlName: string, errorName: string) =>{
    return this.categoryForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
