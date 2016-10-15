let db = new Firebase("https://grace-prez.firebaseio.com/ruf/");

let getStuffFromFirebase = function(db_selected, state_name, component) {
    db.child(db_selected).on("value", function(snapshot) {
        let data = snapshot.val();
        //console.log(data);
        let o_k = Object.keys(data);
        let items = [];
        for (let i = o_k.length - 1; i >= 0; i--) {
            items.push(data[o_k[i]]);
        }
        window.wtf = items;
        let tmp_state = {};
        tmp_state[state_name] = items;
        this.setState(tmp_state);
    }.bind(component));
};

let getDevID = function() {
    let devID = device.uuid;
    if (devID != null) {
        return device.uuid
    } else {
        return "browser"
    };
};

let getFromFirebase = function(db_selected) {
    let results = [];
    $.ajax({
        async: false,
        url: "https://grace-prez.firebaseio.com/ruf/" + db_selected + "/.json",
        dataType: 'json',
        cache: false,
        success: function(data) {
            console.log("success");
            let listOfResults = [];
            let listOfFirebaseIDs = Object.keys(data);
            for (let i = 0; i < listOfFirebaseIDs.length; i++) {
                listOfResults.push(data[listOfFirebaseIDs[i]]);
            };
            results = listOfResults;
        },
        error: function(xhr, status, err) {
            console.warn(xhr.responseText);
            console.error("https://grace-prez.firebaseio.com/ruf/" + db_selected + "/.json", status, err.toString());
            alert("error");
        },
    });
    console.log("scope");
    console.log(results);
    return results;
};

let getUserName = function(user) {
    let userName = "";
    console.log(user);
    $.ajax({
        async: false,
        url: "https://grace-prez.firebaseio.com/ruf/users/.json",
        dataType: "json",
        cache: false,
        success: function(data) {
            console.log(data);
            let listOfKeys = Object.keys(data);
            for (let i = 0; i < listOfKeys.length; i++) {
                if (user == data[listOfKeys[i]].devID) {
                    userName = data[listOfKeys[i]].name
                    break;
                }
            };
        },
    });
    return userName
};

let App = React.createClass({

    getInitialState: function(){
        return {
            screen: "home",
            logStatus: "out",
            users: getFromFirebase("users"),
            userID: getDevID(),
        };
    },

    changeUser: function(a) {
        this.setState({ userID: a});
    },

    checkUser: function(listOfUsers, specUser) {
        for (let x = 0; x < listOfUsers.length; x++) {
            let user = listOfUsers[x];
            if (specUser == user.devID) {
                this.setState({ logStatus: user.logStatus });
                break
            };
        };
    },

    componentDidMount: function() {
        //check if the user already exists or s/he needs to create an account
        this.checkUser(this.state.users, this.state.userID);
        this.setState({ userName: getUserName(this.state.userID) });
    },

    logUser: function() {
        let userName = document.getElementById("userName").value
        let userPassword = document.getElementById("userPassword").value
        console.log(userName);
        console.log(userPassword);

        let component = this
        let listOfUsers = this.state.users
        for (let x = 0; x < listOfUsers.length; x++) {
            let user = listOfUsers[x];
            if (userName == user.name) {
                if (userPassword == user.password) {

                    db.child("users").child(user.fireID).update({
                        logStatus: "in",
                    });
                    this.setState({ logStatus: "in" });
                    // x = listOfUsers.length
                    break
                };
            };
        };
    },

    addUser: function() {
        let userName = document.getElementById("userName").value
        let userPassword = document.getElementById("userPassword").value
        let userEmail = document.getElementById("userEmail").value
        let userPhoneNumber = document.getElementById("userPhoneNumber").value
        let userClassYear = document.getElementById("userClassYear").value
        let userID = this.state.userID
        let carrier = document.getElementById("carrier").value
        let carrierOb = {"at&t": "@txt.att.net", "t-mobile": "@tmomail.net", "verizon": "@vtext.com", "sprint": "@messaging.sprintpcs.com", "boost": "@myboostmobile.com", "virgin": "@vmobl.com", "us": "@email.uscc.net"}

        let puto = db.child("users").push({
            devID: userID,
            name: userName,
            password: userPassword,
            email: userEmail,
            phone: userPhoneNumber,
            class: userClassYear,
            logStatus: "in",
            carrierExt: carrierOb[carrier],
        });

        let putoID = puto.key();
        
        db.child("users").child(putoID).update({
            fireID: putoID,
        });

        this.setState({ logStatus: "in" });
        this.setState({ screen: "home" });
    },

    changeScreen: function(option_menu){
        this.setState({ screen: option_menu });              
    },

    render: function(){
        let siteLocation = this.state.screen;
        if (this.state.logStatus == "in") {
            switch(siteLocation) {
                case "home" :
                    return (
                        <div className="container">
                            <Header changeScreen = { this.changeScreen }/>
                            <div className="content-padded content">
                                <h1 className="text-center">Love God. Love People. Love Stanford.</h1>
                                <h3>Announcements</h3>
                                <AnnouncementList />
                                <SocialMediaLinks />
                            </div> 
                            <NavBar changeScreen = {this.changeScreen} />
                        </div>
                    );
                    break;
                case "events":
                    return (
                        <div className="container">
                            <Header changeScreen = { this.changeScreen }/>
                            <div className="content-padded content">
                                <h1 className="text-center">Events</h1>
                                <Events />
                                <SocialMediaLinks />
                            </div>
                            <NavBar changeScreen={this.changeScreen} />
                        </div>
                    );
                    break;
                case "podcasts":
                    return (
                        <div className="container">
                            <Header changeScreen = { this.changeScreen }/>
                            <div className="content-padded content">
                                <h1 className="text-center">Podcasts</h1>
                                <Podcasts />
                                <SocialMediaLinks />
                            </div>
                            <NavBar changeScreen={this.changeScreen} />
                        </div>
                    );
                    break;
                case "about":
                    return (
                        <div className="container">
                            <Header changeScreen = { this.changeScreen}/>
                            <div className="content-padded content">
                                <h1 className="text-center">About Us</h1>
                                <p>Our ministry is set up in such a way that students are given opportunities to wrestle with the truth (through the Bible--Gods word), and to see that the gospel speaks to every need and every area of life. Through exposure to truth, we hope that many will come to know the One who is truth, Jesus Christ. Also, we believe that Christianity is not just a moral system. It does contain a moral system, but that is not the heart of what it means to be a Christian. Rather than simply becoming a better person, the gospel makes you a new person. It brings new life for those who are dead in sin, and brings hope for the hopeless. We believe that those who come to see that Jesus is the truth will also see that He is life.</p>
                                <h1>Meet the Crew</h1>
                                <Crew />
                                <SocialMediaLinks />
                            </div>
                            <NavBar changeScreen={ this.changeScreen } />
                        </div>
                    );
                    break;
                case "office_hours":
                    return (
                        <div className="container">
                            <Header changeScreen = { this.changeScreen}/>
                            <div className="content-padded content">
                                <h1 className="text-center">Office Hours</h1>
                                <p>Sign up to talk to the RUF team</p>
                                <AppointmentForm userName= { this.state.userName }/>
                            </div>
                            <SocialMediaLinks />
                            <NavBar changeScreen={ this.changeScreen } />
                        </div>
                    );
                    break;
               default:
                    return(
                        <h1>Something is wrong</h1>
                    );
                    break;
            }
        } else {
            if (siteLocation == "home") {
                return (
                    <div className="loginContainer">
                        <Header changeScreen = { this.changeScreen }/>
                        <form className="input-group loginForm">
                            <div className="input-row">
                                <label>Username</label>
                                <input type="text" placeholder="Username" id="userName"></input>
                            </div>
                            <div className="input-row">
                                <label>Password</label>
                                <input type="text" placeholder="Password" id="userPassword"></input>
                            </div>
                            <div className="btnContainer">
                                <span className="btn btn-primary btn-block btn-outlined" onClick={ this.logUser }>Login</span>
                                <span className="btn btn-primary btn-block btn-outlined" onClick={ this.changeScreen.bind(this, "signUpUser") }>Sign Up</span>
                            </div>
                        </form>
                        <SocialMediaLinks />
                        <Logo />
                    </div>
                );
            } else {
                return (
                    <div>
                        <Header changeScreen = { this.changeScreen }/>
                        <form className="input-group loginForm">
                            <h3 className="text-center">Join Our Community</h3>
                            <div className="input-row">
                                <label>Username</label>
                                <input type="text" placeholder="Username" id="userName"></input>
                            </div>
                            <div className="input-row">
                                <label>Password</label>
                                <input type="text" placeholder="Password" id="userPassword"></input>
                            </div>
                            <div className="input-row">
                                <label>Email</label>
                                <input type="text" placeholder="Email" id="userEmail"></input>
                            </div>
                            <div className="input-row">
                                <label>Phone #</label>
                                <input type="text" placeholder="Phone Number" id="userPhoneNumber"></input>
                            </div>
                            <div className="input-row">
                                <select id="userClassYear">
                                    <option>Select a Class</option>
                                    <option>freshman</option>
                                    <option>sophomore</option>
                                    <option>junior</option>
                                    <option>senior</option>
                                    <option>graduate</option>
                                    <option>alumni</option>
                                    <option>other</option>
                                </select>
                            </div>
                            <div className="input-row">
                                <select id="carrier">
                                    <option>Select a Phone Carrier</option>
                                    <option>at&t</option>
                                    <option>verizon</option>
                                    <option>t-mobile</option>
                                    <option>sprint</option>
                                    <option>boost</option>
                                    <option>virgin</option>
                                    <option>us</option>
                                </select>
                            </div>
                            <span className="btn btn-primary btn-block btn-outlined" onClick={ this.addUser }>Sign Up</span>
                        </form>
                        <SocialMediaLinks />
                        <Logo />
                    </div>
                );
            }
        };
    }
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        React.render(
            <App />,
           document.getElementById('master'));
    }
};

app.initialize();
