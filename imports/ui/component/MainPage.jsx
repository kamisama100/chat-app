import React from "react";
import {Meteor} from "meteor/meteor";
import {useTracker} from 'meteor/react-meteor-data';
import {ContactList} from "./ContactList";
import { Messages } from "../../api/messages";
import { useNavigate } from "react-router-dom";
import '../styles/main-page.css'

export const MainPage = () =>{

    let usersData = [];
    let nav = useNavigate();

    if(!(Meteor.userId() || Meteor.loggingIn())){
        nav("/");
    }

    if(Meteor.subscribe('users')){
        Meteor.users.find().fetch().forEach(data=>{
            if(data._id != Meteor.userId()){
                usersData.push(data);
            }
        });
    }

    const msgs = useTracker(()=>{
        Meteor.subscribe('messages').ready();
        return Messages.find({userID:Meteor.userId()}).fetch();
    });


    return(
        <div className="message-section">
            <ContactList users = {usersData}/>
        </div>
    )
}

export default MainPage