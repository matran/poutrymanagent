import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-customers',
  templateUrl: './dialog-customers.component.html',
  styleUrls: ['./dialog-customers.component.css']
})
export class DialogCustomersComponent implements OnInit {
  action:string
  local_data:any
  public errorMessage: string = ''
  public customerForm: FormGroup

  constructor( public dialogRef: MatDialogRef<DialogCustomersComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.local_data = data
      this.action = this.local_data.action
   
     }

     doAction(){
      this.dialogRef.close({event:this.action,data:this.local_data})
    } 
    closeDialog(){
      this.dialogRef.close({event:'Cancel'})
    }
  ngOnInit(): void {
       this.customerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      contact: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.customerForm.controls[controlName].hasError(errorName)
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
