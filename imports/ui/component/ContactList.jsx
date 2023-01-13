import React, { useRef, useState } from "react";
import "../styles/contact-list.css" 
import {AiOutlineSearch} from "react-icons/ai"
import {Meteor} from 'meteor/meteor';
import {MessageBox} from './MessageBox';
import { FriendList } from "../../api/friendList";
import {BsCheckCircleFill} from "react-icons/bs"
import {GoPrimitiveDot} from "react-icons/go";
import {CiLogout} from 'react-icons/ci';
import {useTracker} from 'meteor/react-meteor-data';
import { useNavigate } from "react-router-dom";

export const ContactList = ({users}) =>{

    const [userID , setUserID] = useState("");
    const [search, setSearch] = useState("");
    const ref = useRef('');

    const nav = useNavigate();

    const handleLogout = (e) =>{
        e.preventDefault();

        Meteor.logout();
        return nav("/");
    }    


    const trackedUser = useTracker(()=>{
        let nameWithId = [];
        let searchUser = [];

        users.forEach(user=>nameWithId.push({'usersFullName':user.profile.fullName, 'usersId':user._id}));
            for (let i of nameWithId.map(name=>{return name.usersFullName})) {
                let s = i.toLowerCase();

                if(!(s.indexOf(search) == -1)){
                    nameWithId.forEach(getId => 
                        getId.usersFullName == i ? searchUser.push({'usersFullName':i , 'userId':getId.usersId}) : <></>
                )
            }
        }
        return searchUser
    });

    const trackedCombinedFriendInfo = useTracker(()=>{
        let friendInfo = [];
        let combinedFriendInfo = [];

        if(Meteor.subscribe('friendList')){
            FriendList.find().fetch().forEach(friend=>{
                friendInfo.push(friend);
            });
        }
        friendInfo.forEach((friend)=>{
            Meteor.users.find({_id:friend.friendTo}).map(getName=>(
                combinedFriendInfo.push(
                    {
                        'friendFromName': Meteor.users.find({_id:friend.friendFrom}).map(friendFromName=>friendFromName.profile.fullName),
                        'friendToName': getName.profile.fullName , 
                        'friendFromId': friend.friendFrom , 
                        'friendToId': friend.friendTo, 
                        'confirmed': friend.confirmed,
                        'msgStatusFrom': friend.msgStatusFrom,
                        'msgStatusTo': friend.msgStatusTo,
                })
            ));
        });
        return combinedFriendInfo
    });

    const msgStatusHandler = (senderID, recieverID) =>{
        Meteor.call('msgStatusHandler', {senderID:senderID, recieverID:recieverID});
    }

    return(
        <div className="container">
            <div className="contacts">
                <div className="search-bar">
                    <input type="text" placeholder="Search a User" onChange={(e)=>setSearch(e.target.value)} />
                    <AiOutlineSearch className="search-icon" />
                </div>
                {
                    search != "" ? 
                    trackedUser.map((name,index)=>( 
                        <div 
                        className="message-list" 
                        key = {index} 
                        onClick = {()=>setUserID(name.userId)}
                        >
                            <div>
                                {name.usersFullName}
                            </div>
                        </div>
                    ))
                    :
                    trackedCombinedFriendInfo.map((user, index)=>(
                            user.friendFromId == Meteor.userId() ?
                                <div 
                                className="message-list" 
                                ref = {ref}
                                key = {index} 
                                onClick = {()=>{setUserID(user.friendToId); msgStatusHandler(user.friendToId , user.friendFromId); setPing(1)}}
                                >
                                    <span 
                                    style = {{fontSize:'17px', fontWeight: user.msgStatusTo ==1 ? 500 : 300 }}>
                                     
                                        {   
                                            user.friendToName
                                        }
                                    </span>
                                    {
                                        user.msgStatusTo == 1 ?
                                        <GoPrimitiveDot color="blue" size="16" /> 
                                        :
                                        <BsCheckCircleFill size="16" />  
                                    }
                                </div>
                            :
                            user.friendToId == Meteor.userId() ?
                                <div 
                                className="message-list" 
                                key = {index} 
                                onClick = {()=>{setUserID(user.friendFromId); msgStatusHandler(user.friendFromId , user.friendToId)}}
                                >
                                    <span 
                                    style = {{fontSize:'17px', fontWeight: user.msgStatusFrom ==1 ? 500 : 300 }}>
                                        {   
                                            user.friendFromName
                                        }
                                    </span>
                                    {
                                        user.msgStatusFrom == 1 ?
                                        <GoPrimitiveDot color="blue" size="16" /> 
                                        :
                                        <BsCheckCircleFill size="16" />  
                                    }
                                </div>
                                :
                                <div className="message-list" style = {{display:'none'}} key = {index}>
                                    No Contacts
                                </div>
                    ))
                }
                <CiLogout 
                className="logout-button" 
                title = "Logout" 
                size="30px" 
                onClick={(e)=>handleLogout(e)}
                />
            </div>
            <div>
                <MessageBox userID = {userID}/>
            </div>
        </div>
    )
}