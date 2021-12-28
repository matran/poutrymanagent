import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlockService } from 'src/app/services/flock.service';

@Component({
  selector: 'app-dialog-batch',
  templateUrl: './dialog-batch.component.html',
  styleUrls: ['./dialog-batch.component.css']
})
export class DialogBatchComponent implements OnInit {
  local_data:any;
  public errorMessage: string = '';
  public reportForm: FormGroup;
  batch:string;
  chicks=[]
  constructor( public dialogRef: MatDialogRef<DialogBatchComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private flockService: FlockService) {
      this.local_data = data;
      }
     doAction(){
      this.dialogRef.close({event:'generate',batch:this.batch});
    } 
    closeDialog(){
      this.dialogRef.close({event:'cancel'});
    }
  ngOnInit(): void {
     this.reportForm = new FormGroup({
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
