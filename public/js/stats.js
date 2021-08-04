window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            const googleUserId = user.uid;
            const postsRef = firebase.database().ref(`users/${googleUserId}/posts`);
            postsRef.on("value", (snapshot) => {
                const posts = snapshot.val();
                calculateStats(posts);
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
            if (posts[visibility][post].location != locations) {
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
    let avgRating = sumRatings/numberOfPosts;
    let avgCost = sumCosts/numberOfPosts;
    console.log(avgRating);
    const cardHolder = document.querySelector("#cardHolder");
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
                    <p class="title is-1">${avgRating}</p>
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
                    <p class="title is-1">$${avgCost}</p>
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