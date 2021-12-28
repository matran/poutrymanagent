import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

interface Roles {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  public loginForm:FormGroup;
  public formValues:any;
  public user:User;
  public IsWait=false;
  public response:any;
  constructor(private router : Router,private formbuilder: FormBuilder,private authenticationservice: AuthenticationService,public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({  
      email : ['', Validators.required],  
      password: ['', Validators.required]
      });

  }
  onFormSubmit(form:NgForm)  
  {  
    if(!this.loginForm.invalid){
      this.formValues=form;
      this.login()
    }
  }

  login(){
    this.IsWait=true;
    this.user=new User();
    this.user.email=this.formValues.email;
    this.user.password=this.formValues.password;
    this.authenticationservice.login(this.user).pipe(
     catchError(err => of([]))
 ).subscribe(results => {
    this.IsWait=false;
    this.response=results;
    if(this.response.status=='success'){
     localStorage.setItem('isLoggedIn', "true");
     localStorage.setItem('id',this.response.user.id)
     localStorage.setItem('name',this.response.user.name)
      localStorage.setItem('email',this.response.user.email)
      this.router.navigate(['/']);
    }else if(this.response.status=='fail'){
     this.showFailMessage(this.response.message, "")
    }else{
      this.showFailMessage("Connection error has occurred", "")
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
