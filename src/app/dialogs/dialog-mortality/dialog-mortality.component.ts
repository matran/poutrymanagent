import { Inject, Optional } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlockService } from 'src/app/services/flock.service';

@Component({
  selector: 'app-dialog-mortality',
  templateUrl: './dialog-mortality.component.html',
  styleUrls: ['./dialog-mortality.component.css']
})
export class DialogMortalityComponent implements OnInit {
  action:string;
  local_data:any;
  public errorMessage: string = '';
  public mortalityForm: FormGroup;
  categories=[];
  chicks=[];
  constructor( public dialogRef: MatDialogRef<DialogMortalityComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private flockService: FlockService) {
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
       this.mortalityForm = new FormGroup({
      batch: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      date: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      number: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      cause: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      confirmedby: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });

    this.flockService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.chicks=  data;
          });
     


  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.mortalityForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
