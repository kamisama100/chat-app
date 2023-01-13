import React, { useRef, useState } from "react";
import "../styles/message-box.css"
import {RiSendPlane2Line} from 'react-icons/ri'
import { Messages } from "../../api/messages";
import {Meteor} from "meteor/meteor"
import {useTracker} from 'meteor/react-meteor-data';
import { FriendList } from "../../api/friendList";
import { AddFriend } from "./msg-box-component/AddFriend";
import { CancelFriendReq } from "./msg-box-component/CancelFriendReq";
import { DeclineFriendRequest } from "./msg-box-component/DeclineFriendRequest";
import { AcceptFriendRequest } from "./msg-box-component/AcceptFriendRequest";
import { RemoveFriend } from "./msg-box-component/RemoveFriend";

export const MessageBox = ({userID}) =>{

    const [message , setMsg] = useState("");
    const typeRef = useRef("");
    const msgRef = useRef("");


    if (msgRef.current.scrollHeight - msgRef.current.scrollTop < 1500) {
        msgRef.current.scrollTo(0, msgRef.current.scrollHeight);
    }

    const handleMessage = (e) =>{
        e.preventDefault();

        if(Meteor.userId()){
            Meteor.call('message.insert', {senderID:Meteor.userId(), message:message, recieverID:userID , date:Date.now()});
        }
        typeRef.current.value = "";
    }

    Meteor.subscribe("messages");
    const sentMsg = useTracker(()=>{
        return Messages.find({senderID:Meteor.userId(), recieverID:userID}).fetch();
    });


    const rcvMsg = useTracker(()=>{
        return Messages.find({recieverID:Meteor.userId(), senderID:userID}).fetch();
    });

    let arrMsg = [];
    sentMsg.forEach((msgs)=>(
        arrMsg.push(msgs)
    ));
    rcvMsg.forEach((msgs)=>(
        arrMsg.push(msgs)
    ));
    let sortedMsg = arrMsg.sort((date1, date2) => (date1.date< date2.date) ? -1 : (date1.date > date2.date) ? 1 : 0);

    const friendName = useTracker(()=>{
        return Meteor.users.find({_id:userID}).fetch().map(name=>name.profile.fullName);
    });

    const statusFriendFrom = () =>{
        let st;
        st = (FriendList.find({friendFrom:Meteor.userId(), friendTo:userID}).fetch());
        return st; 
    };
    const statusFriendTo = () =>{
        let st;
        st = (FriendList.find({friendFrom: userID , friendTo: Meteor.userId()}).fetch());
        return st;
    };

    return (
        <div>
            <div className="message-header">
                <span>
                    <h2 style={{fontSize:'21px'}}>
                        {friendName}
                    </h2>
                </span>
                <span>
                        {
                            friendName != "" ?
                                statusFriendFrom().map(status => {return status.status}).toString() == 'pending'?
                                    <CancelFriendReq friendId = {userID}/> 
                                    : 
                                    statusFriendTo().map(status => {return status.status}).toString() == 'pending'?
                                        <span>
                                            <AcceptFriendRequest  friendId = {userID} />
                                            <DeclineFriendRequest friendId = {userID}/>
                                        </span> 
                                        :
                                            statusFriendTo().map(status => {return status.status}).toString() == 'confirmed'?
                                                <RemoveFriend friendId = {userID} />
                                                :
                                                statusFriendFrom().map(status => {return status.status}).toString() == 'confirmed'?
                                                    <RemoveFriend friendId = {userID} />
                                                    :
                                                    <AddFriend friendId={userID} />
                                :
                                <></>
                        }
                </span>
            </div>
            <div className="message-body" ref = {msgRef}>
                {
                    sortedMsg.map((msg, i)=>(
                        msg.senderID == Meteor.userId() ?
                        <div key = {i} style = {{textAlign:"end"}}>
                            <h4>
                                <p className="my-msg" style={{float:"right"}}>
                                    {msg.message}
                                </p>
                            </h4>
                        </div>
                        :
                        <div key = {i}>
                            <h4>
                                <p className="friend-msg">
                                    {msg.message}
                                </p>
                            </h4>
                        </div>
                    )).reverse()
                }
            </div>
            <div>
            {
                userID != '' ? 
                <form className="type-field" onSubmit={(e)=>handleMessage(e)} >
                    <input ref = {typeRef} className="type-box" type="text" placeholder="Type a message" onChange={(e)=>setMsg(e.target.value)} />
                    <button className="send-btn" type="submit"><RiSendPlane2Line size="30" /></button>
                </form>
                :
                <></>
            }
            </div>
        </div>
    )
}
