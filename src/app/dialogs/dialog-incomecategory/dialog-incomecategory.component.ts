import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogCustomersComponent } from '../dialog-customers/dialog-customers.component';

@Component({
  selector: 'app-dialog-incomecategory',
  templateUrl: './dialog-incomecategory.component.html',
  styleUrls: ['./dialog-incomecategory.component.css']
})
export class DialogIncomecategoryComponent implements OnInit {

  action:string;
  local_data:any;
  public errorMessage: string = '';
  public incomecategoryForm: FormGroup;

  constructor( public dialogRef: MatDialogRef<DialogCustomersComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data);
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
       this.incomecategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)])
      
    });

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.incomecategoryForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
