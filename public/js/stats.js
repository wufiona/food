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
    for (let visibility in posts) {
        for (let post in posts[visibility]) {
            console.log(posts[visibility][post].rating)
            sumRatings += parseInt(posts[visibility][post].rating);
            numberOfPosts += 1;
        }
    }
    let avgRating = sumRatings/numberOfPosts;
    console.log(avgRating);
    const cardHolder = document.querySelector("#cardHolder");
    cardHolder.innerHTML +=
        `<div class="is-half mt-4 card">
            <!-- CARD -->
            <div class="card-content">
                <div class="content">
                    <p class="title is-1">${numberOfPosts}</p>
                    <p class="subtitle is-6">posts</p>
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
}