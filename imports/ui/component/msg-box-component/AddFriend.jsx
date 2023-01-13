import React from "react";
import {Meteor} from "meteor/meteor";
import {CgUserAdd} from "react-icons/cg";

export const AddFriend = ({friendId}) =>{

    const addFriendHandler = (e) =>{
        e.preventDefault();

        Meteor.call('friend.insert',{friendFrom:Meteor.userId(), friendTo: friendId, status:'pending'});
    }
    return(
        <>
            <CgUserAdd size="24" 
            onClick={(e)=>addFriendHandler(e)} 
            title="Add Friend" 
            className="icon-style"
            />
        </>
    )
}
