import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-date-range',
  templateUrl: './dialog-date-range.component.html',
  styleUrls: ['./dialog-date-range.component.css']
})
export class DialogDateRangeComponent implements OnInit {
  local_data:any;
  public errorMessage: string = '';
  public reportForm: FormGroup;
  startdate:string;
  enddate:string;
  constructor( public dialogRef: MatDialogRef<DialogDateRangeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

      this.local_data = data;
      }

     doAction(){
      this.dialogRef.close({event:'generate',startdate:this.startdate,enddate:this.enddate});
    } 
    closeDialog(){
      this.dialogRef.close({event:'cancel'});
    }
  ngOnInit(): void {
     this.reportForm = new FormGroup({
      startdate: new FormControl('', [Validators.required]),
      enddate:new FormControl('',[Validators.required])
    });
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.reportForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
