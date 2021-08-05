const userProfile = {
    displayName: null,
    region: null,
    blurb: null,
};

const profileDisplayName = document.querySelector("#profileDisplayName");
const profileLocation = document.querySelector("#profileLocation");

// Modal input
const modalDisplayName = document.querySelector("#displayName")
const modalRegion = document.querySelector("#region")
const modalBlurb = document.querySelector("#blurb")
const modalPfp = document.querySelector("#pfp-modal")

var futurePfp = "";
var currentPfp = "";


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
                    profileLocation.innerHTML = userProfile.region;
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
    let locations = [];
    let moodDict = {};
    for (let visibility in posts) {
        for (let post in posts[visibility]) {
            console.log(posts[visibility][post].rating)
            sumRatings += parseInt(posts[visibility][post].rating);
            sumCosts += parseInt(posts[visibility][post].cost);
            numberOfPosts += 1;
            if (locations.includes(posts[visibility][post].location)) {
                console.log("in");
            } else {
                console.log(locations);
                console.log(posts[visibility][post].location);
                locations.push(posts[visibility][post].location);
            }
            let mood = posts[visibility][post].mood;
            if (mood in moodDict) {
                moodDict[mood] += 1;
            } else {
                moodDict[mood] = 1;
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
    let uniqueLocations = locations.length;
    let avgRating = sumRatings / numberOfPosts;
    let avgCost = sumCosts / numberOfPosts;
    console.log(avgRating);
    let star = "⭐️"
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
                    <p class="title is-1">${uniqueLocations}</p>
                    <p class="subtitle is-6">location(s)</p>
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
}

function toggleEditProfileModal() {
    const editProfileModal = document.querySelector("#editProfileModal");
    editProfileModal.classList.toggle('is-active');
}

function signOut() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}

document.querySelector("#refresh").addEventListener("click", function(){
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
