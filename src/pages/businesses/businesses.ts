import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Transactions } from './../../models/transactions.model';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
/**
 * Generated class for the BusinessesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-businesses',
  templateUrl: 'businesses.html',
})
export class BusinessesPage {
  myTrans$: Observable<Transactions[]>

  constructor(public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore) {
    this.myTrans$ = this.afs.collection<Transactions>('Products',
    ref => 
      ref
        .where('sentBy', '==',firebase.auth().currentUser.uid)
    ).valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessesPage');
  }

}
