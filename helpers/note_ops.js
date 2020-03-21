const db_ops = require('./db_ops.js')

async function add_note(user_id,note){
return db_ops.note.add_note(user_id,note)
}

async function update_note(user_id,note){
    var found = await db_ops.note.get_note_by_id(user_id,note.id);
      if (found) {
        if (found.last_modified > note.last_modified) {
          var new_note = {
            header: note.header,
            body: note.body,
            id: note.last_modified,
            last_modified: note.last_modified,
            color: note.color
          };
          return db_ops.note.add_note(user_id, new_note);
        } else {
          var note_id = note.id;
          var update = {
            "notes.$.header": note.header,
            "notes.$.body": note.body,
            "notes.$.last_modified": note.last_modified,
            "notes.$.color": note.color
          };
          return db_ops.note.update_note(user_id, note_id, update);
        }
      }else{
       return add_note(user_id,note)
      }
}

async function get_notes(user_id){
 var notes=db_ops.note.get_notes(user_id)
 return notes   
}
async function delete_note(user_id,note){
 return db_ops.note.delete_note(user_id,note)
}



module.exports =  {
 add_note,update_note,delete_note,get_notes
}