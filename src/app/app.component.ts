import { LoginPage } from './../pages/login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProductsPage } from './../pages/products/products';
import { ChatsPage } from './../pages/chats/chats';
import { Storage } from '@ionic/storage';
import { ManageBusinessPage } from './../pages/manage-business/manage-business';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ProfilePage } from '../pages/profile/profile';
import { OrdersPage } from '../pages/orders/orders';
import { timer } from 'rxjs/observable/timer';
import { MyproductsPage } from '../pages/myproducts/myproducts';
import { SalesPage } from '../pages/sales/sales';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user :any = {};

  username ="allan"

  showSplash = true;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar,public afAuth: AngularFireAuth, public splashScreen: SplashScreen, public storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: ChatsPage,  icon: 'ios-home-outline'}, 
      { title:'Shop',component: ProductsPage, icon:'ios-pricetags-outline' },
      { title:'My Products',component: MyproductsPage, icon: 'ios-cube-outline' },
      //{ title: 'Manage Business', component: ManageBusinessPage, icon:'ios-cash-outline' },
      { title: 'Orders',component:OrdersPage, icon:"ios-contract-outline" },
      { title: 'Sales',component: SalesPage, icon:'ios-pricetag-outline'},
      { title: 'Account', component: ProfilePage,icon:"ios-contact-outline"}
    ];
  
    //check login 
    this.checklogin()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.splashScreen.hide();
      timer(3000).subscribe(() => this.showSplash =false)
    });
        
}

// check whether the user had loged in before

checklogin(){
  this.afAuth.auth.setPersistence('local');
  this.afAuth.authState.subscribe(
    (user) => {
      if(!user){
        
        this.rootPage = LoginPage
        
      }else{
        this.rootPage = ChatsPage
      
      }
    }
  )
}

// read the user contacts from the phone book and upload them to the database


//initialize the app notifications on events



  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
}
