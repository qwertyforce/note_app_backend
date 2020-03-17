const note_ops = require("./../helpers/note_ops.js");
async function get_notes(req, res) {
  if (req.session.authed !== undefined) {
    var user_id = req.session.user_id;
    try {
      var notes = await note_ops.get_notes(user_id);
      res.json(notes);
    } catch (error) {
      var message = { error: "unkwn" };
      res.status(403).json(message);
    }
  } else {
    var message = { error: "auth" };
    res.status(403).json(message);
  }
}

module.exports = get_notes;
