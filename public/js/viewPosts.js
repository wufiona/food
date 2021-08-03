window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            const googleUserId = user.uid;
            const postsRef = firebase.database().ref(`users/${googleUserId}/posts`);
            postsRef.on("value", (snapshot) => {
                const posts = snapshot.val();
                displayPosts(posts);
            })
            // test with cassieTest sample
            // const postsRef1 = firebase.database().ref(`users/cassieTest/posts`);
            // postsRef1.on("value", (snapshot) => {
            //     const posts1 = snapshot.val();
            //     displayPosts(posts1);
            // })
        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html'; 
        };
    });
}

function displayPosts(posts) {
    console.log(posts);
    const cardHolder = document.querySelector("#cardHolder")
    cardHolder.innerHTML = "";
    for (let visibility in posts) {
        for (let post in posts[visibility]) {
            cardHolder.innerHTML +=
                `<div class="is-half mt-4 card">
                    <!-- CARD -->
                    <div class="card-content">
                        <div class="content">
                            <p class="title is-4">${posts[visibility][post].title}</p>
                            <p class="title is-5">${posts[visibility][post].date}</p>
                            <p class="title is-5">${posts[visibility][post].cost}</p>
                            <p class="title is-5">${posts[visibility][post].rating}</p>
                            <img src="${posts[visibility][post].picture}" />
                            <p class="title is-5">${posts[visibility][post].mood}</p>
                            <p class="title is-5">${posts[visibility][post].description}</p>
                            <p class="title is-5">${posts[visibility][post].location}</p>
                        </div>
                    </div> 
                    </div>
                </div>`;
        }
    }
}
