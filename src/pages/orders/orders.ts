import { DealPage } from './../deal/deal';
import { Products } from './../../models/product.model';
import { Wallet } from './../../models/wallet';
import { TransactionsProvider } from './../../providers/transactions/transactions';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { OrderProvider } from './../../providers/order/order';
import { Order } from './../../models/order.model';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import 'rxjs/add/operator/mergeMap';
import { PatternValidator } from '@angular/forms';
import { makeDecorator } from '@angular/core/src/util/decorators';
import { Transactions } from './../../models/transactions.model';
import { Trades } from './../../models/trades.model';
 

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  buyerWallet: any = {};
  walletBalance: number;
  myOrders$: Observable<Order[]>;
  businessOrders$: Observable<Order[]>;
  product:any;
  orders: any[];
  money: any={};
  orderArray = [];
  sellerWallet = [];
  walletData;
  products = new Array()
  transaction: Transactions = {
    time: null,
    amount: null,
    sentBy: '',
    sentTo: ''
  }
  trades: Trades ={
    id:'',
    bought_from:'',
    bought_by:'',
    category_id:'',
    user_id: '',
    imgUrl:'',
    name: '',
    brief_description: '',
    description: '',
    units: null,
    measurement:'',
    price: null,
    lat: null,
    lng: null,
    location: ''
  }
  user = {
    id:'',
    name: '',
    profileImage: '',
    occupation: '',
    description: '',
    email: '',
    status: ''
  };
  wallet;
  totalOrderAmount:number = 0;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public trans: TransactionsProvider, public afs: AngularFirestore, public afAuth: AngularFireAuth, public navParams: NavParams, public orderService: OrderProvider, public  storage: Storage) {

    this.checkBalance()

    this.afAuth.authState.subscribe(
      (user)=>{
        if(!user){
          console.log("No logged in user")
        }else{
          this.user.id = user.uid
        }
      })

   
    this.myOrders$ = this.orderService.fetchMyOrders(this.user.id).valueChanges();
    this.businessOrders$ = this.orderService.businessOrder(this.user.id).valueChanges(); 

    this.myOrders$.forEach((item) => {
      //convert all orders to JSON and store them in an array
      this.orderArray.push(item)
      //query the database for the corresponding database details and display the products instead of raw orders 
      item.forEach((element,index)=>{

        //query the database and push them to an array
        this.afs.collection<Products>('Products', ref=> ref.where('id','==',element.product_id).limit(1))
        .valueChanges()
        .flatMap(result => result)
        .subscribe(
          v=>{
            this.totalOrderAmount =  this.totalOrderAmount + +v.price;
            let y = JSON.parse(JSON.stringify(v));
            y.orderid = element.id
            console.log(y)
            this.products.push(y)
          },
          (error) => {
            console.log(error);
          }, () => {
            console.log('done');
          }
        )
        
      })
      // console.log(this.products)  
    });
  
  }

  ngOnInit() {
   
  
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

  cancelOrder(orderid){
    //when a user cancels the order, alert the seller of a canceled order
    //this will delete the order if it isn't accepted
    console.log('delete your order')
    this.orderService.deleteOrder(orderid).then((res)=>{
      console.log('order deleted successfully')
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    },(error)=>{
      console.log('there was an error deleting the order')
    })
  }

 
  acceptOrder(item){

    this.navCtrl.push(DealPage,{data: item})
   
    // if(this.money.amount > price){
    //   console.log("insufficient funds")
    //   return;
    // }else if(this.money.amount < price){
    // this.money.amount = this.money.amount - price;
    // this.trans.update(this.money.id,this.money)
    
    // the system should also change the status of the order to paid and remove it from the 
    // list of orders make , it should also send a notification of the payment and update the 
    // other users cash wallet with more money 

    // }
  
}

checkout(){
  if(this.products.length != 0){
  if(this.walletBalance >= this.totalOrderAmount){

  let balance = this.walletBalance - this.totalOrderAmount  
  const prompt: Alert = this.alertCtrl.create({
    message: 'Make payment of '+this.totalOrderAmount+
    'Your balance will be'+balance,

    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Proceed',
        handler: data => {
          //update the guy's wallets here
          this.walletData.amount = this.walletData.amount - this.totalOrderAmount
          console.log(this.walletData.amount)

          this.products.forEach((element)=>{
            console.log(element)
            this.afs.collection('Wallet', ref=>ref.where('userid','==',element.user_id).limit(1)).valueChanges().flatMap(result=>result)
            .subscribe(
              v =>{
                let seller = JSON.stringify(v)
                this.sellerWallet.push(seller)
                console.log(this.sellerWallet)
              }
            )
          })

          this.trans.update(this.walletData.id, this.walletData).then(()=>{
            let audio = new Audio();
            audio.src = "../../assets/sounds/to-the-point.mp3";
            audio.load();
            audio.play();
            this.disparsePay()
            this.updateOrders()
          })

           
        }
      }
    ]
  });
  prompt.present();
} else if(this.walletBalance < this.totalOrderAmount){
  //create a toast indicating insufficient funds to the user
  let toast = this.toastCtrl.create({
    message: 'You Have Insufficient Funds',
    duration: 3000,
    position: 'bottom'
  });
  toast.present();
}
  }else{
    let toast = this.toastCtrl.create({
      message: 'Your cart is empty',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}

  disparsePay(){
    
    this.products.forEach((element,index)=>{

      let product = JSON.stringify(element)
      let productDetails = JSON.parse(product)
      this.trades = {
        id:productDetails.id,
        bought_from:productDetails.user_id,
        bought_by:firebase.auth().currentUser.uid,
        category_id:productDetails.category_id,
        user_id: productDetails.user_id,
        imgUrl:productDetails.imgUrl,
        name: productDetails.name,
        brief_description: productDetails.brief_description,
        description: productDetails.description,
        units: 1,
        measurement:productDetails.measurement,
        price: productDetails.price,
        lat: productDetails.lat,
        lng: productDetails.lng,
        location: productDetails.location
  
      }
    

      productDetails.user_id = firebase.auth().currentUser.uid;
      
      // create a purchases table showing what users have transacted
      this.afs.collection<Trades>('Trades').add(productDetails);
      

    this.sellerWallet.forEach((element, index)=>{
      let wallet = JSON.parse(element)
      wallet.amount = wallet.amount + +productDetails.price
      this.trans.update(wallet.id, wallet)

      
      // create a transactions table showing how users money was transacted
      this.transaction = {
         time: new Date().getTime(),
         amount: productDetails.price,
         sentBy: firebase.auth().currentUser.uid,
         sentTo: wallet.userid
       }
      this.afs.collection<Transactions>('Transactions').add(this.transaction).then(()=>{
       console.log("done")   
      })
    })
    })
  }

  //change the status of the orders to accepted on paid 
  updateOrders(){
    this.orderArray.forEach((element, index)=>{
      
      element[0].accepted = true;
      let order = JSON.stringify(element)
      console.log(element[0].id)
      console.log(order)      

      this.orderService.updateOrder(element[0].id,element[0]);
    })
  }

}