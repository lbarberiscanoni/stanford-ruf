"use strict";

var db = new Firebase("https://grace-prez.firebaseio.com/ruf/");

var Header = React.createClass({
    displayName: "Header",


    goHome: function goHome() {
        this.props.changeScreen("home");
    },

    render: function render() {
        return React.createElement(
            "header",
            { className: "bar bar-nav navBar" },
            React.createElement(
                "h1",
                { className: "title" },
                " Stanford RUF"
            ),
            React.createElement(
                "button",
                { className: "btn pull-right", onClick: this.goHome.bind(this) },
                "HOME"
            )
        );
    }
});

var Logo = React.createClass({
    displayName: "Logo",

    render: function render() {
        return React.createElement("img", { className: "logo", src: "ruf_logo_color.png" });
    }
});

var SocialMediaLinks = React.createClass({
    displayName: "SocialMediaLinks",


    render: function render() {
        return React.createElement(
            "div",
            { className: "socialMediaLinks" },
            React.createElement(
                "h3",
                { className: "text-center" },
                "Follow Us"
            ),
            React.createElement(
                "div",
                { className: "icon-container" },
                React.createElement("a", { className: "clickable ion-social-facebook", href: "https://www.facebook.com/rufstanford/" }),
                React.createElement("a", { className: "clickable ion-social-instagram", href: "https://www.instagram.com/ruf_stanford/" }),
                React.createElement("a", { className: "clickable ion-social-twitter", href: "https://twitter.com/RufStanford" })
            )
        );
    }
});

var NavBar = React.createClass({
    displayName: "NavBar",


    changeState: function changeState(menu_option) {
        this.props.changeScreen(menu_option);
    },

    render: function render() {
        var navList = ["Events", "Office Hours", "Podcasts", "About"];
        var menu_options = ["events", "office_hours", "podcasts", "about"];

        var bar = [];
        for (var i = 0; i < navList.length; i++) {
            var sizeOfBars = Math.round(12 / navList.length);
            var sizeOfSides = (12 - navList.length * sizeOfBars) / 2;
            bar.push(React.createElement(
                "a",
                { className: "tab-item clickable", onClick: this.changeState.bind(this, menu_options[i]) },
                navList[i]
            ));
        };

        return React.createElement(
            "nav",
            { className: "bar bar-tab bar-footer" },
            bar
        );
    }
});

var AnnouncementList = React.createClass({
    displayName: "AnnouncementList",


    getInitialState: function getInitialState() {
        return {
            announcements: []
        };
    },

    componentDidMount: function componentDidMount() {
        getStuffFromFirebase("announcements", "announcements", this);
    },

    ex: function ex() {
        alert("bro");
    },

    render: function render() {
        var announcementListElements = [];
        for (var a in this.state.announcements) {
            var thisAnnouncement = this.state.announcements[a];
            var today = new Date();
            var thisAnnouncementDate = new Date(thisAnnouncement.date);
            var thisAnnouncementDate_formatted = new Date(thisAnnouncementDate.getTime() + 4 * 24 * 60 * 60 * 1000);
            console.log(today);
            console.log(thisAnnouncementDate_formatted);
            console.log(today.getTime() <= thisAnnouncementDate_formatted.getTime());
            console.log("----------------------");

            //if (new Date(today) <= new Date(thisAnnouncementDate_formatted)) {
            announcementListElements.push(React.createElement(
                "li",
                { className: "table-view-cell media", onClick: this.ex.bind(this) },
                React.createElement(
                    "a",
                    { className: "navigate-right" },
                    React.createElement("img", { className: "media-object pull-left", src: "http://placehold.it/42x42" }),
                    React.createElement(
                        "div",
                        { className: "media-body" },
                        thisAnnouncement.name,
                        React.createElement("br", null),
                        React.createElement(
                            "span",
                            null,
                            "[",
                            thisAnnouncement.date.split("00")[0],
                            "]"
                        ),
                        React.createElement(
                            "p",
                            null,
                            " ",
                            thisAnnouncement.description,
                            " "
                        )
                    )
                )
            ));
            //    console.log(thisAnnouncement.name + " is past today's date");
        }

        return React.createElement(
            "ul",
            { className: "table-view" },
            announcementListElements
        );
    }
});

var Podcasts = React.createClass({
    displayName: "Podcasts",


    getInitialState: function getInitialState() {
        return {
            podcasts: []
        };
    },

    componentDidMount: function componentDidMount() {
        getStuffFromFirebase("podcasts", "podcasts", this);
    },

    render: function render() {
        var elements = [];
        for (var a in this.state.podcasts) {
            var thisPodcast = this.state.podcasts[a];
            console.log(thisPodcast);
            elements.push(React.createElement(
                "div",
                { className: "podcast" },
                React.createElement(
                    "h3",
                    { className: "text-center" },
                    " ",
                    thisPodcast.name,
                    " "
                ),
                React.createElement(
                    "span",
                    null,
                    " ",
                    thisPodcast.date.split("00")[0],
                    " "
                ),
                React.createElement("br", null),
                React.createElement(
                    "audio",
                    { controls: true },
                    React.createElement("source", { src: thisPodcast.link })
                ),
                React.createElement(
                    "p",
                    null,
                    " ",
                    thisPodcast.description,
                    " "
                )
            ));
        }

        return React.createElement(
            "div",
            null,
            elements
        );
    }
});

var Crew = React.createClass({
    displayName: "Crew",


    getInitialState: function getInitialState() {
        return {
            members: []
        };
    },

    componentDidMount: function componentDidMount() {
        getStuffFromFirebase("crew", "members", this);
    },

    render: function render() {
        var elements = [];
        for (var a in this.state.members) {
            var thisPerson = this.state.members[a];
            var emailLink = "mailto:" + thisPerson.email;
            var phoneNum = "tel:" + thisPerson.phone;
            console.log(thisPerson);
            elements.push(React.createElement(
                "li",
                { className: "table-view-cell media" },
                React.createElement(
                    "a",
                    null,
                    React.createElement("img", { className: "media-object pull-left", src: thisPerson.image }),
                    React.createElement(
                        "div",
                        { className: "media-body" },
                        thisPerson.name,
                        React.createElement("br", null),
                        React.createElement(
                            "span",
                            null,
                            "[",
                            thisPerson.position,
                            "]"
                        ),
                        React.createElement(
                            "p",
                            null,
                            " ",
                            thisPerson.description,
                            " "
                        ),
                        React.createElement(
                            "h5",
                            null,
                            React.createElement(
                                "a",
                                { href: phoneNum },
                                React.createElement("li", { className: "icon ion-iphone", "data-pack": "default", "data-tags": "smartphone, mobile, apple, retina, device" })
                            ),
                            React.createElement(
                                "a",
                                { href: emailLink },
                                React.createElement("li", { className: "icon ion-email", "data-pack": "default", "data-tags": "snail, mail, inbox" })
                            )
                        )
                    )
                )
            ));
        }

        return React.createElement(
            "ul",
            { className: "table-view" },
            elements
        );
    }
});

var Events = React.createClass({
    displayName: "Events",


    getInitialState: function getInitialState() {
        return {
            events: [],
            userID: getDevID()
        };
    },

    componentDidMount: function componentDidMount() {
        getStuffFromFirebase("events", "events", this);
    },

    attendanceChange: function attendanceChange(person, event) {
        //console.log(person);
        //console.log(event);
        $.ajax({
            async: false,
            url: "https://grace-prez.firebaseio.com/ruf/events/" + event + "/attendees/.json",
            dataType: "json",
            cache: false,
            success: function success(data) {
                var keyList = Object.keys(data);
                var status = 0;
                for (var i = 0; i <= keyList.length - 1; i++) {
                    //console.log(data[keyList[i]].userID);
                    console.log(i);
                    if (data[keyList[i]].userID == person) {
                        console.log("removing");
                        db.child("events").child(event).child("attendees").child(keyList[i]).remove();
                        status += 1;
                    };

                    if (i == keyList.length - 1) {
                        if (status == 0) {
                            db.child("events").child(event).child("attendees").push({
                                userID: person
                            });
                        };
                    };
                };
            }
        });
    },

    checkAttendes: function checkAttendes(group, person) {
        var attendeeList = [];
        for (var i in group) {
            attendeeList.push(group[i].userID);
        }
        //console.log(attendeeList);
        //console.log(person);
        status = "";
        if (attendeeList.indexOf(person) < 0) {
            status = "inactive";
        } else {
            status = "active";
        }

        return status;
    },

    render: function render() {
        var elements = [];
        for (var a in this.state.events) {
            var thisEvent = this.state.events[a];
            //console.log(thisEvent);
            //console.log(this.checkAttendes(thisEvent.attendees));

            var activityStatus = this.checkAttendes(thisEvent.attendees, this.state.userID);
            var toggleClassNames = "clickable toggle " + activityStatus;

            var today = new Date();
            var eventDate_formatted = new Date(thisEvent.date);
            var eventDate_formatted_forward = new Date(eventDate_formatted.getTime() + 4 * 24 * 60 * 60 * 1000);
            console.log(today);
            console.log(eventDate_formatted_forward);
            console.log(today.getTime() <= eventDate_formatted_forward.getTime());
            console.log("----------------");

            if (new Date(today) <= new Date(eventDate_formatted_forward)) {
                elements.push(React.createElement(
                    "li",
                    { className: "table-view-cell" },
                    React.createElement(
                        "a",
                        { className: "navigate-right" },
                        React.createElement("img", { className: "media-object pull-left", src: thisEvent.image }),
                        React.createElement(
                            "div",
                            { className: "media-body" },
                            thisEvent.name,
                            React.createElement("br", null),
                            React.createElement(
                                "span",
                                null,
                                "[",
                                thisEvent.date,
                                "]"
                            ),
                            React.createElement(
                                "span",
                                null,
                                "[",
                                thisEvent.start,
                                "] -- [",
                                thisEvent.end,
                                "]"
                            ),
                            React.createElement(
                                "p",
                                null,
                                " ",
                                thisEvent.description,
                                " "
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: toggleClassNames, onClick: this.attendanceChange.bind(this, this.state.userID, thisEvent.fireID) },
                        React.createElement("div", { className: "toggle-handle" })
                    )
                ));
            } else {
                console.log(thisEvent.name + " is past today's date");
            }
        }

        return React.createElement(
            "ul",
            { className: "table-view" },
            elements
        );
    }
});

var AppointmentForm = React.createClass({
    displayName: "AppointmentForm",


    getInitialState: function getInitialState() {
        return {
            userID: getDevID()
        };
    },

    addAppointment: function addAppointment() {
        var date = $("#date").val();
        var start = $("#start").val();
        var end = $("#end").val();
        var description = $("#description").val();
        var userName = this.props.userName;
        var person = $("#person").val();

        var appointment = db.child("officeHours").push({
            description: description,
            start: date + "T" + start,
            end: date + "T" + end,
            status: "pending",
            title: userName,
            person: person
        });

        var newID = appointment.key();
        appointment.update({
            fireID: newID
        });

        alert("you just signed up for a 1 on 1 session with " + person + ". You'll receive a confirmation from them!");
        window.location.reload();
    },

    render: function render() {
        return React.createElement(
            "div",
            { className: "office_hours" },
            React.createElement(
                "h4",
                null,
                "Time"
            ),
            React.createElement(
                "form",
                { className: "input-group" },
                React.createElement(
                    "div",
                    { className: "input-row" },
                    React.createElement(
                        "label",
                        null,
                        "Date"
                    ),
                    React.createElement("input", { type: "date", id: "date" })
                ),
                React.createElement(
                    "div",
                    { className: "input-row" },
                    React.createElement(
                        "label",
                        null,
                        "Start"
                    ),
                    React.createElement("input", { type: "time", id: "start" })
                ),
                React.createElement(
                    "div",
                    { className: "input-row" },
                    React.createElement(
                        "label",
                        null,
                        "End"
                    ),
                    React.createElement("input", { type: "time", id: "end" })
                )
            ),
            React.createElement(
                "form",
                null,
                React.createElement(
                    "h4",
                    null,
                    "Person"
                ),
                React.createElement(
                    "select",
                    { id: "person" },
                    React.createElement(
                        "option",
                        null,
                        "Select a Person"
                    ),
                    React.createElement(
                        "option",
                        null,
                        "Britton"
                    ),
                    React.createElement(
                        "option",
                        null,
                        "Jess"
                    ),
                    React.createElement(
                        "option",
                        null,
                        "Eric"
                    )
                ),
                React.createElement(
                    "h4",
                    null,
                    "Talk Description"
                ),
                React.createElement("textarea", { rows: "5", placeholder: "Briefly describe what you'd like to talk about", id: "description" }),
                React.createElement(
                    "span",
                    { className: "clickable btn btn-positive btn-block", onClick: this.addAppointment.bind(this) },
                    "Sign Up"
                )
            )
        );
    }
});