console.log("code running")
let futurePfp = "https://images.unsplash.com/photo-1533910534207-90f31029a78e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";
let currentPfp = "";

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
                const profileItem = snapshot.val();
                if (profileItem !== null) {
                    console.log("found profile!!")
                    console.log(profileItem)
                    userProfile.displayName = profileItem["displayName"];
                    userProfile.region = profileItem["region"]
                    userProfile.blurb = profileItem["blurb"]
                    userProfile.pfp = profileItem["pfp"]
                    document.querySelector("#pfp").src = userProfile.pfp; 
                    
                    console.log(profileItem["displayName"])
                    console.log(profileItem["region"])
                    console.log(profileItem["blurb"])

                } else {
                    console.log("No profile found!")
                    const onboardingModal = document.querySelector("#onboardingModal");
                    onboardingModal.classList.add('is-active');
                }
            })

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

function displayPosts(posts, isSearchResults = false, search = "") {
    console.log(posts);
    const cardHolder = document.querySelector("#cardHolder")
    cardHolder.innerHTML = "";
    let star = "⭐️";

    let isEmpty = true;

    for (let visibility in posts) {
        for (let post in posts[visibility]) {
            console.log(posts[visibility][post].pictures ? posts[visibility][post].pictures.length: "no pics")
            if ((posts[visibility][post].title + posts[visibility][post].location + posts[visibility][post].mood + posts[visibility][post].description).includes(search)) {
                isEmpty = false;
                cardHolder.innerHTML +=
                    `
                    <div class="card">
                    <div class="card-content">
                        <div class="images">
                            ${posts[visibility][post].pictures ?
                            getImages(posts[visibility][post].pictures.length ,
                            posts[visibility][post].pictures) : ""}
                        </div>
                        <div class="media">
                        <div class="media-content">
                            <br />
                            <p class="removeMarginB title is-4">${posts[visibility][post].title}</p>
                            <p class="is-6">${posts[visibility][post].location}</p>
                            <p class="is-6">
                            Rating: ${star.repeat(posts[visibility][post].rating)} | Cost:
                            $${posts[visibility][post].cost} | Mood:
                            ${posts[visibility][post].mood}
                            </p>
                        </div>
                        </div>
                        <div class="content">
                        ${posts[visibility][post].description}
                        <br />
                        <br />
                        <time datetime="${posts[visibility][post].date}"
                            >${posts[visibility][post].date}</time
                        >
                        <button class="button" onclick="editCard('${visibility}', '${post}')">
                            edit
                        </button>
                        </div>
                    </div>
                    </div>

                    `
            }
        }
    }

    if (isEmpty) {
        cardHolder.innerHTML = `
        <div class="hero mt-6">
            <p class="title">Hey Foodie!</p>
            <p>
                ${isSearchResults ? 
                    `Looks like there are no posts that <b>matches your search results</b> in the Food Feed. You can make one
                    in the <a href="/createPost.html">Create Page</a> or <a onclick="resetSearch()">reset your search results</a>!` 
                    :
                    `Looks like there are no posts in your Food Feed so far. You can make one
                    in the <a href="/createPost.html">Create Page</a>!` 
                }
            </p>
            <p class="has-text-left mt-4">
                <a class="button is-medium" href="/createPost.html">
                    Create Post
                </a>
                <a class="button is-medium" ${isSearchResults ? `onclick="resetSearch()"` :`href="/stats.html"`}>
                    ${isSearchResults ? "Clear Search" : "Go to Profile"}
                </a>
            </p>
        </div>
        `
    }
}

function getImages(numberOfImages, picturesArray) {
    console.log("inside getImages, there are " + numberOfImages)
  if (numberOfImages === 3) {
    return `
      <div class="left-image">
        <figure class="image">
          <img src=${
            picturesArray && picturesArray["0"]
              ? picturesArray["0"]
              : "https://source.unsplash.com/1600x900/?food"
          } alt="Placeholder image"
          />
        </figure>
      </div>
      <div class="right-images">
        <figure class="image">
          <img src=${
            picturesArray && picturesArray["1"]
              ? picturesArray["1"]
              : "https://source.unsplash.com/1600x900/?food"
          } alt="Placeholder image"
          />
        </figure>
        <figure class="image">
          <img src=${
            picturesArray && picturesArray["2"]
              ? picturesArray["2"]
              : "https://source.unsplash.com/1600x900/?food"
          } alt="Placeholder image"
          />
        </figure>
      </div>
    `;
  }
  if (numberOfImages === 2) {
    return `
      <div class="left-image">
        <figure class="image">
          <img src=${
            picturesArray && picturesArray["0"]
              ? picturesArray["0"]
              : "https://source.unsplash.com/1600x900/?food"
          } alt="Placeholder image"
          />
        </figure>
      </div>
      <div class="right-images-two">
        <figure class="image">
          <img src=${
            picturesArray && picturesArray["1"]
              ? picturesArray["1"]
              : "https://source.unsplash.com/1600x900/?food"
          } alt="Placeholder image"
          />
        </figure>
      </div>

`;
  }
  if (numberOfImages === 1) {
    return `
    
      <div class="left-image-one">
        <figure class="image">
          <img src=${
            picturesArray && picturesArray["0"]
              ? picturesArray["0"]
              : "https://source.unsplash.com/1600x900/?food"
          } alt="Placeholder image"
          />
        </figure>
      </div>
    `;
  } else {
    return "";
  }
}


function editCard(private, id) {
    console.log(private);
    const editNoteModal = document.querySelector('#editNoteModal');
    console.log(editNoteModal);
    const notesRef = firebase.database().ref(`users/${googleUserId}/posts/${private}`);
    editNoteModal.classList.toggle('is-active');
    const saveEditBtn = document.querySelector('#saveEdit');
    let details;
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        details = data[id];
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
    saveEditBtn.onclick = handleSaveEdit.bind(this, details, private, id);
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

function handleSaveEdit(details, private, id) {
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
        pictures: details.pictures,
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

/// ONBOARDING PROFILE CREATION
function createProfile() {
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
    firebase.database().ref(`users/${googleUserId}/profile`).set(data)
        // 4. Clear the form so that we can write a new note
        .then(() => {
            // Update local variables
            userProfile.displayName = data.displayName;
            userProfile.region = data.region;
            userProfile.blurb = data.blurb;
            userProfile.pfp = data.pfp;
            

            // Reset to default values
            displayName.value = "";
            region.value = "";
            blurb.value = "";

            // Alert user post is created
            // TODO - we should replace eventually lol
            alert("Profile is updated!")
        });
    const onboardingModal = document.querySelector("#onboardingModal");
    onboardingModal.classList.toggle('is-active');
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


function search() {
    console.log("here");
    const search = document.querySelector("#searchBar").value;
    const postsRef = firebase.database().ref(`users/${googleUserId}/posts`);
    const cardHolder = document.querySelector("#cardHolder")
    const buttonHolder = document.querySelector("#buttonHolder");
    let star = "⭐️";
    postsRef.on("value", (snapshot) => {
        const posts = snapshot.val();
        console.log(posts);
        cardHolder.innerHTML = "";
        let isSearch = false;
        if (search === "") {
            buttonHolder.innerHTML = "";
        } else {
            buttonHolder.innerHTML = `<button class="button" id="clear" onclick="resetSearch()">clear search</button>`;
            isSearch = true;
        }
        displayPosts(posts, isSearch, search);
    });
}

function resetSearch() {
    document.querySelector("#searchBar").value = "";
    search();
}