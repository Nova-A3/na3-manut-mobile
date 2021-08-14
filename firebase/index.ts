import firebase from "firebase/app";
import Database from "../db";
import store from "../store";
import { setDepartment } from "../store/actions";
import FbAuth from "./FbAuth";
import FbFirestore from "./FbFirestore";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAynKF5joA-_wpax9jzatonSZgxSE-MaRQ",
  authDomain: "nova-a3-ind.firebaseapp.com",
  projectId: "nova-a3-ind",
  storageBucket: "nova-a3-ind.appspot.com",
  messagingSenderId: "810900069450",
  appId: "1:810900069450:web:1c84966ee298b9c8c59ab3",
  measurementId: "G-04P7RVKWBN",
};

export class Fb {
  static Auth = new FbAuth();
  static Firestore = new FbFirestore();
  static Fs = Fb.Firestore;

  static init() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(FIREBASE_CONFIG);

      firebase.auth().onAuthStateChanged((fbUser) => {
        if (store.getState().auth.isSwapping) {
          return;
        }

        if (fbUser) {
          const department = Database.getDepartment(fbUser.email!)!;
          Fb.Firestore.registerRefreshTicketsListener(department);
          store.dispatch(setDepartment(department));
        } else {
          store.dispatch(setDepartment(null));
        }
      });
    }
  }
}

export default Fb;
