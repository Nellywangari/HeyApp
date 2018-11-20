import { Wallet } from './../../models/wallet';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


/*
  Generated class for the TransactionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransactionsProvider {

  readonly path = 'Wallet';
  wallet;
  walletid;
  walletUpdate;
  walletBalance;
  walletdata;
  
  constructor(public afs: AngularFirestore) {
    console.log('Hello TransactionsProvider Provider');
  }



  checkWalletBalance(){
    const user_id = firebase.auth().currentUser.uid;
    let balance;
  return  this.afs.collection<Wallet>('Wallet',
    ref => 
      ref
        .where('userid', '==',user_id).limit(1)
    ).valueChanges().flatMap(result => result)
   
  }

  update(id: string, data: any){
   return  this.afs.doc<Wallet>(`${this.path}/${id}`).update(data);   
}


// addGroceryQuantity(
//   groceryId: string,
//   quantity: number,
//   teamId: string
// ): Promise<void> {
//   const groceryRef: firebase.firestore.DocumentReference = this.afs.doc(
//     `/teamProfile/${teamId}/groceryList/${groceryId}`
//   ).ref;

//   return this.afs.firestore.runTransaction(transaction => {
//     return transaction.get(groceryRef).then(groceryDoc => {
//       const newQuantity: number = groceryDoc.data().quantity + quantity;
//       transaction.update(groceryRef, { quantity: newQuantity });
//     });
//   });
// }

  //fetch buyer wallet data 
  getBuyerWallet(buyerid: string){
    return this.afs.collection<Wallet>('Wallet',
    ref=>ref.where('userid','==',buyerid).limit(1)
    ).valueChanges().flatMap(result => result);
  }

  NotifyOnInbox(){
    //write to the inbox of the trading parties of a transaction complete and amount involved
    
  }


}
