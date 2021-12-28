import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty && control.parent.touched);

    return control.parent.errors && control.parent.errors['notSame'] && control.parent.touched 
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  public registerForm:FormGroup;
  public formValues:any;
  public user:User;
  public IsWait=false;
  public response:any;
  matcher = new MyErrorStateMatcher();
  constructor(private router : Router,private formbuilder: FormBuilder,private authenticationservice: AuthenticationService,public snackBar: MatSnackBar) {
   }
  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({  
      name : ['', Validators.required],  
      email : ['', Validators.compose([Validators.required,Validators.email])],  
      password : ['', Validators.compose([Validators.required,Validators.minLength(6)])],  
      confirmpassword: ['']
    }, { validator: this.checkPasswords });

  }

  onFormSubmit(form:NgForm)  
  {  
    if(!this.registerForm.invalid){
      this.formValues=form;
      this.register()
    }
  }

   register(){
     this.IsWait=true;
     this.user=new User();
     this.user.name=this.formValues.name;
     this.user.email=this.formValues.email;
     this.user.phone=null;
     this.user.role="admin";
     this.user.office="";
     this.user.password=this.formValues.password;
     this.authenticationservice.register(this.user).pipe(
      catchError(err => of([]))
  ).subscribe(results => {
     this.IsWait=false;
     this.response=results;
     if(this.response.status=='success'){
      this.openSnackBar('Successfully Registered', "")
      this.router.navigate(['/login']);  
     }else if(this.response.status=='fail'){
      this.showFailMessage(this.response.message, "")
     }else{
      this.showFailMessage('Failed to register', "")
     }
           
     },err => console.log('Error'),
     () => console.log('HTTP request completed.'));

   }
  checkPasswords(group: FormGroup) { 
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmpassword.value;
    return pass === confirmPass ? null : { notSame: true }   
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
