import { Meteor} from 'meteor/meteor';
import { Messages } from '../imports/api/messages';
import {FriendList} from '../imports/api/friendList';

Meteor.publish("users",()=>{
    return Meteor.users.find({});
});

Meteor.publish("messages",()=>{
    return Messages.find();
});

Meteor.publish("friendList", ()=>{
    return FriendList.find();
})

if(Meteor.isServer){
    Meteor.methods({
        'friend.insert'({friendFrom , friendTo, status}){
            FriendList.insert({friendFrom:friendFrom, friendTo:friendTo, status:status, msgStatusFrom: 0, msgStatusTo: 0});
        },
        'friend.removeFriend'({friendFrom}){
            FriendList.findOne({friendFrom:friendFrom, friendTo:Meteor.userId() , status: 'confirmed'}) != undefined ?
                FriendList.remove({friendFrom:friendFrom, friendTo:Meteor.userId() , status: 'confirmed'})
                :
                FriendList.findOne({friendFrom:Meteor.userId(), friendTo:friendFrom , status: 'confirmed'}) != undefined ?
                    FriendList.remove({friendFrom:Meteor.userId(), friendTo:friendFrom , status: 'confirmed'})
                :
                console.log("yep undefined talaga");
        },
        'friend.cancelRequest'({friendTo}){
            FriendList.remove({friendFrom: Meteor.userId(), friendTo:friendTo});
        },
        'friend.declineRequest'({friendFrom}){
            FriendList.remove({friendFrom:friendFrom , friendTo: Meteor.userId()});
        },
        'friend.acceptRequest'({friendFrom}){
            FriendList.upsert({friendFrom:friendFrom, friendTo: Meteor.userId() , status: 'pending'}, {$set:{status:'confirmed'}});
        },
        
        'message.insert'({senderID , message, recieverID, date}){
            Messages.insert({senderID:senderID , message:message, recieverID:recieverID , date:date});
            
            if(FriendList.findOne({friendFrom:senderID , friendTo:recieverID})){
                FriendList.update({friendFrom: senderID , friendTo: recieverID} , {$set:{msgStatusFrom:1}});
            }else{
                FriendList.update({friendFrom: recieverID , friendTo: senderID} , {$set:{msgStatusTo:1}});
            }
        },
        'msgStatusHandler'({senderID, recieverID}){
            if(FriendList.findOne({friendFrom:senderID , friendTo:recieverID})){
                FriendList.update({friendFrom: senderID , friendTo: recieverID} , {$set:{msgStatusFrom:0}});
            }else{
                FriendList.update({friendFrom: recieverID , friendTo: senderID} , {$set:{msgStatusTo:0}});
            }
        }
    })
};

Meteor.startup(async () => {
});




