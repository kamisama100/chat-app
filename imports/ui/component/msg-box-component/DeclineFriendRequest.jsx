import React from "react";
import {Meteor} from "meteor/meteor";
import './icon-styles.css';
import {MdOutlineClear} from "react-icons/md";

export const DeclineFriendRequest = ({friendId}) =>{

    const DeclineFriendRequest = (e) =>{
        e.preventDefault();
        
        Meteor.call('friend.declineRequest',{friendFrom: friendId});
    }
    return (
        <>
            <MdOutlineClear 
            onClick={(e)=>DeclineFriendRequest(e)} 
            className="icon-style" 
            title="Decline Friend Request"
            size="24"
            />
        </>
    )
}