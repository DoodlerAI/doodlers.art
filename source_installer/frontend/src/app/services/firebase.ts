import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBXnT34essdmlVSsgXw-01VK5z0Vlv--k",
  authDomain: "doodle-fdea3.firebaseapp.com",
  projectId: "doodle-fdea3",
  storageBucket: "doodle-fdea3.appspot.com",
  messagingSenderId: "753995468672",
  appId: "1:753995468672:web:0b819fc6a9b1404890bb65",
  measurementId: "G-Y5246C37ST"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
export const auth = getAuth();


export const signUpWithGmail = async () => {
  return signInWithPopup(auth, provider)
    // .then((result) => {
    //   console.log('result', result)
    //   return Promise.resolve(result.user);
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   console.log('credential ===========================', credential)
    //   const token = credential.accessToken;
    //   // The signed-in user info.
    //   const user = result.user;
    //   // ...
    // }).catch((error) => {
    //   console.log('error', error)
    //   return Promise.resolve(error);
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // The email of the user's account used.
    //   const email = error.customData.email;
    //   // The AuthCredential type that was used.
    //   const credential = GoogleAuthProvider.credentialFromError(error);
    //   // ...
    // });
}


// export const getMembers = async (accessToken) => {
//   try {
//     const res = await axios.get(`${url}/api/users`, {
//       headers: { Authorization: accessToken }
//     });
//     return Promise.resolve(res.data);
//   }
//   catch (err) {
//     return Promise.reject(err.response?.data?.msg);
//   }
// }