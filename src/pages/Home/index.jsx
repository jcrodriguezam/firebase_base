import React from 'react';

import { useFormatMessage } from 'hooks';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { fetchUsers } from 'state/actions/users';



const Home = () => {
  const { userData } = useSelector(
    (state) => ({
      userData: state.auth.userData,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const hacerAlgo = async () => {
    console.log('ole ole');
    console.log('userData', userData);
    const users = await dispatch(fetchUsers(userData.id));
    console.log('users', users);
  };

  const onSubmitHandler = async (value) => {
    console.log('value', value);
    const newValue = {
      ...value,
      file: value && value.file && value.file[0] || null,
      id: userData.id,
    };
    console.log('newValue', newValue);
    // dispatch(uploadFile(newUser));
  };
let register;
  return (
  <>
    <section className="hero is-hero-bar">
      <div className="hero-body">
        <h1 className="title">{useFormatMessage('Home.home')}</h1>
      </div>
    </section>

    <section className="section is-main-section">
      {useFormatMessage('Home.content')}
      <br />
      <button onClick={ () => hacerAlgo() }>Subir cancion</button>
      <form onSubmit={() => onSubmitHandler(onSubmitHandler)}>
        <input type="file" name="file" ref={register}/>
        <button
          type="submit"
          className="button is-primary"
        >
          <span>{useFormatMessage('UserForm.submit')}</span>
        </button>
      </form>

    </section>
  </>
);
};

export default Home;
