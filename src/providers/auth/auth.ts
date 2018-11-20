import { Wallet } from './../../models/wallet';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore'; 
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { viewClassName } from '@angular/compiler';
import { userSettings } from '../../models/userSettings';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  credentials;
  photoURL = "https://firebasestorage.googleapis.com/v0/b/hello-49a33.appspot.com/o/profilepics%2Fprofile.jpeg?alt=media&token=820a7986-7461-422d-be2b-0cae9bc64d3a";
  constructor(public afs: AngularFirestore, public afireauth: AngularFireAuth, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  async login(login) {
    return this.afireauth.auth.signInWithEmailAndPassword(login.email, login.password);
  }

  async registerUser(user): Promise<any> {
    //try catch statement
    try {
    await this.afireauth.auth
    .createUserWithEmailAndPassword(
      user.email,
      user.password
    ).then((res)=>{
      this.credentials = res;
    
       res.user.updateProfile({
        displayName: user.username,
        photoURL: this.photoURL
      })
     
    });

    const userProfileDocument: AngularFirestoreDocument<
    userSettings
    > = this.afs.doc(`userProfile/${this.credentials.user.uid}`);

    //create the user wallet on registration
          // create a wallet for the user 
    const walletId = this.createWallet()

    //populate the document with user data
    await userProfileDocument.set({
      id: this.credentials.user.uid,
      email: user.email,
      username: user.username,
      time: user.time,
      occupation: user.occupation,
      about: user.about,
      status: user.status,
      profileImage: user.profileImg      
    });
   
           //persit userdetails to local storage after successful registration
  await  this.storage.set('userData', {
      id: this.credentials.user.uid,
      email: user.email,
      username: user.username,
      time: user.time,
      occupation: user.occupation,
      about: user.about,
      status: user.status,
      profileImage: user.profileImg     
    })
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );

  } catch (error){
    console.error(error);
  }
  }

  //get details of a userProfile
  getUserProfiles(userId: string): AngularFirestoreCollection<userSettings> {
    return this.afs.collection<userSettings>('userProfile',
    ref => 
      ref
        .where('id', '==',userId)
    );
  }

    // create an wallet for the user 
    createWallet(){
    
      const amount = 0;
      const contact = 0;
      const updated_at = null;
      const created_at = new Date();
      const walletid = this.afs.createId();
      // Wallet/walletId
    this.afs.doc<Wallet>(`Wallet/${walletid}`).set({
      userid:firebase.auth().currentUser.uid,
      amount:0,
      contact:null,
      created_at:new Date(),
      updated_at:null,
      id:walletid
    })
    return walletid;
    }

    // logout function
    async logout(){
      return this.afireauth.auth.signOut();
    }

    async update(id:string, data: any){
      return this.afs.doc<userSettings>(`userProfile/${id}`).update(data);
    }

}
