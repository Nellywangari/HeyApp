import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Trades } from './../../models/trades.model';
import { Observable } from 'rxjs';
import  * as  firebase from 'firebase';
/**
 * Generated class for the SalesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html',
})
export class SalesPage {
  mySales$: Observable<Trades[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore) {

  this.mySales$ = this.afs.collection<Trades>('Products',
                    ref => 
                      ref
                        .where('bought_by', '==',firebase.auth().currentUser.uid)
                    ).valueChanges();
                  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesPage');
  }

}
