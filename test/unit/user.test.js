const { assert } = require('chai');
const { getErrors } = require('./helpers');
const User = require('../../lib/models/user');

describe('User Model', () => {

    it('Validates a good model', () => {
        const data = {
            name: 'Easton John',
            year: '2000',
            email: 'easton@email.com',
            password: 'pwd123',
            roles: ['customer']
        };

        const user = new User(data);

        assert.equal(user.email, data.email);
        assert.isUndefined(user.password, 'password should be set');

        user.generateHash(data.password);
        assert.isDefined(user.hash, 'hash is defined');
        assert.notEqual(user.hash, data.password, 'hash not same as password');

        assert.isUndefined(user.validateSync());

        assert.isTrue(user.comparePassword(data.password), 'compare good password');
        assert.isFalse(user.comparePassword('bad password'), 'compare bad password');

    });

    it('Validates that all fields are required', () => {
        const user = new User({});
        const errors = getErrors(user.validateSync(), 4);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.year.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });

    it('Validates role is either customer, owner, or admin', () => {
        const user = new User({
            name: 'Easton John',
            year: '2000',
            email: 'easton@email.com',
            hash: 'fakeHash',
            roles: 'superUser'
        });
        const errors = getErrors(user.validateSync(), 1);
        assert.equal(Object.keys(errors).length, 1);
        assert.equal(errors['roles.0'].kind, 'enum');

    }); 
    
});