import { createAction } from 'redux-act';
import { toastr } from 'react-redux-toastr';

import { firebaseError } from 'utils';
import firebase from 'firebase.js';
import { checkUserData, AUTH_UPDATE_USER_DATA } from './auth';
import {
  fetchCollection,
  fetchDocument,
  createDocument,
  deleteDocument,
  updateDocument,
} from '../api';

export const USERS_FETCH_DATA_INIT = createAction('USERS_FETCH_DATA_INIT');
export const USERS_FETCH_DATA_SUCCESS = createAction(
  'USERS_FETCH_DATA_SUCCESS'
);
export const USERS_FETCH_DATA_FAIL = createAction('USERS_FETCH_DATA_FAIL');

export const USERS_DELETE_USER_INIT = createAction('USERS_DELETE_USER_INIT');
export const USERS_DELETE_USER_SUCCESS = createAction(
  'USERS_DELETE_USER_SUCCESS'
);
export const USERS_DELETE_USER_FAIL = createAction('USERS_DELETE_USER_FAIL');

export const USERS_CREATE_USER_INIT = createAction('USERS_CREATE_USER_INIT');
export const USERS_CREATE_USER_SUCCESS = createAction(
  'USERS_CREATE_USER_SUCCESS'
);
export const USERS_CREATE_USER_FAIL = createAction('USERS_CREATE_USER_FAIL');

export const USERS_MODIFY_USER_INIT = createAction('USERS_MODIFY_USER_INIT');
export const USERS_MODIFY_USER_SUCCESS = createAction(
  'USERS_MODIFY_USER_SUCCESS'
);
export const USERS_MODIFY_USER_FAIL = createAction('USERS_MODIFY_USER_FAIL');

export const USERS_CLEAN_UP = createAction('USERS_CLEAN_UP');

export const USERS_CLEAR_DATA_LOGOUT = createAction('USERS_CLEAR_DATA_LOGOUT');

export const fetchUsers = (userId = '') => async (dispatch, getState) => {
  dispatch(checkUserData());
  
  dispatch(USERS_FETCH_DATA_INIT());
  
  if (userId) {
    let user;
    try {
      user = await fetchDocument('users', userId);
    } catch (error) {
      toastr.error('', error);
      return dispatch(USERS_FETCH_DATA_FAIL({ error }));
    }
    
    if (!user) {
      const errorMessage = 'User not available';
      toastr.error('', errorMessage);
      return dispatch(USERS_FETCH_DATA_FAIL({ error: errorMessage }));
    }
    
    const users = getState().users.data;
    users.push(user);
    
    return dispatch(
      USERS_FETCH_DATA_SUCCESS({
        data: users,
      })
      );
    }
    
    const { id } = getState().auth.userData;    
    let users;
    
    try {
      users = await fetchCollection('users');
  } catch (error) {
    toastr.error('', error);
    return dispatch(USERS_FETCH_DATA_FAIL({ error }));
  }

  return dispatch(
    USERS_FETCH_DATA_SUCCESS({
      data: users.filter((user) => user.id !== id),
    })
  );
};

const deleteLogo = (oldLogo) => {
  if (!oldLogo.includes('firebasestorage')) {
    return null;
  }

  const storage = firebase.storage();
  const storageRef = storage.ref();
  const logoPath = oldLogo.split('users%2F').pop().split('?alt=media').shift();
  const logoRef = storageRef.child(`users/${logoPath}`);
  return logoRef.delete();
};

export const deleteUser = (id) => async (dispatch, getState) => {
    dispatch(USERS_DELETE_USER_INIT());
    const { locale } = getState().preferences;
    const { logoUrl } = getState()
      .users.data.filter((user) => user.id === id)
      .pop();

    const deleteLogoTask = logoUrl ? deleteLogo(logoUrl) : null;

    const deleteUserTask = deleteDocument('users', id);

    try {
      await Promise.all([deleteLogoTask, deleteUserTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_DELETE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'The user was deleted.');
    return dispatch(USERS_DELETE_USER_SUCCESS({ id }));
  };

export const clearUsersDataLogout = () => (dispatch) => {
    dispatch(USERS_CLEAR_DATA_LOGOUT());
  };

const uploadLogo = (uid, file) => {
  const storageRef = firebase.storage().ref();

  const fileExtension = file.name.split('.').pop();

  const fileName = `${uid}.${fileExtension}`;

  return storageRef.child(`users/${fileName}`).put(file);
};

const getLogoUrl = (uid, file) => {
  const storageRef = firebase.storage().ref();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uid}.${fileExtension}`;
  return storageRef.child(`users/${fileName}`).getDownloadURL()
    .then((url) => url);
};

export const createUser = ({
  name,
  email,
  location,
  file,
  createdAt,
  isAdmin,
}) => async (dispatch, getState) => {
    dispatch(USERS_CREATE_USER_INIT());
    const { locale } = getState().preferences;

    let response;
    try {
      const createUserAuth = firebase
        .functions()
        .httpsCallable('httpsCreateUser');

      response = await createUserAuth({ email, isAdmin });
    } catch (error) {
      const errorMessage = firebaseError(error.message, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    const { uid } = response.data;

    let uploadLogoTask = null;
    let logoUrl = null;
    if (file) {
      logoUrl = await getLogoUrl(uid, file);
      uploadLogoTask = uploadLogo(uid, file);
    }
    const userData = { name, email, location, logoUrl, createdAt, isAdmin };

    const createUserDbTask = createDocument('users', uid, userData);

    const actionCodeSettings = {
      url: process.env.REACT_APP_LOGIN_PAGE_URL,
      handleCodeInApp: true,
    };

    const sendSignInLinkToEmailTask = firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings);

    try {
      await Promise.all([
        uploadLogoTask,
        createUserDbTask,
        sendSignInLinkToEmailTask,
      ]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'User created successfully');
    return dispatch(USERS_CREATE_USER_SUCCESS({ user: response.data }));
  };

const replaceLogo = async (id, file) => {
  const storageRef = firebase.storage().ref();
  const fileExtension = file.name.split('.').pop();

  const files = await storageRef.child('users').listAll();

  // Delete old file
  const fil = files.items.filter((f) => f.name.startsWith(id) );
  if (fil && fil[0].length) {
    await storageRef.child(fil[0].fullPath).delete();
  }

  // Upload new file
  const fileName = `${id}.${fileExtension}`;
  await storageRef.child(`users/${fileName}`).put(file);

  // Get download url
  const newLogoUrl = await storageRef.child(`users/${fileName}`).getDownloadURL();
  return newLogoUrl;
};

export const modifyUser = ({
  name,
  surname1,
  surname2,
  phone,
  isAdmin,
  file,
  id,
  isEditing,
  isProfile,
}) => async (dispatch, getState) => {
    dispatch(USERS_MODIFY_USER_INIT());
    const user = isProfile
      ? getState().auth.userData
      : getState().users.data.find((thisUser) => thisUser.id === id);
    const { logoUrl } = user;
    let newLogoUrl = null;
    if (file) {
      newLogoUrl = await replaceLogo(id, file);
    }
    const userData = {
      name,
      surname1,
      surname2,
      phone,
      isAdmin: isAdmin || user.isAdmin,
      logoUrl: newLogoUrl || logoUrl,
    };

    await updateDocument('users', id, userData);
    const { uid } = firebase.auth().currentUser;

    if (id === uid) {
      dispatch(AUTH_UPDATE_USER_DATA({ ...userData, id }));
    }

    if (isProfile) {
      toastr.success('', 'Perfil actualizado correctamente');
    } else if (isEditing) {
      toastr.success('', 'Usuario actualizado correctamente');
    }

    return dispatch(USERS_MODIFY_USER_SUCCESS({ user: userData, id }));
  };

export const usersCleanUp = () => (dispatch) => dispatch(USERS_CLEAN_UP());
