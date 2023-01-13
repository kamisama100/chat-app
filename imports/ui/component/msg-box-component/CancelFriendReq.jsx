import React from "react";
import {Meteor} from "meteor/meteor";
import {MdOutlineCancel} from "react-icons/md";
import './icon-styles.css';

export const CancelFriendReq = ({friendId}) =>{
    
    const cancelFriendRequest = (e) =>{
        e.preventDefault();
        Meteor.call('friend.cancelRequest',{friendTo: friendId});
    }
    return(
        <>
            <MdOutlineCancel 
            onClick={(e)=>cancelFriendRequest(e)}
            size="24"
            className="icon-style"
            title="Cancel Friend Request"
            />
        </>
    )
}