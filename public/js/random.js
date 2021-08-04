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
    cardHolder.innerHTML ="";
    cardHolder.innerHTML =
                `<div class="is-half mt-4 card">
                    <!-- CARD -->
                    <div class="card-content">
                        <div class="content">
                            <p class="title is-4">${post.title}</p>
                            <p class="title is-5">${post.date}</p>
                            <p class="title is-5">${post.cost}</p>
                            <p class="title is-5">${post.rating}</p>
                            <img src="${post.picture}" />
                            <p class="title is-5">${post.mood}</p>
                            <p class="title is-5">${post.description}</p>
                            <p class="title is-5">${post.location}</p>
                        </div>
                    </div> 
                    </div>
                </div>`;
}
