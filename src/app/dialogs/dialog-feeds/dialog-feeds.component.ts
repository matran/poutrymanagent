import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeedsCategoryService } from 'src/app/services/feeds-category.service';
import { FlockService } from 'src/app/services/flock.service';

@Component({
  selector: 'app-dialog-feeds',
  templateUrl: './dialog-feeds.component.html',
  styleUrls: ['./dialog-feeds.component.css']
})
export class DialogFeedsComponent implements OnInit {
  action:string;
  local_data:any;
  public errorMessage: string = '';
  public feedForm: FormGroup;
  categories=[];
  chicks=[];
  constructor( public dialogRef: MatDialogRef<DialogFeedsComponent>, private feedsService: FeedsCategoryService, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private flockService : FlockService) {
      this.local_data = data;
      this.action = this.local_data.action;
   
     }

     doAction(){
      if(this.action != 'Delete'){
        var name= this.local_data.category
        let obj = this.categories.find(o => o.name === name)
        this.local_data.cost=obj.cost
         }
      this.dialogRef.close({event:this.action,data:this.local_data})
    } 
    closeDialog(){
      this.dialogRef.close({event:'Cancel'})
    }
  ngOnInit(): void {
       this.feedForm = new FormGroup({
      batchno: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      date: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      category: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      quantity: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      confirmedby: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
    this.feedsService.getData().pipe(
      catchError(err => of([]))
        ).subscribe(data => {
            this.categories =  data;
          });
          this.flockService.getData().pipe(
            catchError(err => of([]))
              ).subscribe(data => {
                  this.chicks=  data;
                });
           

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.feedForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
