console.log("createPost running")
let googleUserId;
let itemsUploaded = 0;
let pictureData;

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
            console.log(googleUserId)
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
    const client = filestack.init("ALpTDTkiRLv9PTnWuopgCz");
    const options = {
        fromSources: ["local_file_system","url", "instagram"],
        accept: ["image/*"],
        displayMode: 'inline',
        container: '#fieldImage', 
        maxFiles: 3,
        onFileSelected: file => {
            if (file.size > 1000 * 1000) {
                throw new Error('File too big, select something smaller than 1MB');
            }
        },
        onUploadDone: PickerUploadDoneCallback => {
            console.log(PickerUploadDoneCallback.filesUploaded);
            pictureData = [];
            for (i=0; i < PickerUploadDoneCallback.filesUploaded.length; i++){
                pictureData.push(PickerUploadDoneCallback.filesUploaded[i].url);
            }
        },
    }
    client.picker(options).open();
    };
    
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
    const date = document.querySelector('#date');
    const rating = document.querySelector('#rating'); //TODO: get star rating value
    const picture = document.querySelector('#picture');
    const mood = document.querySelector('#mood');
    const description = document.querySelector('#description');
    const location = document.querySelector('#location');
    const private = document.getElementsByName('private');
    const otherPeople = document.querySelector('#otherPeople');

    if (rating.value <= 5 && rating.value >= 0 && rating.value % 1 === 0) {

        let isPrivate;
        for(i = 0; i < private.length; i++) {
            if(private[i].checked) {
                isPrivate = private[i].value == "true";
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
            pictures: pictureData,
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
        firebase.database().ref(`users/${googleUserId}/posts/${isPrivate ? "private" : "public"}`).push(data)
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
                location.value = "";
                private.value = "";
                otherPeople.value = "";
                document.querySelector("#privateOp").checked = false;
                document.querySelector("#publicOp").checked = false;

                // Alert user post is created
                // TODO - we should replace eventually lol
                alert("Post is created!")
            });
        } else {
            alert("enter whole number rating between 1 and 5");
        }
};

function signOut() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}