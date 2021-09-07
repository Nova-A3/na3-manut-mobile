import firebase from "firebase/app";
import Database from "../db";
import store from "../store";
import { setDepartment, setFilter } from "../store/actions";
import { Na3Dpt } from "../types";
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

      firebase.auth().onAuthStateChanged(async (fbUser) => {
        const allDpts = await firebase
          .firestore()
          .collection("TEST-departments")
          .get();
        Database.setDepartments(allDpts.docs.map((d) => d.data() as Na3Dpt));

        store.dispatch(
          setFilter(
            "departments",
            Database.getDepartments()
              .filter((d) => d.isOperator())
              .map((d) => d.username)
          )
        );

        if (store.getState().auth.isSwapping) {
          return;
        }

        if (fbUser) {
          const department = Database.getDepartment(fbUser.email!);

          if (!department) {
            firebase.auth().signOut();
            return;
          }

          Fb.Firestore.registerRefreshTicketsListener(department);
          Fb.Firestore.registerRefreshProjectsListener();
          store.dispatch(setDepartment(department));
        } else {
          store.dispatch(setDepartment(null));
        }
      });
    }
  }
}

export default Fb;
