describe('Formation Angularjs homepage', function() {

    it('should have a list of users', function() {
        browser.get('http://localhost:9000/#/');

        var users = browser.element.all(by.repeater('user in users'));

        expect(users.count()).toEqual(10);
    });

});