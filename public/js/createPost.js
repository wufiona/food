window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            const googleUserId = user.uid;
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
