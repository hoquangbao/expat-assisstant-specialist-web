
import firebase from 'firebase/app';
import "firebase/auth"
import auth from './FirebaseUtil'

export const register = async ({ email, password }) => {
  const resp = await firebase.auth()
    .createUserWithEmailAndPassword(email, password).catch(error => {
      return error.message
    });
}

export const login = async ({ email, password }) => {
  const res = await firebase.auth()
    .signInWithEmailAndPassword(email, password);
  return res.user;
}
