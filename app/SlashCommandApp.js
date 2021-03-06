function SlashCommandApp(commandParser, stateService, adminService, selectionService, attachmentBuilder) {
    this.commandParser = commandParser;
    this.stateService = stateService;
    this.adminService = adminService;
    this.attachmentBuilder = attachmentBuilder;
    this.selectionService = selectionService;

    this.serviceAdminRequest = function (params) {
        var msg = 'Error: ';
        var response = {};
        var self = this;

        if (!this.adminService.checkIfAdmin(params.user_name)) {
            msg += 'You need to be an admin to use this command.';
            return msg;
        }

        if (params.command === '/seabotgo') {
            var parsed = this.commandParser.parseCommand(params.text);

            if (parsed) {
                switch (parsed.action) {
                    case 'forceReject':
                        var validStanduppers =
                            parsed.args
                                .every(function (el) {
                                    return self.stateService.getSelectedStandupperNames().indexOf(el) >= 0
                                    && self.stateService.getRejectedStandupperNames().indexOf(el) < 0
                                });

                        if (!validStanduppers) {
                            msg += 'Invalid standupper(s) provided. ' +
                                'Check to make sure they are currently selected and not already rejected.';
                        } else {
                            parsed.args.forEach(function (name) {
                                self.stateService.recordRejection(name);
                                self.selectionService.replaceStandupper(name);
                            });
                            msg = 'Force rejecting for ';
                            msg += this.stateService.getCurrentStandupDateString() + ': ';
                            msg += parsed.args.join(', ');
                        }
                        break;
                    case 'help':
                        msg = "Available actions: ";
                        response.attachments = this.attachmentBuilder.buildHelpCommmands();
                        break;
                    default:
                        msg += 'Invalid action. Enter `/seabotgo help` to see a list of available actions.'
                }
            } else {
                msg += 'Unable to parse action. Enter `/seabotgo help` to see a list of available actions.'
            }
        } else {
            msg += 'Invalid command.';
        }

        response.text = msg;

        return response;
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlashCommandApp;
}