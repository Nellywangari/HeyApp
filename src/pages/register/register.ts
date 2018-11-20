import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  creds: any = {};
  public backgroundImage = 'assets/imgs/background-5.jpg';

  constructor(public navCtrl: NavController, public loadCtrl: LoadingController, public toastCtrl: ToastController, public menuCtrl: MenuController, public navParams: NavParams, public authService: AuthProvider,public storage: Storage) {
   
  }

  ionViewDidLoad() {
     
    console.log('ionViewDidLoad RegisterPage');
  }

  ionViewWillEnter(){
    this.menuCtrl.swipeEnable(false)
  }

  ionViewDidLeave(){
    this.menuCtrl.swipeEnable(true)
  }

  register() {
    let loader = this.loadCtrl.create({
      content:'Signing you in...'
    })
    try{
      this.creds.time = new Date().getTime();
      this.creds.profileImg = "https://firebasestorage.googleapis.com/v0/b/ewallet-b3646.appspot.com/o/displayPic%2FprofPic.jpeg?alt=media&token=985e2a49-ffc9-40dd-b79b-68b05d81a3ce";
      this.creds.about = "Write something about you";
      this.creds.occupation = "occupation";
      this.creds.status = "your status";
      this.authService.registerUser(this.creds).then((res)=>{
      loader.dismiss();

       let toast = this.toastCtrl.create({
          message: 'User was added successfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot(ProfilePage);
      });
            
    }catch(error){
      console.log(error)
    }

  }

}
