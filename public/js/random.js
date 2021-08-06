var users;
let googleUserId;

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        //need to store display name earlier so we can display here
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
            console.log("in random.js")
            const usersRef = firebase.database().ref(`users`);
            usersRef.on("value", (snapshot) => {
                users = snapshot.val();
                findRandomPost();
            })
            const profileRef = firebase.database().ref(`users/${googleUserId}/profile`);
            profileRef.on("value", (snapshot) => {
                console.log("hello")
                const profileItem = snapshot.val();
                if (profileItem !== null) {
                    document.querySelector("#pfp").src = profileItem["pfp"];
                }
            })
        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html'; 
        };
    });
}

function findRandomPost() {
    var allUserIds = Object.keys(users);
    var randomUser = findRandomUser(allUserIds);
    displayRandomUser(users[randomUser]["profile"], users[randomUser]["posts"]);
    userPosts =  users[randomUser]["posts"]["public"];
    var allPostIds = Object.keys(userPosts);
    console.log(userPosts);
    randomPost = allPostIds[Math.floor(Math.random() * (allPostIds.length))]
    thePost = userPosts[randomPost];
    console.log(thePost);
    displayPost(thePost);
}

function findRandomUser(allUserIds){
    do {
        randomUser = allUserIds[Math.floor(Math.random() * (allUserIds.length))]
        console.log("finding randomUser");
    } while (randomUser == googleUserId || !users[randomUser]["posts"] || !users[randomUser]["posts"]["public"]);
    return (randomUser);
}

function displayPost(post) {
    console.log(post);
    const cardHolder = document.querySelector("#cardHolder")
    let star = "⭐️";
    cardHolder.innerHTML ="";
    cardHolder.innerHTML =
                `      <div class="card-big">
        <div class="card-content">
          <div class="images">
            <div class="left-image-big">
              <figure class="image">
                <img
                  src=${post.pictures && post.pictures["0"] ? post.pictures["0"] : "https://source.unsplash.com/1600x900/?food"}
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="right-images-big">
              <figure class="image">
                <img
                  src=${post.pictures && post.pictures["1"] ? post.pictures["1"] : "https://source.unsplash.com/1600x900/?food"}
                 alt="Placeholder image"
                />
              </figure>
              <figure class="image">
                <img
                  src=${post.pictures && post.pictures["2"] ? post.pictures["2"] : "https://source.unsplash.com/1600x900/?food"}
                  alt="Placeholder image"
                />
              </figure>
            </div>
          </div>
          <div class="media">
            <div class="media-content">
              <br />
              <p class="removeMarginB title is-1">
                ${post.title}
              </p>
              <p class="is-1">${post.location}</p>
              <p class="is-1">
                 Rating: ${star.repeat(post.rating)} | Cost: $${post.cost} | Mood: ${post.mood}
              </p>
            </div>
          </div>
          <div class="content">
            ${post.description}
            <br />
            <br />
            <time datetime="${post.date}">${post.date}</time>
          </div>
        </div>
      </div>`;
}

function displayRandomUser(profile, userPostsAll) {
    console.log(profile);
    const profileHolder = document.querySelector("#personInfo")
    let star = "⭐️";
    profileHolder.innerHTML ="";
    profileHolder.innerHTML =
                `
                <div class="personCard" style="background-color: #ebe1ce;">
                    <div class="split">
                        <img class=pfp-info-card src="${profile.pfp}" />
                        <div class="split-right">
                            <p class="title"> ${profile.displayName}</p>
                            <p class="subtitle">📍 ${profile.region}</p>
                        </div>
                    </div>
                    <p class="subtitle"> ${profile.blurb}</p>
                    <div id="challengesHolderRandomUser">
                    </div>
                </div>
                <div class="center">
                        <button class="button" id="refreshExplore" onclick="findRandomPost()"> Explore again! </button>
                </div>           
`;
calculateStats(userPostsAll);
}


function signOut() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
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
    const challengesHolder = document.querySelector("#challengesHolderRandomUser");
    challengesHolder.innerHTML += `<img src="images/badges/welcomeBadge.png" />`
    if (avgCost < 20) {
        challengesHolder.innerHTML += `<img src="images/badges/superSaver.png" />`
    } else {
        challengesHolder.innerHTML += `<img src="images/badges/superSpender.png" />`
    }
    if (fruity) {
        challengesHolder.innerHTML += `<img src="images/badges/fruitTastic.png" />`
    }
    if (drinky) {
        challengesHolder.innerHTML += `<img src="images/badges/drinkExpert.png" />`
    }
    if (spicy) {
        challengesHolder.innerHTML += `<img src="images/badges/verySpicy.png" />`
    }
}