console.log("createPost running")
let googleUserId;

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
            const postsRef = firebase.database().ref(`users/${googleUserId}/active`);
            postsRef.on("value", (snapshot) => {
                const posts = snapshot.val();
            })
        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html';
        };
    });
}
const handlePostSubmit = () => {
    /*
        title: string, 
		date: string,
		cost: number,
		rating: number (out of 5),
		picture: string (url),
		mood: enum/string,
		description: string,
        location: string (address), 
        private: boolean 
    */

    // 1. Capture the form data
    const title = document.querySelector('#title');
    const cost = document.querySelector('#cost');
    const rating = document.querySelector('#rating'); //TODO: get star rating value
    const picture = document.querySelector('#picture');
    const mood = document.querySelector('#mood');
    const description = document.querySelector('#description');
    const location = document.querySelector('#location');
    const private = document.querySelector('#private');

    // I forgot if javascript support shorthands like {title: title} -> {title} lol
    // Redundant but just in case it doesn't work
    console.log(cost.value)
    const data = {
        title: title.value,
        date: Date.now(),
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

    // 3. Format the data and write it to our database
    firebase.database().ref(`users/${googleUserId}/posts`).push(data)
        // 4. Clear the form so that we can write a new note
        .then(() => {
            // Reset to default values
            title.value = "";
            cost.value = "";
            rating.value = 5;
            // picture.value = "";
            mood.value = "";
            description.value = "";
            location.value = ""

            // Alert user post is created
            // TODO - we should replace eventually lol
            alert("Post is created!")
        });
};