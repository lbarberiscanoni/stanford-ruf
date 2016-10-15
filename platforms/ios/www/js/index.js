"use strict";

var db = new Firebase("https://grace-prez.firebaseio.com/ruf/");

var getStuffFromFirebase = function getStuffFromFirebase(db_selected, state_name, component) {
    db.child(db_selected).on("value", function (snapshot) {
        var data = snapshot.val();
        //console.log(data);
        var o_k = Object.keys(data);
        var items = [];
        for (var i = o_k.length - 1; i >= 0; i--) {
            items.push(data[o_k[i]]);
        }
        window.wtf = items;
        var tmp_state = {};
        tmp_state[state_name] = items;
        this.setState(tmp_state);
    }.bind(component));
};

var getDevID = function getDevID() {
    var devID = device.uuid;
    if (devID != null) {
        return device.uuid;
    } else {
        return "browser";
    };
};

var getFromFirebase = function getFromFirebase(db_selected) {
    var results = [];
    $.ajax({
        async: false,
        url: "https://grace-prez.firebaseio.com/ruf/" + db_selected + "/.json",
        dataType: 'json',
        cache: false,
        success: function success(data) {
            console.log("success");
            var listOfResults = [];
            var listOfFirebaseIDs = Object.keys(data);
            for (var i = 0; i < listOfFirebaseIDs.length; i++) {
                listOfResults.push(data[listOfFirebaseIDs[i]]);
            };
            results = listOfResults;
        },
        error: function error(xhr, status, err) {
            console.warn(xhr.responseText);
            console.error("https://grace-prez.firebaseio.com/ruf/" + db_selected + "/.json", status, err.toString());
            alert("error");
        }
    });
    console.log("scope");
    console.log(results);
    return results;
};

var getUserName = function getUserName(user) {
    var userName = "";
    console.log(user);
    $.ajax({
        async: false,
        url: "https://grace-prez.firebaseio.com/ruf/users/.json",
        dataType: "json",
        cache: false,
        success: function success(data) {
            console.log(data);
            var listOfKeys = Object.keys(data);
            for (var i = 0; i < listOfKeys.length; i++) {
                if (user == data[listOfKeys[i]].devID) {
                    userName = data[listOfKeys[i]].name;
                    break;
                }
            };
        }
    });
    return userName;
};

var App = React.createClass({
    displayName: "App",


    getInitialState: function getInitialState() {
        return {
            screen: "home",
            logStatus: "out",
            users: getFromFirebase("users"),
            userID: getDevID()
        };
    },

    changeUser: function changeUser(a) {
        this.setState({ userID: a });
    },

    checkUser: function checkUser(listOfUsers, specUser) {
        for (var x = 0; x < listOfUsers.length; x++) {
            var user = listOfUsers[x];
            if (specUser == user.devID) {
                this.setState({ logStatus: user.logStatus });
                break;
            };
        };
    },

    componentDidMount: function componentDidMount() {
        //check if the user already exists or s/he needs to create an account
        this.checkUser(this.state.users, this.state.userID);
        this.setState({ userName: getUserName(this.state.userID) });
    },

    logUser: function logUser() {
        var userName = document.getElementById("userName").value;
        var userPassword = document.getElementById("userPassword").value;
        console.log(userName);
        console.log(userPassword);

        var component = this;
        var listOfUsers = this.state.users;
        for (var x = 0; x < listOfUsers.length; x++) {
            var user = listOfUsers[x];
            if (userName == user.name) {
                if (userPassword == user.password) {

                    db.child("users").child(user.fireID).update({
                        logStatus: "in"
                    });
                    this.setState({ logStatus: "in" });
                    // x = listOfUsers.length
                    break;
                };
            };
        };
    },

    addUser: function addUser() {
        var userName = document.getElementById("userName").value;
        var userPassword = document.getElementById("userPassword").value;
        var userEmail = document.getElementById("userEmail").value;
        var userPhoneNumber = document.getElementById("userPhoneNumber").value;
        var userClassYear = document.getElementById("userClassYear").value;
        var userID = this.state.userID;
        var carrier = document.getElementById("carrier").value;
        var carrierOb = { "at&t": "@txt.att.net", "t-mobile": "@tmomail.net", "verizon": "@vtext.com", "sprint": "@messaging.sprintpcs.com", "boost": "@myboostmobile.com", "virgin": "@vmobl.com", "us": "@email.uscc.net" };

        var puto = db.child("users").push({
            devID: userID,
            name: userName,
            password: userPassword,
            email: userEmail,
            phone: userPhoneNumber,
            class: userClassYear,
            logStatus: "in",
            carrierExt: carrierOb[carrier]
        });

        var putoID = puto.key();

        db.child("users").child(putoID).update({
            fireID: putoID
        });

        this.setState({ logStatus: "in" });
        this.setState({ screen: "home" });
    },

    changeScreen: function changeScreen(option_menu) {
        this.setState({ screen: option_menu });
    },

    render: function render() {
        var siteLocation = this.state.screen;
        if (this.state.logStatus == "in") {
            switch (siteLocation) {
                case "home":
                    return React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(Header, { changeScreen: this.changeScreen }),
                        React.createElement(
                            "div",
                            { className: "content-padded content" },
                            React.createElement(
                                "h1",
                                { className: "text-center" },
                                "Love God. Love People. Love Stanford."
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Announcements"
                            ),
                            React.createElement(AnnouncementList, null),
                            React.createElement(SocialMediaLinks, null)
                        ),
                        React.createElement(NavBar, { changeScreen: this.changeScreen })
                    );
                    break;
                case "events":
                    return React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(Header, { changeScreen: this.changeScreen }),
                        React.createElement(
                            "div",
                            { className: "content-padded content" },
                            React.createElement(
                                "h1",
                                { className: "text-center" },
                                "Events"
                            ),
                            React.createElement(Events, null),
                            React.createElement(SocialMediaLinks, null)
                        ),
                        React.createElement(NavBar, { changeScreen: this.changeScreen })
                    );
                    break;
                case "podcasts":
                    return React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(Header, { changeScreen: this.changeScreen }),
                        React.createElement(
                            "div",
                            { className: "content-padded content" },
                            React.createElement(
                                "h1",
                                { className: "text-center" },
                                "Podcasts"
                            ),
                            React.createElement(Podcasts, null),
                            React.createElement(SocialMediaLinks, null)
                        ),
                        React.createElement(NavBar, { changeScreen: this.changeScreen })
                    );
                    break;
                case "about":
                    return React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(Header, { changeScreen: this.changeScreen }),
                        React.createElement(
                            "div",
                            { className: "content-padded content" },
                            React.createElement(
                                "h1",
                                { className: "text-center" },
                                "About Us"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Our ministry is set up in such a way that students are given opportunities to wrestle with the truth (through the Bible--Gods word), and to see that the gospel speaks to every need and every area of life. Through exposure to truth, we hope that many will come to know the One who is truth, Jesus Christ. Also, we believe that Christianity is not just a moral system. It does contain a moral system, but that is not the heart of what it means to be a Christian. Rather than simply becoming a better person, the gospel makes you a new person. It brings new life for those who are dead in sin, and brings hope for the hopeless. We believe that those who come to see that Jesus is the truth will also see that He is life."
                            ),
                            React.createElement(
                                "h1",
                                null,
                                "Meet the Crew"
                            ),
                            React.createElement(Crew, null),
                            React.createElement(SocialMediaLinks, null)
                        ),
                        React.createElement(NavBar, { changeScreen: this.changeScreen })
                    );
                    break;
                case "office_hours":
                    return React.createElement(
                        "div",
                        { className: "container" },
                        React.createElement(Header, { changeScreen: this.changeScreen }),
                        React.createElement(
                            "div",
                            { className: "content-padded content" },
                            React.createElement(
                                "h1",
                                { className: "text-center" },
                                "Office Hours"
                            ),
                            React.createElement(
                                "p",
                                null,
                                "Sign up to talk to the RUF team"
                            ),
                            React.createElement(AppointmentForm, { userName: this.state.userName })
                        ),
                        React.createElement(SocialMediaLinks, null),
                        React.createElement(NavBar, { changeScreen: this.changeScreen })
                    );
                    break;
                default:
                    return React.createElement(
                        "h1",
                        null,
                        "Something is wrong"
                    );
                    break;
            }
        } else {
            if (siteLocation == "home") {
                return React.createElement(
                    "div",
                    { className: "loginContainer" },
                    React.createElement(Header, { changeScreen: this.changeScreen }),
                    React.createElement(
                        "form",
                        { className: "input-group loginForm" },
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "label",
                                null,
                                "Username"
                            ),
                            React.createElement("input", { type: "text", placeholder: "Username", id: "userName" })
                        ),
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "label",
                                null,
                                "Password"
                            ),
                            React.createElement("input", { type: "text", placeholder: "Password", id: "userPassword" })
                        ),
                        React.createElement(
                            "div",
                            { className: "btnContainer" },
                            React.createElement(
                                "span",
                                { className: "btn btn-primary btn-block btn-outlined", onClick: this.logUser },
                                "Login"
                            ),
                            React.createElement(
                                "span",
                                { className: "btn btn-primary btn-block btn-outlined", onClick: this.changeScreen.bind(this, "signUpUser") },
                                "Sign Up"
                            )
                        )
                    ),
                    React.createElement(SocialMediaLinks, null),
                    React.createElement(Logo, null)
                );
            } else {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(Header, { changeScreen: this.changeScreen }),
                    React.createElement(
                        "form",
                        { className: "input-group loginForm" },
                        React.createElement(
                            "h3",
                            { className: "text-center" },
                            "Join Our Community"
                        ),
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "label",
                                null,
                                "Username"
                            ),
                            React.createElement("input", { type: "text", placeholder: "Username", id: "userName" })
                        ),
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "label",
                                null,
                                "Password"
                            ),
                            React.createElement("input", { type: "text", placeholder: "Password", id: "userPassword" })
                        ),
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "label",
                                null,
                                "Email"
                            ),
                            React.createElement("input", { type: "text", placeholder: "Email", id: "userEmail" })
                        ),
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "label",
                                null,
                                "Phone #"
                            ),
                            React.createElement("input", { type: "text", placeholder: "Phone Number", id: "userPhoneNumber" })
                        ),
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "select",
                                { id: "userClassYear" },
                                React.createElement(
                                    "option",
                                    null,
                                    "Select a Class"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "freshman"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "sophomore"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "junior"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "senior"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "graduate"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "alumni"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "other"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "input-row" },
                            React.createElement(
                                "select",
                                { id: "carrier" },
                                React.createElement(
                                    "option",
                                    null,
                                    "Select a Phone Carrier"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "at&t"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "verizon"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "t-mobile"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "sprint"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "boost"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "virgin"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "us"
                                )
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "btn btn-primary btn-block btn-outlined", onClick: this.addUser },
                            "Sign Up"
                        )
                    ),
                    React.createElement(SocialMediaLinks, null),
                    React.createElement(Logo, null)
                );
            }
        };
    }
});

var app = {
    // Application Constructor
    initialize: function initialize() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function bindEvents() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function onDeviceReady() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function receivedEvent(id) {

        React.render(React.createElement(App, null), document.getElementById('master'));
    }
};

app.initialize();