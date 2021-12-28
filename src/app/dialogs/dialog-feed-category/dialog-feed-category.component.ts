import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-feed-category',
  templateUrl: './dialog-feed-category.component.html',
  styleUrls: ['./dialog-feed-category.component.css']
})
export class DialogFeedCategoryComponent implements OnInit {

  action:string;
  local_data:any;
  public errorMessage: string = '';
  public feedCategoryForm: FormGroup;

  constructor( public dialogRef: MatDialogRef<DialogFeedCategoryComponent >, 
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
       this.feedCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      cost: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.feedCategoryForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
