import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty && control.parent.touched);
    return control.parent.errors && control.parent.errors['notSame'] && control.parent.invalid && control.parent.touched && control.parent.dirty
  }
}
@Component({
  selector: 'app-dialog-password',
  templateUrl: './dialog-password.component.html',
  styleUrls: ['./dialog-password.component.css']
})
export class DialogPasswordComponent implements OnInit {
  id:string;
  public errorMessage: string = '';
  public passwordForm: FormGroup;
  hide = true;
  hide2= true;
  hide3=true;
  IsWait= false;
  public formValues:any;
  public user:User;
  public response:any;
  matcher = new MyErrorStateMatcher();
  constructor(public snackBar: MatSnackBar,private  userService:  UserService, public dialogRef: MatDialogRef<DialogPasswordComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public formBuilder: FormBuilder) {
      this.id = data;
     }

     doAction(){
      
    }
    
    closeDialog(){
      this.dialogRef.close({event:'Cancel'});
    }
  ngOnInit(): void {
 
      this.passwordForm = this.formBuilder.group({  
        currentpassword : ['', Validators.compose([Validators.required])],
        password : ['', Validators.compose([Validators.required,Validators.minLength(6)])],
        confirmpassword: ['']
      }, { validator: this.checkPasswords });

  }
  public hasError = (controlName: string, errorName: string) =>{
    return this.passwordForm.controls[controlName].hasError(errorName);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  checkPasswords(group: FormGroup) { 
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmpassword.value;
    return pass === confirmPass ? null : { notSame: true }   
}
onFormSubmit(form:NgForm)  
  {  
    if(!this.passwordForm.invalid){
      this.formValues=form;
      this.update()
    }

  }
  update(){
    this.IsWait=true;
    this.user=new User();
    this.user.id=parseInt(this.id)
    this.user.password=this.formValues.password;
    this.user.currentpassword=this.formValues.currentpassword;
    this.userService.updatePassword(this.user).pipe(
     catchError(err => of([]))
 ).subscribe(results => {
    this.IsWait=false;
    this.response=results;
    if(this.response.status=='success'){
      this.dialogRef.close();
     this.openSnackBar('Successfully Updated', "")
    }else if(this.response.status=='fail'){
     this.showFailMessage(this.response.message, "")
    }else{
     this.showFailMessage('Failed to Update', "")
    }
          
    },err => console.log('Error'),
    () => console.log('HTTP request completed.'));

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar']
    });
  }
  showFailMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['red-snackbar']
    });
  }

}
