import { ChatsPage } from './../chats/chats';
import { AuthProvider } from './../../providers/auth/auth';
import { userCreds } from './../../models/userCreds';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  creds = {} as userCreds;
  public backgroundImage = 'assets/imgs/background-5.jpg';
  constructor(public navCtrl: NavController, public loadCtrl: LoadingController, public menuCtrl: MenuController, public navParams: NavParams, public authService: AuthProvider) {
    
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter(){
    this.menuCtrl.swipeEnable(false)
  }

  ionViewDidLeave(){
    this.menuCtrl.swipeEnable(true)
  }

  async login() {
    let loader = this.loadCtrl.create({
      content:'authenticating ...'
    })
 
    try{
      loader.present();
      await this.authService.login(this.creds);
      loader.dismiss()
     this.navCtrl.setRoot(ChatsPage);

    } catch(error) {
     console.log(error);
 
  }
  }

  

  goToSignup() {
    this.navCtrl.setRoot("RegisterPage");
  }

}
