const note_ops = require("./../helpers/note_ops.js");
async function delete_note(req, res) {
  if (req.session.authed !== undefined) {
    var user_id = req.session.user_id;
    var note = req.body.note;
    if (Number.isInteger(note.id)) {
      var note = {
        id: note.id
      };
      console.log(note);
      try {
        note_ops.delete_note(user_id, note);
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

module.exports = delete_note;