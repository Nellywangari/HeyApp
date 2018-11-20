import { ProductProvider } from './../../providers/product/product';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdersPage } from './../orders/orders';
import { AngularFirestore } from 'angularfire2/firestore';
import { ChatProvider } from './../../providers/chat/chat';
import { AuthProvider } from './../../providers/auth/auth';
import { userSettings } from './../../models/userSettings';
import { OrderProvider } from './../../providers/order/order';
import { Component, NgZone, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ToastController } from 'ionic-angular';
import { MapsAPILoader } from '@agm/core';
import {} from 'google-maps';
import 'rxjs/add/operator/mergeMap';
import * as firebase from 'firebase';
import {  Observable} from 'rxjs';
import { ProductsPage } from '../products/products';


/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  selectedProduct;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  chatuser;
  chatpartner:any;
  docRef;
  chatfellow;

  pickedItems: number;
  totalPicked: number;


  orderForm: FormGroup;

  constructor(public navCtrl: NavController, public productService: ProductProvider, public toastCtrl: ToastController, public navParams: NavParams, public afs: AngularFirestore, public authService: AuthProvider, public chatService: ChatProvider, private orderService: OrderProvider, private view: ViewController, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
    this.selectedProduct = this.navParams.get('data');
    //get the data of the owner of the product
    // let chatpartner = this.afs.collection('userProfile', ref => ref.where('id', '==', '1hOHNFTqwlNLMP1pmIo7RPyo6963' ).limit(1)).valueChanges();

    //set current position
    console.log(this.selectedProduct.units)
    this.setProductPosition();
    this.totalPicked = this.selectedProduct.price
    this.pickedItems = 1;
  }

  ngOnInit() {

  
    let user_id = firebase.auth().currentUser.uid;

    this.afs.collection('userProfile', ref => ref.where('id','==',user_id).limit(1))
    .valueChanges()
    .flatMap(result => result)
    .subscribe(
      v => {
       
        let y = JSON.parse(JSON.stringify(v))

        console.log(v)

        this.chatuser = v;

        console.log("this is the chatuser"+JSON.stringify(this.chatuser))
        
      },
      (error) => {
        console.log("some error occured"+error);
      }, () => {
        console.log('done');
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  makeOrder() {

  }


  setProductPosition() {
    this.latitude = this.selectedProduct.lat;
    this.longitude = this.selectedProduct.lng;
    this.zoom = 12;
  }

  orderProduct() {

    const product_id = this.selectedProduct.id;
    const product_name= this.selectedProduct.name;
    const buyer_id = firebase.auth().currentUser.uid;
    const seller_id = this.selectedProduct.user_id;
    const quantity = this.pickedItems;
    const price = this.totalPicked
    const accepted = false;
    const rejected=false;
    const status= true;
    
    let toast = this.toastCtrl.create({
      message: 'Added to cart',
      duration: 3000,
      position: 'top'
    });
    if(buyer_id == seller_id){
      console.log('you cannot add your own products to cart')
    }else if(buyer_id != seller_id){
      //add the order to the orders cart
      this.orderService.pushOrders(product_id,product_name,buyer_id,seller_id,quantity,price,status,accepted,rejected).then((res:any)=>{
        toast.present(); 

        //update the products table to get rid of the quantity
        this.selectedProduct.units = +this.selectedProduct.units - +quantity; 
        this.productService.update(product_id,this.selectedProduct).then((res)=>{
          console.log('success')
        })
     
      })
    }
 

  }

  goToChat(chatpartner){

    console.log(chatpartner)
     //query the database and push them to an array
     this.afs.collection('userProfile', ref=> ref.where('id','==',chatpartner).limit(1))
    .valueChanges()
    .flatMap(result => result)
    .subscribe(
      v=>{
         let y = JSON.parse(JSON.stringify(v));
         this.chatfellow = y;  
        console.log(JSON.stringify(v))


      
         
    this.chatService.currentChatPairId = this.chatService.createPairId(
      this.chatuser,
      this.chatfellow
    );

    this.chatService.currentChatPartner = this.chatfellow;

        
      },
      (error) => {
        console.log(error);
      }, () => {
        console.log('done');
      }
    )

    console.log("This is the chatfellow"+JSON.stringify(this.chatfellow))
    console.log("This is the chatuser"+JSON.stringify(this.chatuser))
    
    this.navCtrl.push("ChatroomPage");
  }


  productsPage(){
    this.navCtrl.setRoot(ProductsPage)
  }

  addItem(){
    if(this.pickedItems < this.selectedProduct.units){
      this.pickedItems = this.pickedItems + 1
      this.totalPicked = this.pickedItems * this.totalPicked

    }else if(this.pickedItems == this.selectedProduct.units){
      console.log('maximum units picked')
    }
    
    return this.pickedItems
  }

  removeItem(){
    if(this.pickedItems <= 1){
      console.log('minimum units reached')
    }else if(this.pickedItems > 1){

      this.pickedItems = this.pickedItems - 1
      this.totalPicked = this.pickedItems * this.totalPicked
    }
   
    console.log(this.pickedItems)
    return this.pickedItems;
  }

  

}