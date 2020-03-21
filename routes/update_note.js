const note_ops = require("./../helpers/note_ops.js");
async function update_note(req, res) {
  if (req.session.authed !== undefined) {
    var user_id = req.session.user_id;
    var note = req.body.note;
    if (
      typeof note.header === "string" &&
      typeof note.body === "string" &&
      typeof note.color === "string" &&
      Number.isInteger(note.id) &&
      Number.isInteger(note.last_modified)
    ) {
      var note = {
        header: note.header,
        body: note.body,
        id: note.id,
        last_modified: note.last_modified,
        color:note.color
      };
      try {
        note_ops.update_note(user_id, note);
        var message = { error: false };
        res.json(message);
      } catch (error) {
        var message = { error: "unkwn" };
        res.status(403).json(message);
      }
    }
  } else {
    var message = { error: "auth" };
    res.status(403).json(message);
  }
}

module.exports = update_note;