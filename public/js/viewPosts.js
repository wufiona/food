console.log("code running")

let googleUserId;
const userProfile = {
    displayName: null,
    region: null,
    blurb: null,
};

window.onload = event => {
    // Retains user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;

            // Update user profile info
            const profileRef = firebase.database().ref(`users/${googleUserId}/profile`);
            profileRef.on("value", (snapshot) => {
                const profileItems = snapshot.val();
                console.log(profileItems)
                userProfile.displayName = profileItems["displayName"];
                userProfile.region = profileItems["region"]
                userProfile.blurb = profileItems["blurb"]
            })

            // If no profile found, prompt onboarding modal
            if (userProfile.displayName == null || userProfile.region == null || userProfile.blurb == null) {
                const onboardingModal = document.querySelector("#onboardingModal");
                onboardingModal.classList.toggle('is-active');
            }

            // Fetch posts available
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
    let star = "⭐️";
    for (let visibility in posts) {
        for (let post in posts[visibility]) {
            cardHolder.innerHTML +=
                // `<div class="is-half mt-4 card">
                //     <!-- CARD -->
                //     <div class="card-content">
                //         <div class="content">
                //             <p class="title is-4">${posts[visibility][post].title}</p>
                //             <p class="title is-5">${posts[visibility][post].date}</p>
                //             <p class="title is-5">${posts[visibility][post].cost}</p>
                //             <p class="title is-5">${posts[visibility][post].rating}</p>
                //             <img src="${posts[visibility][post].picture}" />
                //             <p class="title is-5">${posts[visibility][post].mood}</p>
                //             <p class="title is-5">${posts[visibility][post].description}</p>
                //             <p class="title is-5">${posts[visibility][post].location}</p>
                //             <button class="button" onclick="editCard('${visibility}', '${post}')">edit</button>
                //         </div>
                //     </div> 
                //     </div>
                // </div>`;
                `
                    <div class="card">
                        <div class="card-content">
                        <div class="images">
                            <div class="left-image">
                            <figure class="image">
                                <img
                                src="https://thumbor.thedailymeal.com/O5BS3X-3J3JKcsTKYdYd996xqsI=/870x565/https://www.thedailymeal.com/sites/default/files/slideshows/1943277/2108053/0.jpg"
                                alt="Placeholder image"
                                />
                            </figure>
                            </div>
                            <div class="right-images">
                            <figure class="image">
                                <img
                                src="https://lh3.googleusercontent.com/proxy/5104TtV0zUcP6TBoJIGXox29gkw3eR5V5pgnSdlnStV4qkHfzmUaaNLiG65z1GE29Du6qzY-NzJbkW9cvBHVRPVTurRpCLtZtNo9Ii-TtEMfVW2gBQ"
                                alt="Placeholder image"
                                />
                            </figure>
                            <figure class="image">
                                <img
                                src="https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/34/2020/02/Spain-restaurants.jpg"
                                alt="Placeholder image"
                                />
                            </figure>
                            </div>
                        </div>
                        <div class="media">
                            <div class="media-content">
                            <br />
                            <p class="removeMarginB title is-4">${posts[visibility][post].title}</p>
                            <p class="is-6">${posts[visibility][post].location}</p>
                            <p class="is-6">
                                Rating: ${star.repeat(posts[visibility][post].rating)} | Cost: $${posts[visibility][post].cost} | Mood: ${posts[visibility][post].mood}
                            </p>
                            </div>
                        </div>
                        <div class="content">
                            ${posts[visibility][post].description}
                            <br />
                            <br />
                            <time datetime="${posts[visibility][post].date}">${posts[visibility][post].date}</time>
                            <button class="button" onclick="editCard('${visibility}', '${post}')">edit</button>
                        </div>
                        </div>
                    `
        }
    }
}

function editCard(private, id) {
    console.log(private);
    const editNoteModal = document.querySelector('.modal');
    console.log(editNoteModal);
    const notesRef = firebase.database().ref(`users/${googleUserId}/posts/${private}`);
    editNoteModal.classList.toggle('is-active');
    const saveEditBtn = document.querySelector('#saveEdit');
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const details = data[id];
        // 1. Capture the form data
        console.log(details);
        document.querySelector('#title').value = details.title;
        document.querySelector('#cost').value = details.cost;
        document.querySelector('#date').value = details.date;
        document.querySelector('#rating').value = details.rating; //TODO: get star rating value
        document.querySelector('#mood').value = details.mood;
        document.querySelector('#description').value = details.description;
        document.querySelector('#location').value = details.location;
        // need to change privacy or update it        
    });
    saveEditBtn.onclick = handleSaveEdit.bind(this, private, id);
    if (private === "private") {
        document.querySelector("#privateOp").checked = true;
    } else {
        console.log("e");
        console.log(document.querySelector("#publicOp"));
        document.querySelector("#publicOp").checked = true;
    }
}

function closeEditModal() {
    const editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.toggle('is-active');
}

function handleSaveEdit(private, id) {
    const title = document.querySelector('#title');
    const cost = document.querySelector('#cost');
    const date = document.querySelector('#date');
    const rating = document.querySelector('#rating'); //TODO: get star rating value
    const picture = document.querySelector('#picture');
    const mood = document.querySelector('#mood');
    const description = document.querySelector('#description');
    const location = document.querySelector('#location');
    const privateIn = document.getElementsByName('private');

    let isPrivate;
    for (i = 0; i < privateIn.length; i++) {
        if (privateIn[i].checked) {
            isPrivate = privateIn[i].value == "true";
        }
    }

    const data = {
        title: title.value,
        date: date.value,
        cost: cost.value,
        rating: rating.value,
        picture: "https://via.placeholder.com/150",
        mood: mood.value,
        description: description.value,
        location: location.value,
    }

    // 2. Validate Data
    for (const prop in data) {
        console.log(`${prop}: ${data[prop]}`);
        if (data[prop] == "" || typeof data[prop] == undefined) {
            alert(`Please enter a valid input for ${prop}.`)
            return 1;
        }
    }
    if (privateIn != private) {
        firebase.database().ref(`users/${googleUserId}/posts/${private}/${id}`).remove();
    }
    // 3. Format the data and write it to our database
    firebase.database().ref(`users/${googleUserId}/posts/${isPrivate ? "private" : "public"}/${id}`).set(data)
        // 4. Clear the form so that we can write a new note
        .then(() => {
            // Reset to default values
            title.value = "";
            date.value = "";
            cost.value = "";
            rating.value = "";
            // picture.value = "";
            mood.value = "";
            description.value = "";
            location.value = ""
            private.value = ""

            // Alert user post is created
            // TODO - we should replace eventually lol
            alert("Post is updated!")
        });
    const editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.toggle('is-active');
}