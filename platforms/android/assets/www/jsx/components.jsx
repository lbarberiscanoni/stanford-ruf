let db = new Firebase("https://grace-prez.firebaseio.com/ruf/");

let Header = React.createClass({

    goHome: function() {
        this.props.changeScreen("home");
    },
  
    render: function() {
        return(
            <header className="bar bar-nav navBar">
                <h1 className="title"> Stanford RUF</h1>
                <button className="btn pull-right" onClick={ this.goHome.bind(this) }>HOME</button>
            </header>
        );
    },
});

let Logo = React.createClass({
    render: function() {
        return(
            <img className="logo" src="ruf_logo_color.png"></img>
        )
    }
});

let SocialMediaLinks = React.createClass({

    render: function() {
        return(
            <div className="socialMediaLinks">
                <h3 className="text-center">Follow Us</h3>
                <div className="icon-container">
                    <a className="clickable ion-social-facebook" href="https://www.facebook.com/rufstanford/">
                    </a>
                    <a className="clickable ion-social-instagram" href="https://www.instagram.com/ruf_stanford/">
                    </a>
                    <a className="clickable ion-social-twitter" href="https://twitter.com/RufStanford">
                    </a>
                </div>
            </div>
        );
    },
});

let NavBar = React.createClass({

    changeState: function(menu_option) {
        this.props.changeScreen(menu_option);
    },

    render: function() {
        let navList = ["Events", "Office Hours", "Podcasts", "About"];
        let menu_options = ["events", "office_hours", "podcasts", "about"];

        let bar = []
        for (let i = 0; i < navList.length; i++) {
            let sizeOfBars = Math.round(12 / navList.length)
            let sizeOfSides = (12 - (navList.length * sizeOfBars)) / 2; 
            bar.push(
                    <a className="tab-item clickable" onClick={ this.changeState.bind(this, menu_options[i]) }> 
                        { navList[i] }
                    </a>
            )
        };

        return(
            <nav className="bar bar-tab bar-footer">
                { bar }
            </nav>
        );
    },
});

let AnnouncementList = React.createClass({

    getInitialState: function() {
        return {
            announcements: []
        }
    },

    componentDidMount: function() {
        getStuffFromFirebase("announcements", "announcements", this )
    },

    ex: function() {
        alert("bro");
    },

    render: function() {
        let announcementListElements = [];
        for (let a in this.state.announcements) {
            let thisAnnouncement = this.state.announcements[a];
            let today = new Date();
            let thisAnnouncementDate = new Date(thisAnnouncement.date)
            let thisAnnouncementDate_formatted = new Date(thisAnnouncementDate.getTime() + 4*24*60*60*1000)
            console.log(today);
            console.log(thisAnnouncementDate_formatted);
            console.log(today.getTime() <= thisAnnouncementDate_formatted.getTime());
            console.log("----------------------");

            //if (new Date(today) <= new Date(thisAnnouncementDate_formatted)) {
            announcementListElements.push(
                <li className="table-view-cell media" onClick={ this.ex.bind(this) }>
                    <a className="navigate-right">
                        <img className="media-object pull-left" src="http://placehold.it/42x42"></img>
                        <div className="media-body">
                            { thisAnnouncement.name }
                            <br></br>
                            <span>[{ thisAnnouncement.date.split("00")[0] }]</span> 
                            <p> { thisAnnouncement.description } </p> 
                        </div>
                    </a>
                </li>
            );
            //    console.log(thisAnnouncement.name + " is past today's date");
        }

        return (
            <ul className="table-view">
                { announcementListElements }
            </ul>
        );
    },
});

let Podcasts = React.createClass({

    getInitialState: function() {
        return {
            podcasts: []
        }
    },
    
    componentDidMount: function() {
        getStuffFromFirebase("podcasts", "podcasts", this)
    },

    render: function() {
        let elements = [];
        for (let a in this.state.podcasts) {
            let thisPodcast = this.state.podcasts[a];
            console.log(thisPodcast);
            elements.push(
                <div className="podcast">
                    <h3 className="text-center"> { thisPodcast.name } </h3> 
                    <span> { thisPodcast.date.split("00")[0] } </span>
                    <br></br>
                    <audio controls>
                        <source src= { thisPodcast.link }></source>
                    </audio>
                    <p> { thisPodcast.description } </p> 
                </div>
            );
        }

        return (
            <div>
                { elements }
            </div>
        );

    },
});

let Crew = React.createClass({

    getInitialState: function() {
        return {
            members: []
        }
    },

    componentDidMount: function() {
        getStuffFromFirebase("crew", "members", this)
    },

    render: function() {
        let elements = [];
        for (let a in this.state.members) {
            let thisPerson = this.state.members[a];
            let emailLink = "mailto:" + thisPerson.email
            let phoneNum = "tel:" + thisPerson.phone
            console.log(thisPerson);
            elements.push(
                <li className="table-view-cell media">
                    <a>
                        <img className="media-object pull-left" src={ thisPerson.image }></img>
                        <div className="media-body">
                            { thisPerson.name }
                            <br></br>
                            <span>[{ thisPerson.position }]</span> 
                            <p> { thisPerson.description } </p> 
                            <h5>
                                <a href={ phoneNum }>
                                    <li className="icon ion-iphone" data-pack="default" data-tags="smartphone, mobile, apple, retina, device"></li>
                                </a>
                                <a href={ emailLink }>
                                    <li className="icon ion-email" data-pack="default" data-tags="snail, mail, inbox"></li>
                                </a>
                            </h5>
                        </div>
                    </a>
                </li>
            );
        }

        return (
            <ul className="table-view">
                { elements }
            </ul>
        );
    },
});

let Events = React.createClass({

    getInitialState: function() {
        return {
            events: [],
            userID: getDevID(),
        }
    },

    componentDidMount: function() {
        getStuffFromFirebase("events", "events", this);
    },

    attendanceChange: function(person, event) {
        //console.log(person);
        //console.log(event);
        $.ajax({
            async: false,
            url: "https://grace-prez.firebaseio.com/ruf/events/" + event + "/attendees/.json",
            dataType: "json",
            cache: false,
            success: function(data) {
                let keyList = Object.keys(data)
                let status = 0;
                for (let i = 0; i <= keyList.length - 1; i++) {
                    //console.log(data[keyList[i]].userID);
                    console.log(i);
                    if (data[keyList[i]].userID == person) {
                        console.log("removing");
                        db.child("events").child(event).child("attendees").child(keyList[i]).remove();
                        status += 1
                    };

                    if (i == keyList.length - 1) {
                        if (status == 0) {
                            db.child("events").child(event).child("attendees").push({
                                userID: person,
                            });
                        };
                    };
                };
            }
        });
    },

    checkAttendes: function(group, person) {
        let attendeeList = []
        for (let i in group) {
            attendeeList.push(group[i].userID);
        }
        //console.log(attendeeList);
        //console.log(person);
        status = ""
        if (attendeeList.indexOf(person) < 0) {
            status = "inactive"
        } else {
            status = "active"
        }

        return status
    },

    render: function() {
        let elements = [];
        for (let a in this.state.events) {
            let thisEvent = this.state.events[a];
            //console.log(thisEvent);
            //console.log(this.checkAttendes(thisEvent.attendees));

            let activityStatus = this.checkAttendes(thisEvent.attendees, this.state.userID)
            let toggleClassNames = "clickable toggle " + activityStatus

            let today = new Date();
            let eventDate_formatted = new Date(thisEvent.date);
            let eventDate_formatted_forward = new Date(eventDate_formatted.getTime() + 4*24*60*60*1000)
            console.log(today);
            console.log(eventDate_formatted_forward);
            console.log(today.getTime() <= eventDate_formatted_forward.getTime())
            console.log("----------------");

            if (new Date(today) <= new Date(eventDate_formatted_forward)) {
                elements.push(
                    <li className="table-view-cell">
                        <a className="navigate-right">
                            <img className="media-object pull-left" src={ thisEvent.image }></img>
                            <div className="media-body">
                                { thisEvent.name }
                                <br></br>
                                <span>[{ thisEvent.date }]</span> 
                                <span>[{ thisEvent.start }] -- [{ thisEvent.end }]</span>
                                <p> { thisEvent.description } </p> 
                            </div>
                        </a>
                        <div className={ toggleClassNames } onClick={ this.attendanceChange.bind(this, this.state.userID, thisEvent.fireID) }>
                            <div className="toggle-handle"></div>
                        </div>
                    </li>
                ) 
            } else {
                console.log(thisEvent.name + " is past today's date");
            }
        }

        return (
            <ul className="table-view">
                { elements }
            </ul>
        );
    },
});

let AppointmentForm = React.createClass({

    getInitialState: function() {
        return {
            userID: getDevID(),
        }
    },

    addAppointment: function() {
        let date = $("#date").val();
        let start = $("#start").val();
        let end = $("#end").val();
        let description = $("#description").val();
        let userName = this.props.userName;
        let person = $("#person").val();

        let appointment = db.child("officeHours").push({
            description: description,
            start: date + "T" + start,
            end: date + "T" + end,
            status: "pending",
            title: userName,
            person: person,
        });

        let newID = appointment.key();
        appointment.update({
            fireID: newID,
        });

        alert("you just signed up for a 1 on 1 session with " + person + ". You'll receive a confirmation from them!");
        window.location.reload();
    },

    render: function() {
        return(
            <div className="office_hours">
                <h4>Time</h4>
                <form className="input-group">
                    <div className="input-row">
                        <label>Date</label>
                        <input type="date" id="date"></input>
                    </div>
                    <div className="input-row">
                        <label>Start</label>
                        <input type="time" id="start"></input>
                    </div>
                    <div className="input-row">
                        <label>End</label>
                        <input type="time" id="end"></input>
                    </div>
                </form>
                <form>
                    <h4>Person</h4>
                    <select id="person">
                        <option>Select a Person</option>
                        <option>Britton</option>
                        <option>Jess</option>
                        <option>Eric</option>
                    </select>
                    <h4>Talk Description</h4>
                    <textarea rows="5" placeholder="Briefly describe what you'd like to talk about" id="description"></textarea>
                    <span className="clickable btn btn-positive btn-block" onClick={ this.addAppointment.bind(this) }>Sign Up</span>
                </form>
            </div>
        );
    }
});
