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

document.getElementById("refreshExplore").addEventListener("click", findRandomPost);

function findRandomPost() {
    var allUserIds = Object.keys(users);
    var randomUser = findRandomUser(allUserIds);
    displayRandomUser(users[randomUser]["profile"]);
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
    } while (randomUser == googleUserId);
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

function displayRandomUser(profile) {
    console.log(profile);
    const profileHolder = document.querySelector("#personInfo")
    let star = "⭐️";
    profileHolder.innerHTML ="";
    profileHolder.innerHTML =
                `
                    <div class="split">
                        <img class=pfp-info-card src="${profile.pfp}" />
                        <div class="split-right">
                            <p class="title"> ${profile.displayName}</p>
                            <p class="subtitle">📍 ${profile.region}</p>
                        </div>
                    </div>
                    <p class="subtitle"> ${profile.blurb}</p>
                    <p class="subtitle">join date!</p>
                
`;
}


function signOut() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}