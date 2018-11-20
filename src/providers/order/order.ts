import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { Order } from './../../models/order.model';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import DocumentReference = firebase.firestore.DocumentReference;
import { Injectable } from '@angular/core';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class OrderProvider {

  readonly path="Order";
  user_id: string;



  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {

   this.afAuth.authState.subscribe(
     (user)=>{
       if(user){
         this.user_id = user.uid;
         console.log("this is the user"+user)
       }else{
         this.user_id = user.uid;
         console.log("he doesnt exist"+user)
       }
     })

     this.user_id = firebase.auth().currentUser.uid;

     console.log(this.user_id)
  }



  //create orders table, fetch individual user orders , accept and reject orders
  // a new created order should have a status of pending,  and then it can change to either reject or accepted on
  // approval change
  

  pushOrders(
    product_id: string,
    product_name: string,
    buyer_id: string,
    seller_id: string,
    quantity: number,
    price: number,
    status: boolean,
    accepted: boolean,
    rejected: boolean
  
  ): Promise<void> {
    const orderId: string = this.afs.createId();
    return this.afs.doc<Order>(`Order/${orderId}`)
    .set({
    id: orderId,
    product_id,
    product_name,
    buyer_id,
    seller_id,
    quantity,
    price,
    status,
    accepted,
    rejected
    });

  }

  // fetch all the orders that i have sent 



  fetchMyOrders(userId: string): AngularFirestoreCollection<Order> {
    return this.afs.collection<Order>('Order',
    ref => 
      ref
        .where('buyer_id', '==',this.user_id)
        .where('accepted','==',false)
    );
  }

  acceptOrder() {

  }

  rejectOrder() {

  }

  deleteOrder(id: string) {
    return this.afs.doc<Order>(`${this.path}/${id}`).delete();
  }

  updateOrder(id: string, data: any){
    return this.afs.doc<Order>(`${this.path}/${id}`).update(data)
  }


  //fetch all the orders sent to my business


  businessOrder(userId: string): AngularFirestoreCollection<Order> {
    return this.afs.collection<Order>('Order',
    ref => 
      ref
        .where('seller_id', '==',this.user_id)
    );
  }





}
