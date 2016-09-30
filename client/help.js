var _ = require('lodash');

// Copied from Vorpal's source
function help(args, cb) {
  const self = this;
  if (args.command) {
    args.command = args.command.join(' ');
    var name = _.find(this.parent.commands, {_name: String(args.command).toLowerCase().trim()});
    if (name && !name._hidden) {
      if (_.isFunction(name._help)) {
        name._help(args.command, function (str) {
          self.log(str);
          cb();
        });
        return;
      }
      this.log(name.helpInformation());
    } else {
      this.log(this.parent._commandHelp(args.command));
    }
  } else {
    this.log(this.parent._commandHelp(args.command));
  }
  cb();
}

module.exports = help;
