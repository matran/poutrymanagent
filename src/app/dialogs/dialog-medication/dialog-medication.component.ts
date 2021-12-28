import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlockService } from 'src/app/services/flock.service';
import { DialogChickComponent } from '../dialog-chick/dialog-chick.component';

@Component({
  selector: 'app-dialog-medication',
  templateUrl: './dialog-medication.component.html',
  styleUrls: ['./dialog-medication.component.css']
})
export class DialogMedicationComponent implements OnInit {

  action:string;
  local_data:any;
  public errorMessage: string = '';
  public medicationForm: FormGroup;
 chicks=[]
  constructor( public dialogRef: MatDialogRef<DialogChickComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private flockService : FlockService) {
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
      this.medicationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      date: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      batch: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      quantity: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      cost: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
    this.flockService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.chicks=  data;
          });

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.medicationForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
