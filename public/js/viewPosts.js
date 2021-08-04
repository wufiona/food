let googleUserId;
window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
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
                                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoGCBUVExcVFRUYGBcZGBocGxoaGxohHRwfGRwcHxofHBoaICsjGiMpHRoZJDUlKCwuMjIyHCE3PDcwOysxMy4BCwsLDw4PHBERHTEoIykzMzExLjMxMTExMzExMTExMTExMzExMTExMTExMTExMTExMTExMTExMTExMTExMTExMf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAIHAQj/xABDEAACAQIEBAMFBgUCBQIHAAABAhEAAwQSITEFQVFhBiJxEzKBkaFCUrHB0fAHFCNi4XLxFTOCkqJjshYXJCVDU9L/xAAZAQADAQEBAAAAAAAAAAAAAAACAwQBAAX/xAAtEQACAgICAQMDAgYDAAAAAAAAAQIRAyESMUEEIlETcYEyYRQjkbHh8EJSof/aAAwDAQACEQMRAD8Al4p4Jw1whlU2wN1txqO07VZeH4K3btrbtqFRRCgfrzM7mheI490Ay2muA7Ff8UThLzRmKEdVP5fvWp3Jvst4VtGnEbbgaDTp+c/lVR4n4pv2MQbZRWVQDJkEg8xy7bcjV+WH7jrzHqOtA8T4HbvAZlBI2MVxikjOFY1b1pbi6SPjPTvU91M2+/TkehFKfDnCrlh3LtOaIUe6m+w7/ven5tzrzrmjLKn4i4YFUuo5wfTlp6/jVIxS5XDESFYEjrBmut4/D+0tuh3IMdzuPrFcy4hhSWyqCWJgCjjtUKl3ZuLe6nWNQeqnf4c/nUmF1UHXTf5fv50QmENtLecyR5WPYzHyGn/TUWHcB45N+O4NTSg02j0IT5RTIby5bg10P7/frW3HOLeztJkAa4TGU7wdyFGp1ofjl3L0AkyTOg02HPl9aVXeLyYRMoYqrOQdiQJJMnvyruN1Ss1ySTt0SYO3e9kZItrmLErMgSNzPlHaY12ojEXDYtmSty7o5V1k20YE+Xo0ZWIjyhhtrleYz+UwNvO7+3vH3UIypI2b2ZnQd5kj50IXMRed7skBnLF22zHUmdyewn0osac7bJJzgnUUOcTijmze1dQ6mNSU0A+4My77QZ7Uix2MuMcpfQAAhHZkaPtHzEEnc/lFF8ZsqotqLuYezLDKFhSWYOoAOglZ357DkrW3HukH8fkfyp8YcewJStJR0gzhrRM8yJin3CHKHKetK+GWwFOusT+zTMpMOOY+opLnU7KYwvHxLLa2qQULgn0g7jSiHaKsTIao8esw9lrh8ugG7HYfqe1SLbXLnutkTvoT+gpg6D2WdYW3MLBGp00GveSfXnpSp5PERuPHe5C13USqiQu5PMjm3YdOe3UgvDWyDnbW4w8oP2R94jl2X17kRYe0FUXCNCf6afeP327DSPh2r27cIkZvM2rN0naANzpCqOnakq/yU6r9iXE4G3eR03dTox2BPJiOvPlt0FUvFFgxTKQykgr0I3ECrbaxRXKEXRJypOgJBBa4w99tT5RoJOtajCF3Nx4LtuYHLQbdtKGWSMNLbCjilPb0itYbhlx/e07c6bYLhSryE9edPsPg+1M8Lw+p3OUyhRhj6EmD4ZJ2qwYPhoHLlR2GwgFHWbetNx4/kTkzfACmAA5VOmFFGkVV+IeJPaO9nB5bjqYe4dbdsnYCNbjf2qYHMg6GhYvgnllfkO8QcXs4S3nuHUzlRRLuRyRefrsOZFco41jsdxNjCG3hwdFYkIDyzGJuNpsAY5Ab10l+GM5Juuzs29tDkXsHK65f7ST6VJYwNvTOQcogKvlRR0HQekk89tKI40ieU3I5Zb8DXCP+Z/4/5rK6w3E8vlFtYG2h/Wso+INfsEIgAgDSNAOUaachRIWaiVI7jkalZwoEkCSAJO5OwqMewHGN7I+0EnqoBObpoOfQ0dhsSGE6jqDuOxjY1s6z69aHa1BzLvt2PY1pnYRdXfvz/WtLL8tNOf6VvZcEflUWKU5TGkHQ/wCPXSuMomvMoUlj5Rqf31qqPZX2j3AILH5D/J1Pf0FbYW9euyHA0YxlmNPtMSYHOB+wZ7K3bKe2MhyQI2kDruabBJbYEk26QsxNgN5fvafHl9Y+BNKTgdP7l39AdP0q28dwa5A6AADQgbZW2PwP40nxBgrcH/UO+zfPf40vKrSkijBKm4sDxWF6ZWUiSD+vxpdh8GrBrbSO45QeVPzGQMAdD9J/Sk9x4uSBSh7p9lL45g8l2LhLZee2YchvM6fjW9zFHKFjUabDKo5BV2JG5P8AvWeKsV7TFNlMqIjpoNdu+b50X4a4E+KLBCVCxJiYLMAJ66n/AGimObjFCceOLk2+kK+fPffX8Bt1qRcGJXOhytsw6aCdRqBzG9dBwXgpQMxeIkZss+ZZB8sliCw5Cla8JuxPle0lwgwJLGJyw8EaGIMHep5ZpeEVpY3rX9CqX8I9i5lYyJ97kRyPy1+fSSbbuaFZ/uFT3LCm24mbaNKlpkCZy6DT7Q169qW4K5GVuhg+jevrRN84p+QHH6U3Hx2h9gMT5vUVZeH4MQHYhidQOQ/U1Srb5GjoZHoatXBcXAyk6Hbsf80acnCl4/sTyjGOS35/uC+MMI91VQe7mltekx6ifyo/wtw9rre1xHltIgVEBbIcv28hPugTA0nMexpjbw4aXuEC2DqT9o/dHbr8useY3FNchbYhB10k8jG8DkNNfp0ZKEbkFKDlKo/lgGIvnOWPvn6DkAKis4UsZb5eu80ywfDvietNMLw+p3OUuiqMIx7FeHwkaAUxwmAppYwdG28PWxxt9gTygVjCdqNt2QKnW3QHHOMWcMjPcYnKMxVBmaB2G3xiqI4iaWWwwJS7jvHcPg0z37gX7q7u0fdUan12HMiuZeJP4qXXlcInsl++8Nc+C+6nP73wqsYO0t1/aXrr37zPogJbOAAf6jtss6fOnRxk8snwdE4jiMXxG3r7SzYceW1bj2lxTs124dEUj7A66zTPw5wG7h9Zt2liAACYneNR5j1gn8j+GcaW4DbsqoupAuLyQkbntvpvpTXD4cJ5mJd+bNv8PujsKekl0Lbs1TDAaQXP923y2/GkHiizctuLyedgIK8o10H3YmQT6dJc47Hqgkn4darPH/FNuyJdwDyQasfgKI5FQx3FsS7syBgpO2mkaH6g1lKr/itsxyWLQWdMwE9ydOZ1+NZQWbyO2pKjaVO69O6/p8td8WBB0KzodP2KmVwdjUV9CD5RIPvLpB79j+P1EY83hjBH/byP0qOzcM6bayDuI9N6mQ6SNR+HUEda0uJrmX4jrWpmHrJsecVG98aIx8zTHwGvpU1q4GEg6afD9KrGNxea6XB2Pl9F2/X40UI8mDJ0OcFbVLkMIUgjoBOxgfvegRgwHbDXD5W1Rj9hxqrKeUjLrzYNyFF+0DqGHMbfiPgZrziVs3bYYe/bjfmBsT6SQTyV2NatWg3umbcMYlXtXBqsqw7HQ/Dp2rnvji9etxaVmVQTmKmCxEZdRqJUg/jtV89tnCXlnMoAfqRyJHUbHt6UN4mwmdPbIoa4oUQRI0aRKnQ/aH/UK6Ml0ZKL7OTEXXIFt8Q+mxLb9IDmfXStrnA7x1cEA6eZuvar/ikCQy7FQ6gdGE/nr8a0x+GzIG5ET+/SgeX9hqwp7s5pxXAvZZM0QRoRt/vTPgvFbmHcG2RlbytI+yxWdRqNuWoq0cZ4SuIsZdmBlT0J/L9KpWHsMtz2dzKjDQFtAemsRQzakrDxwpuL1fTOxcCupkLFs6ZUthmGhyLqTmJkkuRuR03NVXxpjzbuzaedE18sgxGaAsGQSPNO5iKRX+LmzlVPejVht3yz1HbnvW/BsFfxX/LQspaXZzAkExrz57DrUEIZOXJvXwWrFjUqvozjuNzWJXT2jRBAkRBYDmBmBO5iRQNrC+URM5QvxFXSx4KDsHvXNFEKi7DqSx1Y/LYU/wAHwm1a9xB67k/E1RFcY0vuKnJSm346Rz/BeH8RdCsVyQI825HoPzirJw3ww+WHfToBE/WrZbQVJat60yLkumJlxl2hZa4fBJYkiAIOwj7o2XTkNOfqTbwA6U0SzNS2bIUf2gc+XWa76fLbMeStIDsYQdKNtWYpV/8AFGC9stkYi2XYwIJKg9C6gqpnSCa1u8Tcs9t1NoqdcpBMT5SCRqG0ggDeN66fHHG2CnKbpDtiq7kD1pTxnxJas2y4BuRPlSAdBJJzEaQDrrQeNzu3l2OVVDgkS2pLKDrIyxudOVbNwiypW5kUsCdW/u3974jakfxUm/atGrEu5MTWvFtzEpKf0hsVUyw7F/0AqAL11/fOqfw/FrbxBZZW2zsI6Ascsjtp9auqjSvVg7RJlhxkct8W8H9hfIX3H8yenNfgfoRU3h2/N5LeHHsy7AG4/mOpEeVRyIzdok7VdvFvCvb4cge+hzKfT3h8Vn4xW3DsBa4clu62Qwv2gFZrktqCTvtA5Ze9ElsUWzgmGt4W2LajKN2Y7sT7zMTqSTrJpT4n8cWLAyqfaP0G3zqt+M/H6XrAt4cMLzHzswEIBuFn3idNY0E865251ljLHr+ZrbOssXFfGGIuuWWEEQDuQO3IH4Gq47kkkkkndiZJ+JrR3ryaGzLNorK1msrDD6KwN3VhqriJU7baRGnXbpTNTQqqDrHIQfwg1Hbdlkk+adjOUmfpP671N2VsKuJBJWATuOR9f1qHPzE9xzX1/WtrWIzaRB6foedRYheY0br17EcxWM1CfxPxi1bi37dLdxyPJIkqdDP3ZGx67Uoa5FQ8Z8IvjsURby2wQDeLAkL/AHLEZyQAADB0G0GCHv8AD8KosJbuYorobj3GA9AViQOWnxpqnDHG2xXGeSVRQx4Lipm311X1G4+I/CmaXcp69jsQdxVVsY2xdYC0HsXJ8qs4e2xGwDmCjTtmkdxvTn/iC3EDjRwSrrsQymGUg6gg8jQylGS5RY6EJRfGSCcpt3CQJtPzkHVhJVuckTvuc3UUZatlUG5Qro3MRvPoftfHSq3xrF3PZrldgA0kcp5Ej1FS3vE5t4ce8QSVyqI1IJJZtYXRtANTG+xCMk5BSg1Gz3iiC1dNttsodCOh0Kj/AE+T/uoe02jL9k6j5aj99aW4vHPethnUK6M40mAlyNP+k5B6z0qfg18hchiV5dd/pFKzqnaG4H7eL8HuEu++nof2Kh4rhrdy2ntEVhMd4mDBGoqO9di5KDOdfdOm8iW26jST2rwrccQxCLMwu/xY6/KK6GOcnZ2TLCKrsrvGuB2lHkzBuSzPyHL1OlO/CYxS2vY2VA6uRqBJIB+yurHXU60UmFRBMD4/md6uHDLbrZWLa2wRMQSx6HLpuI1JHaaokuK3sRBuVtOvFeWLsLwUjz37jXD0Zjl+U602CGeg6CtrXDgSLjuWymddeREKoG+vLXSjUAbbaY+Wn5Uhpvsoi4x0jTDYemNq1WWbUVpxHH27KF3MAfMnkAOZp0YCJzBfEfGbWDsm5dPZUHvO3RR+Z0Fcn/iDxm9iLtsOYtPZs3Uthsqj2iAkMY85D5xJ+7sK98bY25ibxuOdBConJV80x3mJPPTkAADhLtu7ZFjEpcy2QTav2oZ7SuZZHtkj2tvNrIIKkwNDFMpIW/08hK2FYTKMsiBrIM9OZ/Xpy6fw3xDks4P2rL7V7IDMQCxVXZbZk6QSGMxyqo2eEYQZ82IuXVQea0tp7RHP+o9wyomJyo2+le8avtnW64Q+0UIFyKcgUKqraJmAACN/rJpeZKUeICyqL0XzAcetDS7eGaTBBn07H0pf4h8WezssEt5rqqFYvk8nNS6hgRMyAQOVUDg3Drl1WFtyCuUnMMoOaIgjUGQRlGp5SdKIw2GuW7d25ntSxVSze0K6lpLhxqZjkfnU0PTqPbsd/EKT6Fq3CwkmSdSes610rAtmRT1AP0qicZFo3YsDyFUEgEB22ZlU+4Cdh8edXrh+gynkBV+MHO7SCgKrnFvCBxLZzeZiCQELDyryAHSI17dqs9b8OsKboJGpEAzG3I9dz8qKd1oVjrlsqH/wIoWCCY2YGCKq/HPCd2yZUF17DUeo513lcNptQnEeHeQws6Uj3R6KGsc9NUfORtEGCCD0Nbrars2I/h5buKL10tnYCUU+QA+7BiSwBHON/ShbH8PcOrAk3WH3Syx9FBPpmpkZryTvF/1dnJvZdj8q9rvtvhuUBbYQINFGRRA9BtWU3XyBwZ7w/C3rZbMwZCSYkyCT9nkPT9km2xcEMo05jUH4ECPyIPSiSf3rUd7TUb8xyP6HvUeim7B79zICSdtv80Hf4ipiDr+NLfEjh1IzsnXWI/Kqdf47ZsLkS690jaIMH/UdPlNCk5aQWo7ZfuJ4w2uGXbiGHu3CpPacn/tU/Oub5ulXhP62Fu4QmGPmtk/eEEj5ifi1c+uZ0Yo4KsNCDQepg7X2Helkqf3CrhoniGOZb9q5J/q2ka53ZHuWp9SLak9yTzoTA2muMEQZmPL8STsABqSdAKh424bEezXVLSiyDr5ihJdh2Nx3I7RWemg238G+qyJJfJdrEXbcNzH+x/OlmB8rm3cGhmenl1BHpEg9hWuA4jlQACTGvSjeEhrl0uSvlE7aGPsgc+Xz70xYpCnmj0H4fEYYZld8qC2R5Y16gAghxAM+tA3ltnE3LYRcgCMmuaA6hipPMqTHpFRDhCOmQgMBsdSIiNzrtz03oezwsWGzISQ0bkmPQnX51RCHEmnk5fcb3LQG1DXWAqRrkipuB4P2uIVSJRQXbuBsPixA9JpjFhuD4aUsG8zKt0gG0HIAXUeYzpmI2naQd9hrniy0mdAQ1wLmf3iARGbXdtaF8TYdXutcuPcC5wCqloUExmZhynWAetKPCl2w91w9q2sPBJIgD7TMziCJjnHzivOeZ5G0vGj1cWJQgk/O/wDWXPgl25iFW45ZUPurAGYcjGpA+OtHcS43aw5FsFWvECEnbMYUtG0mABzpDxLxeoezbsQ1u4xQ3xqJBysEUGRBI8xHMR1qi4/GLbuAZWu3bdw6ky2bNOaSCT5lHKda2+L47b+RUne60dZs4gplbE3JciQoEKAIkhRsokST86f5Ld22UZQyONQdiDsa5Zw/H3myPeIUN5n94TPvDIQSNwdY1rpPCMULlsGQSNDHUb/r6EUWDPym4/HQHqsfGKkjnHjnw+cPcES1ppyNzHVT3G46gdjVHxRyupYe70JEyOo5Gfka+gONYEX7D2m5jynow90/P6E1x/H8HzTpBEjuDzEc9ZqyStE+OSpxl0yxeBsZZvWP6ttc48iuyzmQMFXM3vEBtBMmIoXjPDrea22RQUIOUZvKC+bNqxjRiPWO0V7gdy3h2/8AqLVw/YDKfL7NmOfMJkESSIAkquo3pxxe4jqk3rZUEiWujNcyDQlFgroR7wnUjrKZJsTKEovoPwvhucxt3FW6wEtlYwTBZl+zqAc2XfUzEgVnj9o2rbItzZxlYXE8+pzHICGO+pAIBJHKaYWPFqIme2HW4uXKpJIbzEHMSSNFEwQfsjqQvwHA7mIuNcuSiOSw1BbUkhQJ8gE8wOwrowug4QafKWkb+B+Gm5d9oYypO+5Yj8t5q7rgDmAWSe1B8L4f7MrbtgAMQJPXqetP3xTW2KyCBAk6zzn5/hVMVSOnNydg9/hzruR6DWtcIsXLf+sR8fL+dFW8ULgdmnyLpHOgsWJQsvNT8DH6itBRYcRiwnv3FU9CVB+A3pPj+OoJy57h+IH1iPlVav2cxzAwQDGmpJjUnpA27elC2MUMxRyFZTqJ3EiCJ3Gv75QS9RJ/pRbHBFP3MMv8XxLNKXfZrPuqM3zzyB8AKy34mv22y3HBHJio+RgUPe0JK79Ov+ay7ZW4uv4bdfjU/wBSV7ZR9OKWkPbfH7xA0tH/AKW//qsqtfyjDQNoNprKLnL5M4L4LtxXjVnDrmvXFSRoD7zf6VGrfAVROPfxKJlcNaj++5+SKfxb4VVeI8Lu3HZzcLufeNwnN/3dPhAoK7we8LbXCohdxmExzIA3FWwjB+bIJ84+KNeK8XvX2LXbhftoF7QogULhBNxB1dB/5CoPaVLg2PtEgEnOsACSTIgADead10IbbOoPeinmA4PfxIBuWrRTk95TmjsEIdvU79aZ+FfDgtgXbwDXdwp1Fvp6t35cutWkPXSp9hptdCTDeF7aplBCTEm0irMdc2YntJMcqD/+XuC/9WTrPtCTJ3Oo3qy3b4Xc0K3GLaxnOWTAJ01PKstLRz5S2VfG/wAO0j+jfdT0uKrD5rlI+tKG4Pfw7IlxVnzEFSSrSdCDAI9CB7tdMs4lG2IqPH4QXBvDD3W6fDmNBp2B0IBouweigX8QIEaabjYxArQsrCG25/lNMOOcBuIj3AqsAcxKsABtLZHWBpJMEc4pDwvh5v2rb3XNq3clrVpYNy4u+czoixtO/wAqG67Cq+j0OoBiKsv8PrYKX7nPMq/9oJP/ALh8qrbcDS47W7Fy4txdkuqMtzsl1DlnQ+UwaffwsuNkxFu4pV0uKSD0ZYBHaUPyNdyUujnFx7FPi6y7e0QGBcVoIGukk7anVRt96qLj+FXP6dvQF4clwxYk+UI3s5mMsgkDdhyNda8S4HMo8oMMykHaLgKnbXmD8K5tjMDZspb/AKjMLdxgDJQTBfXys3vIQNAZY15t/TytfO6r9j0o1kxr+nYvwlnJbfMntWtXFdAraechNMmaRKLoDI0G9Xvh3hh3DYi+Gt50lrYgMCwBcZzJBnqdO1LuF3s99blm1bTDsqs5EAszDzZ7h80i4IgR6TXUeH8QS+SgK51BDqDOUnQkEgZtQRqPUV1xySaff+6F5OWKK4irhXh/Doi+zsgTqPaSzSf9Ux8KIwvC1w7syMxFxpy+XKmURC5QOXWTAHSnXD8ILWaXLT15AcqzEEnWdOlVxxqNOtkf1Zy7YMrVz3jyBMVdXlmzf94DH6sav6bmufeKLw/m7uuxUfJFn606ILNUCMIdQw70Tc4NbxPu2rSINS2RF1HdVzN86XFvrp86tDsFtIq6DUH/AKdT85n5dKNHKTXTK7/wRLbeRUlSfNCroOekn41N7UrEFfkSPnIo1rbOoVVJLwTHMbx6CPpUFy0RKEQR1+lac232FYTEgkGAGVhA7jUR8q9x9tn8wOsQZ12oDBYO5ccIo1Y6A/27mY0H+Ksd7g962MxZHXmBIK6a6n3xPode1cYK8C2RZABJPmL8hGwAOvP97S3TmP71qRlrQ1xlilE0AI1yg0BxLCq48wGmx0zKexjSj7DZFAIlIHqvp1Hbl9K2vJ6EHY8jXjt09HrLa2Vuw722hzKyYbWI78p/Sma2zEqdR+4P615jLAykDp+9u9QYPEFASykLpv8AZ9R++01z9xq9pIWXnvzk1lF+1t9vpXlYaKMbwtkYZWmSMp7Hv6UZfwvs8OzEgE6npIaPKO+tC8IuOmCttekeyBzSNlQ+XbfykD4UrxfH/wCZAyjLbU6Lzkfe76/WrsWL3fYnzZUoU+2uiscfwPsnzqPIx0H3TzH5j/FXb+DXh8MxxtwaIStoH7323+EwO5PSlV+2HQowkEf7R3rrXAeHrhsPasLtbQA6RLbufixJ+NVSVHnxGYvRSLxJ4mSyrSSIG32mJ2A/XsacIBBJ5VQv4vBWWzHvZm+Ua/WKVe6YxIWYH+Id1Lma7bU2iYhQcyTsZJ83fb4bUk8T8Ve9fz3X3Xypsqg6wOnruY9K84TwR8RKnyJoSx5wZhR8Brt60z8PcMw9whsRumhTkSORG5jzevOhy0mvgdibSsh4VjsV7VLqNd9mpWSxcqwmMoH25EjQadq6j4e437RgBcDqQTA3Xb4j0NU/+ew8extuu50fye8dBDAbbQOQFYOF3A6XLN9GuAaEOFcEHYkgi6vLzQfWpoylz10Pm8c477OovBHbQ/pVA4jw5bV+5de667G2QRlAWSqqGDEgIdjIOarxw1myKHy54GbLtMeaJ1iZihuL8Mt3UbOCRBJCxJgHYHn02quUeUSKD4S2UxOIQFFiT7VJYhTmzg+WDsOew5DWrF/Mi1xD2ekXEYMf7jlZf/L2vxcdaS8O4phkK3Lftbrrm9mbgVVXNOsLqdzoevpAd641xzcY+ctmnnI2I9IHyrMUHG7Dy5FNqi58cw5dHUQCykAnaY0rnfiHCO9q4Ftkr5XzKklmWGYdyZcGOfKK6NwrFrfta++BDjvyYdj9NqVPwS57YONApMEtoZJJ0111jao/WQnyjKKtplHpciUXFuilYrA4f+XTEMWC22DeytBSVLhIJ5K0qZidwKu/h+8rXA62wqXFVy+zMXh4aY+UcqL4b4ct2wwMQxkgDpqNT3nlTyxbVdh+/U0uHp8s2pS1Tv8AwdkzQScY7DbSzXmLUBZqD2sbVo7zvXp0QbAcRdW3ba4xhVBY+grjPiHFsy3Lkw7Z29CZP0mr7494oG/oWzIBm4R1Gy/A6nvA5Gucm0LrsHbJaRS91wJKoCBCg6FmZlRR95hymtSNYJ4SxqLd1ua3B5lPIjUHNsefzrpQxGa1EjQz6ggBvwB+fSueYTxXdseXCW7eHtjYKqs573LrDM5+Q6AbVd/CHi0Ywm3iUVniQwADEDfK24I3jUGNuuc67Qz6boMsPldZeDayqzAGQVESFHUbGfzFEYi7nfMudjzLsIAA0mPdHQGZiPU21wxvbQyobYXyPszKdojkOYM67dalxuCtoMq5lUn7IUyf7idfSj5LoCvJFwm6lsi6LgcrplAIJB05z0iO29OsZxhGtkIrSwjzACAd9jvSSzbVfdBmIkxPw6V6a2gWasagxJhWPRSfpUzCoMWfKe8D5kT9JrG6VnRVtIq/Ena9aGTPbfcrzgctI051NwW09q0AzZwdSOcHms/h+y3awJzDf9/OtcoMg715DeqR6yImQESDIOx/X98qDvW8s8xzH7/CjFBUyNZ3B2P6N35/UbXbYYSu0/EHoRyoOgrK5ftXAxCKMs6eeNDrsAYrynHsY0hdPSvKPmzOJyK7jbjCGuOVAAgsxEDYQTt2r3AYo22nkdx++Yoasr1keO3ZdOFY22b1lSwOe5bAA195wNem/Ou1Oa+auF4j2d63cOyXEb/tYH8q+lUGbbWdorpOzYgF3iPsyysNYZlCgnMAF3JgKZkRz0M7iudcWxq3w126gmSAjRKqNBqee/Pcmrxxm3a9qrPeRWUEZc51n72QGg0wq5S1q3h7iBpZrcPB/u1kH1qPLCU3V0v/AEqxvjuiiYLBMCBZe4uuwOYH0VpjTnR+G4birjsMIGf7V1iRbALbTIBYyG5cu9XBMKj+9bUd10orAcPXC3HxCyFZYu9wuoJEH3ZO3U1yxS/5O0ZOVsqWM4XiTCYqwApBAurBCmNM0EmNIk9aRri0sXSzqRcIYBk1IDgiCDpoCRvzX7tdzw9nPB5EVwDxPYU43ErbuA20vMqAttB1Cz9kHyjXkK5YKdrr4MTTaL5/DDiRY5GuO9wklg5Jjy/ZnlIroiHWuQfwoskYqTyDfGRH5iuvOIE8t6fjejM/6jk2FTKzqNldl+RIplbelOFvSSToWYn5kmjbb04QOcBfKkMrZWHP8j1Han+E8RW9ro9mTzglD+a/HTvVSw94SoM66ab0dxCw7gAALBPSu7OLtZdXGZGDDqpBHzFbgHvXLbmGe0c2vcjQj5UNe4hddhbQ3bjtoqAsSfhO3flQ0bZ1HH8Ss2v+ZcVT0mW+CjU/Kqpxfxb7QFLR9muxYnzn/SB7vrv6UBgPBrsA2JuezB//AB2oLfFz5QewB9af4fwrgEEm1nPW47t9CYHyobS8m0yo3GQg6/hVcxqn+VxOXf22Hz/6IxEfDOE+IWurW/DGBchf5W1rvErA9VIM1JY8DYW37X2efLdt5Htu5dCJBB8/mBBGnm5n1oYZIzTUXda/Jv6ZKz5+Iqy/w4tMcYhGwBJ7Aan9PjVl4l/DtFc+e4iztlDD4NI+oqyeFvDiWVItqwB9+43vGOXYdvxoZNy1Q9cVuyw4e5Fq2rI7Az5ljyRsTJnnyB9IrZrf2W1DbGNCO3Q1Fj0uK1u5bJy29GGWQykeaFkEmCBOsdNDRGHxaXJRoUQCvIjrPefpvTWkITf4FWIsFDG4Ox/I96iNNrjgsbbweh5HuD1H0NLcTZKGDqOR6/5ooyvRko1sgNaASwkaAEntOgn/AMvlUkVmFca9SdPQafqfjS80qibijciC5h4krt0/ShXSmmSNRqPw/X0rW7hw2o3/ABrzmj0FL5FgSR+5qEypkemux7N+vL8SbiHNGzVHcPWBOnz2n9aEOyP+Yt82jseVe1XL+Ex2Y5biZZ005cq8ouC+TtnLqyva8r1TyCXDWTcdUUSzsFA7sYH1Nd9xmKaxh7dgOSy20V35sVUA1xrwJaLY6xAmLgY9gOZ+ldZ4tJdj3NJyypUOwwt2yv4rWaqqY+7hr5uW3KXAdCDuOjD7Q7GrfiFpjwPBKgNw2w5ZTJIGnTepVpl0VehpwLjdq/hhiYCsDluoOTduxkEetHWeILcs3LdxcgjLmJBnNoCQNhVC8KWnRsQrAZLjAgDacx5ekVa7XD/Jlyl2aAuvM6CT0FN+q/At4I8bZZLiGzw+6hch7Vi4oYEz5UbIQesR3kVxVeFW3WFtbgeYzmk8weld2LEHTkAOxAHOhkwNsNnyrm32GlVRdeCJFU8DeGnw5N25ozDRdZE6ktI0Og0q143EjIyBhmYQBqYzaaxtpJ+Vb4h4UnoCfkJqq/zDM7ASfKTImdDBNZGKXRs5OTtirHcKBvQpIXNuon6EidelLuJObRynflGx79tudNcVfGYAfLWe4ipcHwhb1+X2CkkdIg7jY8p7mKJsxKwDhWFuKUe4rAvJSYiNAdNwfNpMfnTvFXSsGOQjp8Ki47wqxhrYu2w6qSoZQWIfNOWMx94GOe00uw3GVIMkNpuNRPXKRvWJnNDDVwSYjb5zsPT6VYeC8EtYSwDbWbjgF3b3jOsTyUToPjvrSrDILVg4i+CtpVzGF1K6bDTU9vieRYP4vwtzDG9afNDBPZkQ+Y6qpXlIBM7QD0rJNJHJNvQzweCLNLE78vwobi1u21wFCdPej3WI2jqRz5fki8ReJ75RDh7H9ICb4Lf1CI1W2BoY3mfNEQNZofi3xg90CzhwwRhBcTmcHkqjVRync/j5nqPq5GoYV32/j/JTBKPul48F74T4gW89wWWn2bQSCNe/cSCPh3q2cLxNwgl1OWJmI27c/hXMP4UYe7azPbs5iQQLl3MgWSpYBQvnmNwdIgxpPSMDibxlrjrH3Vgj5lVOm1dh9O8D9snS8fIM5c1tKxzbcMJFIOMcPe0/trZZk+2hJMDnE8vw9NKc4Rxy00ok16cJckTtUxGt8OgK7H5/4NQi3EE6gHfmvTX8O+h3ofHWPY3SoHkOoHY7j1H6U2wyrAMggjpoR0NY07CUtERRWAS5qD7j/p07ih8SpX+nc1U+6/4a8j9D9KYC2qjK2ttjoTup7/r/AL1s1sGbdwAryNdRnIreKtlTl5nQHr37H/HWh2SNBpEekdj0p/icH7MGW8v2TzHaf3+gN6zPrSMzdqyjFSWgaxdgw1ElCNRqOn6fpQrKdQR++1SYTERvt6/lSBx7iLAuCdo2P61V+E4241+7bce60KfQwQfx+NW6PtDY6kddPoe/7EV3DrcXbnud/wDFZR0Z1oV6/drKJ/lCNjXlDQfJHz1WVlbCvUPLLr/C2zrduEbBVB6bk/lV+t4gXgSBDqYYfej7S9aqf8NbQ/lWYbm4Z+AEU3xvARiAoLXFKtmUo5EHrGonvE1FKX8x2elCH8pV2FPhczAU+S2FssBvlgVvwbhwtoASzGN3JJPqTXvEMEbpCA5bYMmN2PT0rKrZqroS8Lwihhl1jc8ie1W3h5gEx6V7wrhy6IogDc1W+O8ZxWFum29u1pqrQ8MvIjz/AE5U7FBrYjPkT9qLYblQYzGJbGa4wUcp3PoNz8KolzxLiX0DKn+hR+LSR8DQ6szHMzFmO5Ykk+pOtUcfkmsecW4w17yKCtvpzb/VHLt+OkAqfsgkNMgjcH9xUeGts5yoJPM8h3NWDB4RLSHmT7zHc/oO1DKaiFGDkK7tgzLFR6e8dN9PwqXjOI/k0R3JUXFBCiAT0yv9mNM3qD5vcJVgjNOQEbnkCO8cvxrTj/DrN5LbXwWdSWyg+8hHlQzognK3WJ60CnfYThXQt4fZt4tVTIy2xmuP5iZMZd5IGh2Gu+uup3DvD1kNae1BVrgQjWJgtIkmSoU/LlVT4l4gxNxf5a1lLkkBbKwiLoMqAamIkueZPLZ3/D/D3Uxdm3euFzbFxwgPkRmQgn+54JE8pIG5orTZri4q2dI4pgrd2y9pxKOhQgdCI06aVwXi/CL2CvMXR8lp49plMODJXKdFYxrvpqK7/ceK5b/E3jRvTh0Ay5ocxOkDWeUTsNT6UOVxrZ3p4zbaiJ7XixDbAUGWBAJAGXuQCaC8FeFzdZrxYW7VufOxX7OpYM3lQDmx6xSwYVLIIkXUZfe8yESeU9xvBq13sODwrDojMq+a4UMQ7G7cC+0aIOXISBBEsZG1IxKMbrop9Q+ME2tjr/ieHeLaYolixAOS4UJSARmyREkag86b+HsKzXGtuxtsvKJzxzDE7cx2auWWF9hbZrbt5mOZlyzCbI5dQF1J92ZjloK6b4R9omHwzMp9oUuLJiVt5wyKdhpnKj4CiyYoNKRJzfaLX/I5RmJzQCQI3+O1F2LmYT/j6UIcRKlhMQflPaibDyoPblRY5R5VEyalVsB8R2pthuat9G0P1il/D8Tk0Pun6d6ccUE2n9PzFV4VShRYLdwbHUH9zQuKuBPeYnXy7z6f5/2pJxDxBbwlvNeYBSwC66yTqAOYiSelTWr63gLiMHVhoy7R26elJyS46G448nZvirrNuZHTp8K9sXB++VDrKHXUfhWFJGYe7Go5/Xb/ADUz3sppVQe9kNQGJw5nvz79qKwN8ER8KLuWwRFZR1tMSJiihiIHUxA6UVnzCVPIfEd/3pXt/DzIIE/jS9Ga2ddtuUDpWNBdjLOeh+lZUtp5AOmteVlGWfM1emvK9Ar0SA6X/Clpw9wdLv4qKvXD01rnv8Hbstes9Qrj4aH8q6TZQppUeSNTbL8crgkG5vhUV6+FBJ06mtGuRVH/AIh8du2vZhFm2W87fgv599q5WzW0lbOvcMVFtiCDOpI5ntQfiThtrE2yj6Eao43Q9fTqOfyI5l4a8TEKCjnLzH3e/p+Hps2xPEbpHkfTmCSfiCSaJZktUJeBt3YgxeBezdNt4kbEbMORB6UbgcMzmBp1PQdhzoEvBaXZizEgNqQecCZj0p1wzOFW4FK9yDHoZ2+NOjk5KvIEsfB32hzhrS2kiIH1J/M1HxByhCuP6jiVtblV5vcHIdF+ZgGp0xWntEANwCEDSVRj9oqPegbfuK1iLF257S7iHFnCq/mLnW8QdDcK6vJgLbXQaQpy1ij8muT8dDK1dDAa5gToBqXPw94d9vUa1vYD3GlIJDDznVVIP2f/ANj95yqepqDA2DdliGt2iNngXLgHO5H/AC1/9McpnfKpOLxwjJb0Tadp7DoK5RtnSlSPbz2rZuextqrXGJuOo3J3g+pJ6amKE8OnJjbLcizKf+tSB/5EVqDUdwEEMNCCCD0IMj605KhTbfZf+M27jWnW2wS4VIViJAPWP38dq4ricLiLl5sPbtsbisc6zt1d2OkHkTuDpNduwOJF20twbMNuh5j4GRVb8aO2Hw1+9aUe1ORQwEt5mCKdtSuckDrSZ41J2/A/0+aULjHyc+u+E8WlsZ0BUfatsWIHcFRMb6T+dPeN4zD2sNYw1xXtklMrWgHuW8sM0gnzoTuJ+0d9jVPD2IxFu97dbjBpkhrjH2oUyyuNSSRPvRGhmYqwXrf/ANwxDBoS05tJI0E6tqdBHlX50qVY4uSKJRlNqMgzh/D8MW9rcxLXhA/phConX78ZRrBFMV4k9y+EQ5QylUC/ZCgsMp6+UyYI806RAqV5jnPmkltYIjcRqDGwB6iKf+EED4h2LZSltioO/n8sjsF/94qdZZTkkFPBCEGy98OxiC2oOrjRhymTPqPSmFg6T1pFZt3CYSD1YnftEfnTmxIVZ3gTVWLvo8+caXZHxd4tN3gfWfwBqpcb4raw1v2lw/6VHvMeg/M8ql8e+KbWHi2DnugT7MHYkaZz9kRr1M/GuRcW4jcv3Dcutmbl0UdFHIVUgEjzj/EbmKuG5cPZVGyDov5nnUnhPxHcwN3SXssf6ludD/cv3WH150AahuiRFDKKa2EnW0d+4fct3rS3bbB7dwSCOnMRyI1BHalzpctXY3tsNDO3QHnzNc+/hN4m/lr/APK3m/o3WhSdkuHY9g2gPeD1rsd/CzrFTOFMfDJYuTDg+ZdNNQKNsv8AZbf9/Wo7aZDH06f4qa4QRQ0E2e3bOn4H9aCu4bMYI2+tGYS9Oh/frRPs9Nf9qygeVCX/AIcvf51lOPZ9q9reJvM+UwK3ArKyqyQ6f/B7wvf82OJVbORlUTLPBEkAe6BB31PTnXQL9znWVlJylOAV43E8h8aQ8TQXFYMAQdCDWVlT+S1JUc5v3GwmIKrqvT+1td+R/SrtwTiIe3nBOUDzDpG5H6fs5WUzKlSJMcnzcfBZ+A8BS+4cjkOmw1+v5VeMNgRbGUAbRy19a9rKLElQGWTsXYzgWpeyQrc0PuH05r9fhSDieBUurXgf6UlVJlVJ+1lGhbvykxuayso32ZDyLsbjS+g0Xp+v6UMr1lZTYim7ZIr1uGrKyjMHHhbifsn9mfdc/wDax0B9DEH4VaeI4JLyPauCVdSrDtzgjY9DWVlCzunor3DPBFiw2ZXZgplEYKFkkFTcKiXiB021muf3MQ+bEC6gH9d1aGMly3mMjQgt2+VZWVL6lez8lfpsknPb8AuFvoLecMZDDQiRBzR6bR8PSiPC2If+asXH9y4/sy4iWDlVGm48wQ69e1ZWVLh7/Jbl/S/sdltAKIUQKVeL+OjB4c3CMzk5ba8i5BIk8gBJPpAr2sr00eQcJxuIa47XHYs7sWZjuSTJNQGsrKI4jY1C7V5WVxwPfEiu4/w98YWruEtC68XQ3smGVjmbQKZAjzSpPQk8q8rKVPo2BYfFOOtYeybrgmCMoA1JO0chtz6VXuD+KLd+4Laq4Zts0QTvEg6VlZSmOh0WW0oga69p5UZZu8qysoV2cyfIOtZWVlECf//Z"
                                alt="Placeholder image"
                                />
                            </figure>
                            </div>
                            <div class="right-images">
                            <figure class="image">
                                <img
                                src="https://www.captainnickelsinn.com/wp-content/uploads/2020/11/bestMaineRestaurantsLobsterRoll.jpg"
                                alt="Placeholder image"
                                />
                            </figure>
                            <figure class="image">
                                <img
                                src="https://media-cdn.grubhub.com/image/upload/c_scale,w_1650/q_50,dpr_auto,f_auto,fl_lossy,c_crop,e_vibrance:20,g_center,h_900,w_800/v1534256595/Onboarding/Burger.jpg"
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
    for(i = 0; i < privateIn.length; i++) {
        if(privateIn[i].checked) {
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