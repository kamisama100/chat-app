import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Messages = new Mongo.Collection('messages');

Messages.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
