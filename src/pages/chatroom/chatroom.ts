import { AngularFireAuth } from 'angularfire2/auth';
import { DocshandlerProvider } from './../../providers/docshandler/docshandler';
import { PipesModule } from './../../pipes/pipes.module';
import { Storage } from '@ionic/storage';
import { ChatProvider } from './../../providers/chat/chat';
import { appconfig } from './../../app/app.config';
import { Chat } from './../../models/chat.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';  
/**
 * Generated class for the ChatroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage implements OnInit{
  chats: any = [];
  chatpartner;
  chatuser?: any;
  message: string;
  chatPayload: Chat;
  intervalScroll;
  user_id: string;
  @ViewChild("content") content: any;
  
  constructor(public navCtrl: NavController, public docService: DocshandlerProvider, public afAuth: AngularFireAuth, public storage: Storage, public afs: AngularFirestore, public navParams: NavParams, public chatService: ChatProvider) {
    this.chatpartner = this.chatService.currentChatPartner;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatroomPage');
  }

  ionViewDidEnter(){
    this.content.scrollToBottom(300);
  }

  ngOnInit() {

    // download the specific details of this logged in user from firestore and persist them
    this.user_id = firebase.auth().currentUser.uid;

    this.chatuser = this.afAuth.authState.subscribe(
      (user)=>{
        if(user){
          this.chatuser = user;
        }else{
          console.log('there is no logged in user')
        }
      }
    )

    console.log(this.chatService.currentChatPairId);

    this.storage.get("AppUser").then(chatuser => {
      this.chatuser = chatuser;
    });

    this.afs
      .collection<Chat>(appconfig.chats_endpoint, res => {
        return res.where("pair", "==", this.chatService.currentChatPairId);
      })
      .valueChanges()
      .subscribe(chats => {
        //this.availableusers = users;
        console.log(chats);
        this.chats = chats;
        //console.log(this.content);
      });

  }

  addChat() {
    if (this.message && this.message !== "") {
      console.log(this.message);
      this.chatPayload = {
        message: this.message,
        sender: this.chatuser.email,
        pair: this.chatService.currentChatPairId,
        time: new Date().getTime()
      };

      this.chatService
        .addChat(this.chatPayload)
        .then(() => {
          //Clear message box
          this.message = "";

          //Scroll to bottom
          this.content.scrollToBottom(300);
        })
        .catch(err => {
          console.log(err);
        });
    }
  } //addChat

  isChatPartner(senderEmail) {
    return senderEmail == this.chatpartner.email;
  } //isChatPartner

  attach() {

    this.docService.choose();

  }

}
