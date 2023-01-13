import React from "react";
import {Meteor} from "meteor/meteor";
import "./icon-styles.css"
import {MdDone} from "react-icons/md"


export const AcceptFriendRequest = ({friendId}) =>{

    const AcceptFriend = (e) =>{
        e.preventDefault();

        Meteor.call('friend.acceptRequest' , {friendFrom:friendId});
    }
    return(
        <>
            <MdDone 
            onClick={(e)=>AcceptFriend(e)}
            className="icon-style"
            size="24"
            title = "Accept Friend Request"
            />
        </>
    )
}