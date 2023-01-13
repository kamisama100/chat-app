import {Mongo} from 'meteor/mongo'
import {Meteor} from 'meteor/meteor'

export const FriendList = new Mongo.Collection('friendList');

FriendList.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});



