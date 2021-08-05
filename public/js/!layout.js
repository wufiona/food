window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            const googleUserId = user.uid;
            const postsRef = firebase.database().ref(`users/${googleUserId}/active`);
            postsRef.on("value", (snapshot) => {
                const posts = snapshot.val();
            })
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