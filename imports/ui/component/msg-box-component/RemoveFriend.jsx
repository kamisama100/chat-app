import React from "react";
import {Meteor} from "meteor/meteor";
import {CgUserRemove} from "react-icons/cg";
import './icon-styles.css'

export const RemoveFriend = ({friendId}) =>{
    
    const removeFriend = (e) =>{
        e.preventDefault();
        window.confirm('Remove Friend?') ? 
        Meteor.call('friend.removeFriend' , {friendFrom:friendId})
        :
        <></>
    }
    return (
        <>
            <CgUserRemove 
            size="24" 
            onClick={(e)=>removeFriend(e)}
            className="icon-style"
            title="Remove Friend"
            />
        </>
    )
}