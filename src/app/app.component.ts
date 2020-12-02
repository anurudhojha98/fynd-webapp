import { Component, OnInit } from '@angular/core';
import { RequestService } from './services/request.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isUserLogin: boolean;

  constructor(
    private reqService:RequestService,
  ){
  }

  ngOnInit(){
    this.reqService.loginObservable.subscribe((loginObj:any)=>{
      console.log(loginObj.isLogin);
      this.isUserLogin=loginObj.isLogin;
    },(err)=>{
      console.error(err);
    })
  }

  logout(){
    localStorage.setItem('user','');
    this.reqService.setLogin({isLogin:false});
    this.reqService.setLogout({isLogout:true});
  }

}
