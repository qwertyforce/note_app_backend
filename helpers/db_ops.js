var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/';
const crypto = require('crypto');
var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const db_main = 'user_data';
const client = new MongoClient(url, options);
client.connect(function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log("Connected successfully to db server");
    }
});


async function findDocuments(collection_name, selector) {
    const collection = client.db(db_main).collection(collection_name);
    let result = await collection.find(selector).toArray()
    return result
}
async function removeDocument(collection_name, selector) {
    const collection = client.db(db_main).collection(collection_name);
    collection.deleteOne(selector)
}

async function insertDocuments(collection_name, documents) {
    const collection = client.db(db_main).collection(collection_name);
    collection.insertMany(documents)
    // let result = await collection.insertMany(documents);
    // return result
}
async function updateDocument(collection_name,selector,update) {
  const collection = client.db(db_main).collection(collection_name);
  let result= collection.updateOne(selector, { $set: update })
  return result
  // let result= await collection.updateOne(selector, { $set: update })

}
async function addToArrayInDocument(collection_name,selector,update) {
  const collection = client.db(db_main).collection(collection_name);
  let result =collection.updateOne(selector, { $push: update })
  return result
}

async function removeFromArrayInDocument(collection_name,selector,update) {
  const collection = client.db(db_main).collection(collection_name);
  let result = collection.updateOne(selector, { $pull: update })
  return result
}

 

async function generate_id() {
    const id = new Promise((resolve, reject) => {
        crypto.randomBytes(32, async function(ex, buffer) {
            if (ex) {
                reject("error");
            }
            let id = buffer.toString("base64")
            let users = await find_user_by_id(id) //check if id exists
            if (users.length === 0) {
                resolve(id);
            } else {
                let id_1 = await generate_id()
                resolve(id_1)
            }
        });
    });
    return id;
}






//////////////////////////////////NOTES ACTIONS
async function get_notes(user_id) {
  var user=await find_user_by_id(user_id)
  return user[0].notes
}

async function get_note_by_id(user_id,note_id) {
  var notes=await findDocuments("users", {
        id: user_id,"notes.id":note_id
    })
  return notes[0]
}

async function update_note(user_id,note_id,update) {
  return updateDocument("users",{id: user_id,"notes.id":note_id},update)
}

async function add_note(user_id,note) {
  return addToArrayInDocument("users",{id: user_id},{notes:note})
}

async function delete_note(user_id,note) {
  return removeFromArrayInDocument("users",{id: user_id},{notes:note})
}
 

//////////////////////////////////////////ACTIVATED USER

async function find_user_by_oauth_id(oauth_id) {
    let user = await findDocuments("users", {
        oauth_id: oauth_id
    })
    return user
}

async function find_user_by_id(id) {
    let user = await findDocuments("users", {
        id: id
    })
    return user
}

async function create_new_user_activated_github(oauth_id) {
    var id=await generate_id()
    insertDocuments("users", [{
        oauth_id: oauth_id,
        id: id,
        notes:[],
        activated: true
    }])
    return id
}

async function create_new_user_activated_google(oauth_id,email) {
    var id=await generate_id()
    insertDocuments("users", [{
        oauth_id: oauth_id,
        email_google:email,
        id: id,
        notes:[],
        activated: true
    }])
    return id
}
/////////////////////////////////////////////////////////




module.exports =  {
    note:{
update_note,
add_note,
delete_note,
get_notes,
get_note_by_id
    },
    activated_user:{
        find_user_by_oauth_id,
        find_user_by_id,
        create_new_user_activated_github,
        create_new_user_activated_google
    }
}