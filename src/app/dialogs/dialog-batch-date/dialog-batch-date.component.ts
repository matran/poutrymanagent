import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlockService } from 'src/app/services/flock.service';
import { DialogDateRangeComponent } from '../dialog-date-range/dialog-date-range.component';

@Component({
  selector: 'app-dialog-batch-date',
  templateUrl: './dialog-batch-date.component.html',
  styleUrls: ['./dialog-batch-date.component.css']
})
export class DialogBatchDateComponent implements OnInit {
  local_data:any;
  public errorMessage: string = '';
  public reportForm: FormGroup;
  startdate:string;
  enddate:string;
  batch:string;
  chicks=[]
  constructor( public dialogRef: MatDialogRef<DialogBatchDateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private flockService: FlockService) {

      this.local_data = data;
      }

     doAction(){
      this.dialogRef.close({event:'generate',startdate:this.startdate,enddate:this.enddate,batch:this.batch});
    } 
    closeDialog(){
      this.dialogRef.close({event:'cancel'});
    }
  ngOnInit(): void {
     this.reportForm = new FormGroup({
      startdate: new FormControl('', [Validators.required]),
      enddate:new FormControl('',[Validators.required]),
      batch:new FormControl('',[Validators.required])
    });
    this.flockService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.chicks=  data;
          });
  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.reportForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
