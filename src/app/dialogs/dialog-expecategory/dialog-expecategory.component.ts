import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-expecategory',
  templateUrl: './dialog-expecategory.component.html',
  styleUrls: ['./dialog-expecategory.component.css']
})
export class DialogExpecategoryComponent implements OnInit {
  action:string;
  local_data:any;
  public errorMessage: string = '';
  public expecategoryForm: FormGroup;

  constructor( public dialogRef: MatDialogRef<DialogExpecategoryComponent >, 
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
       this.expecategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)])
      
    });

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.expecategoryForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
