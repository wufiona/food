let googleUserId;

const userProfile = {
    displayName: null,
    region: null,
    blurb: null,
    pfp: null,
};

const profileDisplayName = document.querySelector("#profileDisplayName");
const profileLocation = document.querySelector("#profileLocation");

// Modal input
const modalDisplayName = document.querySelector("#displayName")
const modalRegion = document.querySelector("#region")
const modalBlurb = document.querySelector("#blurb")
const modalPfp = document.querySelector("#pfp-modal")

let futurePfp = "";
let currentPfp = "";


//const profileRegion = document.querySelector("#profileRegion")
//const profileBlurb = document.querySelector("#profileBlurb")

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            const googleUserId = user.uid;
            const postsRef = firebase.database().ref(`users/${googleUserId}/posts`);
            postsRef.on("value", (snapshot) => {
                const posts = snapshot.val();
                calculateStats(posts);
            })

            // Update user profile info
            const profileRef = firebase.database().ref(`users/${googleUserId}/profile`);
            profileRef.on("value", (snapshot) => {
                const profileItem = snapshot.val();
                if (profileItem !== null) {
                    console.log("found profile!!");
                    console.log(profileItem);
                    userProfile.displayName = profileItem["displayName"];
                    userProfile.region = profileItem["region"];
                    userProfile.blurb = profileItem["blurb"];
                    userProfile.pfp = profileItem["pfp"];
                    futurePfp = profileItem["pfp"];
                    document.querySelector("#pfp").src = userProfile.pfp;
                    document.querySelector("#pfImage").src = userProfile.pfp;

                    profileDisplayName.innerHTML = "@" + userProfile.displayName;
                    profileLocation.innerHTML = "📍" + userProfile.region;
                    modalDisplayName.value = userProfile.displayName;
                    modalRegion.value = userProfile.region;
                    modalBlurb.value = userProfile.blurb;
                    modalPfp.src = userProfile.pfp;

                    console.log(profileItem["displayName"]);
                    console.log(profileItem["region"]);
                    console.log(profileItem["blurb"]);
                }
            })

        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html';
        };
    });
}

function calculateStats(posts) {
    let numberOfPosts = 0;
    let sumRatings = 0;
    let sumCosts = 0;
    let resturaunts = [];
    let moodDict = {};
    let fruity = false;
    let drinky = false;
    let spicy = false;
    for (let visibility in posts) {
        for (let post in posts[visibility]) {
            console.log(posts[visibility][post].rating)
            sumRatings += parseInt(posts[visibility][post].rating);
            sumCosts += parseInt(posts[visibility][post].cost);
            numberOfPosts += 1;
            if (resturaunts.includes(posts[visibility][post].title)) {
                console.log("in");
            } else {
                console.log(resturaunts);
                console.log(posts[visibility][post].title);
                resturaunts.push(posts[visibility][post].title);
            }
            let mood = posts[visibility][post].mood;
            if (mood in moodDict) {
                moodDict[mood] += 1;
            } else {
                moodDict[mood] = 1;
            }
            if (posts[visibility][post].title.includes("fruit") || posts[visibility][post].description.includes("fruit") || posts[visibility][post].location.includes("fruit")) {
                fruity = true;
            }
            if (posts[visibility][post].title.includes("drink") || posts[visibility][post].description.includes("drink") || posts[visibility][post].location.includes("drink")) {
                drinky = true;
            }
            if (posts[visibility][post].title.includes("spicy") || posts[visibility][post].description.includes("spicy") || posts[visibility][post].location.includes("spicy")) {
                spicy = true;
            }
        }
    }
    let highestMood = "";
    let highestMoodCount = 0;
    console.log(moodDict);
    for (let mood in moodDict) {
        if (moodDict[mood] > highestMoodCount) {
            highestMood = mood;
            highestMoodCount = moodDict[mood];
        }
    }
    console.log(highestMood);
    let uniqueRes = resturaunts.length;
    let avgRating = sumRatings / numberOfPosts;
    let avgCost = sumCosts / numberOfPosts;
    console.log(avgRating);
    let star = "⭐️";
    const progressBarRes = document.querySelector("#resChallenge");
    progressBarRes.value = uniqueRes;
    const challengesHolder = document.querySelector("#challengesHolder");
    challengesHolder.innerHTML += `<img src="https://cdn.glitch.com/8d7c1443-e6ae-466c-a2fb-143582521dfd%2F3.png?v=1628203002495" />`
    if (avgCost < 20) {
        challengesHolder.innerHTML += `<img src="https://cdn.glitch.com/8d7c1443-e6ae-466c-a2fb-143582521dfd%2F2.png?v=1628202999670" />`
    } else {
        challengesHolder.innerHTML += `<img src="https://cdn.glitch.com/8d7c1443-e6ae-466c-a2fb-143582521dfd%2F1.png?v=1628202998344" />`
    }
    if (fruity) {
        challengesHolder.innerHTML += `<img src="https://cdn.glitch.com/8d7c1443-e6ae-466c-a2fb-143582521dfd%2F6.png?v=1628203005061" />`
    }
    if (drinky) {
        challengesHolder.innerHTML += `<img src="https://cdn.glitch.com/8d7c1443-e6ae-466c-a2fb-143582521dfd%2F5.png?v=1628203011478" />`
    }
    if (spicy) {
        challengesHolder.innerHTML += `<img src="https://cdn.glitch.com/8d7c1443-e6ae-466c-a2fb-143582521dfd%2F4.png?v=1628203008072" />`
    }
    const cardHolder = document.querySelector("#statsCardHolder");
    cardHolder.innerHTML +=
        `<div class="is-half mt-4 card">
            <!-- CARD -->
            <div class="card-content">
                <div class="content">
                    <p class="title is-1">${numberOfPosts}</p>
                    <p class="subtitle is-6">post(s)</p>
                </div>
            </div> 
            </div>
        </div>`;
    cardHolder.innerHTML +=
        `<div class="is-half mt-4 card">
            <!-- CARD -->
            <div class="card-content">
                <div class="content">
                    <p class="title is-1">${uniqueRes}</p>
                    <p class="subtitle is-6">restaurant(s)</p>
                </div>
            </div> 
            </div>
        </div>`;
    if (numberOfPosts != 0) {
        cardHolder.innerHTML +=
            `<div class="is-half mt-4 card">
                <!-- CARD -->
                <div class="card-content">
                    <div class="content">
                        <p class="title is-1">${avgRating.toFixed(2)}</p>
                        <p class="subtitle is-6">average rating</p>
                    </div>
                </div> 
                </div>
            </div>`;
        cardHolder.innerHTML +=
            `<div class="is-half mt-4 card">
                <!-- CARD -->
                <div class="card-content">
                    <div class="content">
                        <p class="title is-1">$${avgCost.toFixed(2)}</p>
                        <p class="subtitle is-6">average cost</p>
                    </div>
                </div> 
                </div>
            </div>`;
        cardHolder.innerHTML +=
            `<div class="is-half mt-4 card">
            <!-- CARD -->
            <div class="card-content">
                <div class="content">
                    <p class="title is-1">${highestMoodCount}</p>
                    <p class="subtitle is-6">instances of ${highestMood}</p>
                </div>
            </div> 
            </div>
        </div>`;
    } else {
        cardHolder.innerHTML +=
            `<div class="is-half mt-4 card">
                <!-- CARD -->
                <div class="card-content">
                    <div class="content">
                        <p class="title is-1">N/A</p>
                        <p class="subtitle is-6">average rating</p>
                    </div>
                </div> 
                </div>
            </div>`;
        cardHolder.innerHTML +=
            `<div class="is-half mt-4 card">
                <!-- CARD -->
                <div class="card-content">
                    <div class="content">
                        <p class="title is-1">N/A</p>
                        <p class="subtitle is-6">average cost</p>
                    </div>
                </div> 
                </div>
            </div>`;
        cardHolder.innerHTML +=
            `<div class="is-half mt-4 card">
            <!-- CARD -->
            <div class="card-content">
                <div class="content">
                    <p class="title is-1">N/A</p>
                    <p class="subtitle is-6">instances of N/A</p>
                </div>
            </div> 
            </div>
        </div>`;
    }
}

function toggleEditProfileModal() {
    const editProfileModal = document.querySelector("#editProfileModal");
    editProfileModal.classList.toggle('is-active');
}

/// ONBOARDING PROFILE EDIT
function editProfile() {
    const displayName = document.querySelector('#displayName');
    const region = document.querySelector('#region');
    const blurb = document.querySelector('#blurb');

    const data = {
        displayName: displayName.value,
        region: region.value,
        blurb: blurb.value,
        pfp: currentPfp,
    }

    // 2. Validate Data
    for (const prop in data) {
        console.log(`${prop}: ${data[prop]}`);
        if (data[prop] == "" || typeof data[prop] == undefined) {
            alert(`Please enter a valid input for ${prop}.`)
            return 1;
        }
    }

    // 3. Format the data and write it to our database
    firebase.database().ref(`users/${googleUserId}/profile`).update(data)
        // 4. Clear the form so that we can write a new note
        .then(() => {
            console.log(data)
            // Update local variables
            userProfile.displayName = data.displayName;
            userProfile.region = data.region;
            userProfile.blurb = data.blurb;
            userProfile.pfp = data.pfp;

            // Alert user post is created
            // TODO - we should replace eventually lol

            document.querySelector("#pfp").src = userProfile.pfp;
            document.querySelector("#pfImage").src = userProfile.pfp;

            profileDisplayName.innerHTML = "@" + userProfile.displayName;
            profileLocation.innerHTML = "📍" + userProfile.region;
            modalDisplayName.value = userProfile.displayName;
            modalRegion.value = userProfile.region;
            modalBlurb.value = userProfile.blurb;
            modalPfp.src = userProfile.pfp;

            alert("Profile is updated!")
        });
    const editProfileModal = document.querySelector("#editProfileModal");
    editProfileModal.classList.toggle('is-active');
}

function signOut() {
    firebase.auth().signOut()

        .then(function () {
            console.log('Signout Succesfull')
        }, function (error) {
            console.log('Signout Failed')
        });
}

document.querySelector("#refresh").addEventListener("click", function () {
    currentPfp = futurePfp;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://source.unsplash.com/user/lilkatsu/likes/', true);
    xhr.onload = function () {
        console.log(xhr.responseURL);
        futurePfp = xhr.responseURL
    };
    xhr.send(null);
    document.getElementById("pfp-modal").src = futurePfp;
});
