import { AngularFireAuth } from 'angularfire2/auth';
import { TransactionsProvider } from './../../providers/transactions/transactions';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  wallet = {};
  buyerWallet: any = {};
  walletBalance: number;
  product:any;
  orders: any[];
  money: any={};
  walletData;
    user = {
    name: '',
    profileImage: '',
    occupation: '',
    description: '',
    email: '',
    status: ''
  };

  userData:any = {}

  downloadUrl;

  progress: {percentage:number}={percentage: 0}

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public trans: TransactionsProvider, public authService: AuthProvider, public toastCtrl: ToastController, public navParams: NavParams, public storage: Storage) {
    this.checkDetails();
    this.checkBalance();
    
  }

  ionViewDidLoad() {
   
    console.log('ionViewDidLoad ProfilePage');
  }

  checkDetails(){
    this.storage.get('userData')
  .then((data) => {
    this.user.name = data.username,
    this.user.profileImage = data.profileImage,
    this.user.occupation = data.occupation,
    this.user.description = data.about,
    this.user.email = data.email,
    this.user.status = data.status
  }
  );
  }

  logout(){
    //deactivate the user 
    //consequently clean after them 
    this.authService.logout();
    
  }

  checkBalance(){
    this.wallet = this.trans.checkWalletBalance()
    .subscribe(
     v => {
       let balance = v
       this.walletData = v;
       this.money = v;
     this.walletBalance=balance.amount
     console.log(this.walletBalance)
     },
     (error)=>{
       console.log(error)
     }
   );  
   }

   changeImg(event){
       // create a reference to the firebase storage   
  const file: File = event.target.files[0];
  
  const metadata = {'contentType': file.type};
  const path = `Products/${new Date().getTime()}_${file.name}`;
  const bucketStore = firebase.storage().ref(path);
  

  const uploadTask=bucketStore.put(file,metadata);

  console.log("uploading", file.name);
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,(uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
    this.progress.percentage = Math.round((uploadSnapshot.bytesTransferred/uploadSnapshot.totalBytes)*100)
    console.log(this.progress.percentage)
  })

  uploadTask.then((uploadSnapshot: firebase.storage.UploadTaskSnapshot)=>{
    const percentage = uploadSnapshot.bytesTransferred / uploadSnapshot.totalBytes * 100
    bucketStore.getDownloadURL().then((url)=>{
    this.downloadUrl = url
      this.afAuth.auth.currentUser.updateProfile({
        displayName: this.user.name,
        photoURL: this.downloadUrl
      }).then((res)=>{
        this.user.profileImage = this.downloadUrl
        this.authService.update(firebase.auth().currentUser.uid, this.user)
      })
    console.log(this.downloadUrl)
    })
  
  })



  return this.downloadUrl
   }

}
