const note_ops = require("./../helpers/note_ops.js");
async function sync(req, res) {
  if (req.session.authed !== undefined) {
    var user_id = req.session.user_id;
    var sync_queue = req.body.data;
    if (Array.isArray(sync_queue)) {
      for (var i = 0; i < sync_queue.length; i++) {
        var note = sync_queue[i];
        // console.log(typeof note.type)
        // console.log(typeof note.data)
        if (typeof note.type === "string" && typeof note.data === "object") {
          if (note.type === "delete") {
            if (Number.isInteger(note.data.id)) {
              var note = { id: note.data.id };
              await note_ops.delete_note(user_id, note);
            }
          } else {
            if (
              typeof note.data.header === "string" &&
              typeof note.data.body === "string" &&
              Number.isInteger(note.data.id) &&
              Number.isInteger(note.data.last_modified)
            ) {
              var new_note = {
                header: note.data.header,
                body: note.data.body,
                id: note.data.id,
                last_modified: note.data.last_modified
              };
              switch (note.type) {
                case "add":
                  await note_ops.add_note(user_id, new_note);
                  break;
                case "update":
                  await note_ops.update_note(user_id, new_note);
                  break;
                default:
                  console.log("Something wrong sync.js switch");
              }
            }
          }
        }
      }
      var message = { error: false };
      res.json(message);
    }
  } else {
    var message = { error: "auth" };
    res.status(403).json(message);
  }
}

module.exports = sync;