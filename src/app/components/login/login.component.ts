import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {FormControl, Validators, FormGroup} from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  constructor(private matSnackBar:MatSnackBar,
             private reqService:RequestService,
              private router:Router) { }
  ngOnInit() {
    this.loginForm=new FormGroup({
      username : new FormControl('', [Validators.required]),
      password:new FormControl('',[Validators.required,Validators.minLength(4)])
    })
  }

  onSubmit(){
    console.log(this.loginForm.valid)
   if(this.loginForm.valid){
    this.loginUser();
   }
  }
loginUser(){
  this.reqService.login(this.loginForm.value).subscribe((res:any)=>{
    if(res){
      console.log(res);
      localStorage.setItem('user',JSON.stringify({isAuthenticated:res?.isAuthenticated,role:res?.role}));
      this.reqService.setLogin({isLogin:true});
      this.router.navigate(['movies-list'],);
    }
    this.matSnackBar.open('User login successfully','Ok',{duration:2000});
  },((err)=>{
    console.error(err)
  })
);
}
}