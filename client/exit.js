// Copied from Vorpal's source
function exit(args) {
  args.options = args.options || {};
  args.options.sessionId = this.session.id;
  this.parent.exit(args.options);
}

module.exports = exit;
