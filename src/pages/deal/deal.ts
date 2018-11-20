import { ChatProvider } from './../../providers/chat/chat';
import { Chat } from './../../models/chat.model';
import { AuthProvider } from './../../providers/auth/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Products } from './../../models/product.model';
import { OrderProvider } from './../../providers/order/order';
import { TransactionsProvider } from './../../providers/transactions/transactions';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as firebase  from 'firebase';






// get the wallets transactions done here

@IonicPage()
@Component({
  selector: 'page-deal',
  templateUrl: 'deal.html',
})
export class DealPage {
  chatPayload: Chat;
  buyerInfo: any = {};
  product: any = {};
  charges: number;
  sellerInfo: any ={};
  buyerWallet: any = {};
  sellerWallet: any = {};
  order;
  constructor(public navCtrl: NavController,public chatService: ChatProvider,public toastCtrl: ToastController,public authService: AuthProvider,public afs: AngularFirestore, public navParams: NavParams, public orderService: OrderProvider, public trans: TransactionsProvider) {
  this.order=  this.navParams.get("data");

    this.getBuyerwallet(this.order.buyer_id)

    this.getSellerWallet()

    this.getSellerInfo();

    this.getBuyerInfo(this.order.buyer_id)

    this.fetchCorrespodingProduct(this.order.product_id)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealPage');
  }

  getBuyerwallet(buyer_id){
    console.log(buyer_id)
    this.trans.getBuyerWallet(buyer_id).subscribe(
      v => {
        this.buyerWallet = v;
        console.log(v)
      }
    )
  }

  fetchCorrespodingProduct(productId){
     //query the database and push them to an array
     this.afs.collection<Products>('Products', ref=> ref.where('id','==',productId).limit(1))
     .valueChanges()
     .flatMap(result => result)
     .subscribe(
       v=>{
        
        this.product = v; 
       },
       (error) => {
         console.log(error);
       }, () => {
         console.log('done');
       }
     )
  }

  getSellerWallet(){
    this.trans.checkWalletBalance().subscribe(
      v => {
        this.sellerWallet = v;
        console.log(v)
      }
    )
  
  }

  getBuyerInfo(buyerid){
    this.authService.getUserProfiles(buyerid).valueChanges().flatMap(result=>result).subscribe(
      v => {
        this.buyerInfo = v;
        console.log(this.buyerInfo)
      }
    )
  }

  getSellerInfo(){
    this.authService.getUserProfiles(firebase.auth().currentUser.uid).valueChanges().flatMap(result=>result).subscribe(
      v => {
        this.sellerInfo = v;
        console.log(this.sellerInfo)
      }
    )
  }

  checkCreditWorthness(){
    //takes the amount of money required to process the payment and checks if the 
    // buyer can afford the item

  }

  processOrder(){

    // update both parties wallets
    this.charges = this.product.price;

    if(this.buyerWallet.amount >= this.charges){

      // update the buyers wallet
      this.buyerWallet.amount = +this.buyerWallet.amount - +this.charges;
      this.trans.update(this.buyerWallet.id,this.buyerWallet)
      // update the sellers wallet
      this.sellerWallet.amount = +this.sellerWallet.amount + +this.charges;
      this.trans.update(this.sellerWallet.id,this.sellerWallet)

    
    

      // make a toast of sucess
      let toast = this.toastCtrl.create({
        message: 'Order Payment processed succesfully!!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // process the payment 
      // console.log('process is ready')
      // this.notifyTraders();
    }else{
      // alert insufficient funds
      // make a toast of insuffient funds
      let toast = this.toastCtrl.create({
        message: 'Insufficient Funds',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      console.log("insufficient funds")
    }

  }


  notifyTraders(){
    this.chatService.currentChatPairId = this.chatService.createPairId(
      this.sellerInfo,
      this.buyerInfo
    );

    this.chatService.currentChatPartner = this.buyerInfo;

    this.chatPayload = {
      message: '',
      sender: this.sellerInfo.email,
      notification: true,
      notificationmessage: 'transaction complete',
      pair: this.chatService.currentChatPairId,
      time: new Date().getTime()
    };

    this.chatService
      .addChat(this.chatPayload)
  }
}
