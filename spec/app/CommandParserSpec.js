CommandParser = require('../../app/CommandParser');

describe('CommandParser', () => {
    let subject;

    beforeEach(() => {
        subject = new CommandParser();
    });

    describe('parseCommand', () => {
        it('returns an object with expected action and parameters', () => {
            expect(subject.parseCommand('action name'))
                .toEqual({
                    action: 'action',
                    args: ['name']

                });
        });

        it('handles variable spacing', () => {
            expect(subject.parseCommand('   action name'))
                .toEqual({
                    action: 'action',
                    args: ['name']

                });
            expect(subject.parseCommand('action     name'))
                .toEqual({
                    action: 'action',
                    args: ['name']
                });
            expect(subject.parseCommand('action name1, name2'))
                .toEqual({
                    action: 'action',
                    args: ['name1', 'name2']
                });
        });

        it('handles commands with no arguments', () => {
            const result = subject.parseCommand('help');

            expect(result).toEqual({
                action: 'help',
                args: []
            })
        });

        describe('error handling', () => {
            it('returns false when command does not match', () => {
                expect(subject.parseCommand('123456'))
                    .toEqual(false);
            });

            it('returns false when an action is not captureable', () => {
                expect(subject.parseCommand(''))
                    .toEqual(false);
            });
        });
    });
});