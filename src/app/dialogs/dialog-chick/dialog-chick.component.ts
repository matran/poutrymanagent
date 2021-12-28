import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChickTypeService } from 'src/app/services/chick-type.service';

@Component({
  selector: 'app-dialog-chick',
  templateUrl: './dialog-chick.component.html',
  styleUrls: ['./dialog-chick.component.css']
})
export class DialogChickComponent implements OnInit {

  action:string;
  local_data:any;
  public errorMessage: string = '';
  public chickForm: FormGroup;
  categories=[];
  constructor( public dialogRef: MatDialogRef<DialogChickComponent>,private chicktypeService: ChickTypeService, 
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
       this.chickForm = new FormGroup({
      batchno: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      datein: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      breed: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      currentstock: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      cost: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      house: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      currentage: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      personincharge: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      transferedtopen:new FormControl('', []) 
    });

    this.chicktypeService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.categories =  data;
            
          },err => "",
          () => console.log(''));

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.chickForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
