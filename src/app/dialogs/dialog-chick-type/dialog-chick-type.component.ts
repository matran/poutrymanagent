import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogChickComponent } from '../dialog-chick/dialog-chick.component';

@Component({
  selector: 'app-dialog-chick-type',
  templateUrl: './dialog-chick-type.component.html',
  styleUrls: ['./dialog-chick-type.component.css']
})
export class DialogChickTypeComponent implements OnInit {
  action:string;
  local_data:any;
  public errorMessage: string = '';
  public chickForm: FormGroup;

  constructor( public dialogRef: MatDialogRef<DialogChickComponent>, 
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
       this.chickForm = new FormGroup({
      type: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      breed: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      purpose: new FormControl('', [Validators.required, Validators.maxLength(50)])
    });
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.chickForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
