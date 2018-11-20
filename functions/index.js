const functions = require('firebase-functions');
const admin = require('firebase-admin');

const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID ="KOTXKE80QA";
const ALGOLIA_ADMIN_KEY = "87e431a34dff140956970e40e5abd801";
const ALGOLIA_INDEX_NAME = "products";

admin.initializeApp(functions.config().firebase);

exports.addFirestoreDataToAlgolia = functions.https.onRequest((req, res)=>{


    var arr = [];

    admin.firestore().collection("Products").get().then((docs)=>{
        docs.forEach((doc) => {
            let product = doc.data();
            exports.onFileChange= functions.storage.object().onFinalize(event => {
                console.log(event);
            });
            product.objectID = doc.id;

            arr.push(product)
        })

        var client = algoliasearch(ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY);
        var index = client.initIndex(ALGOLIA_INDEX_NAME);

        index.saveObjects(arr, function (err, content){
            if(err){
                console.log(err)
            }
          return  res.status(200).send(content);
        })

        return null;

    }).catch((error)=>{
        console.log(error)
    })

})
    