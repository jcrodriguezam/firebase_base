/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers';

import paths from 'pages/Router/paths';
import { usersCleanUp } from 'state/actions/users';
import { useFormatDate, useFormatMessage, useFormatBool} from 'hooks';
import ErrorMessage from 'components/ErrorMessage';

import './UserForm.scss';

const InputLabel = ({ text }) => (
  <div className="field-label is-normal">
    <label className="label is-inputLabel">
      {text}&nbsp;
    </label>
  </div>
);

const Input = ({ errors, name, register, readOnly }) => (
  <>
    <div className="field">
      <InputLabel text={useFormatMessage(`UserForm.${name}`)} />
      <div className="field-body">
        <div className="field">
          <div className="control">
            <input
                readOnly={readOnly}
                name={name}
                id={name}
                className={classNames('input', {
                  'is-danger': errors[name],
                  'is-mutted': readOnly,
                  'is-bold': !readOnly
                })}
                ref={register}
                type="text"
              />
          </div>
        </div>
      </div>
    </div>
    {errors[name] && (
      <div className="field is-horizontal">
        <div className="field-label is-normal" />
        <div className="field-body">
          <ErrorMessage />
        </div>
      </div>
    )}
  </>
);

const UserForm = ({ isEditing, isProfile, user, onSubmitHandler, schema }) => {
  const { loading, success } = useSelector(
    (state) => ({
      loading: state.users.loading,
      success: state.users.success,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const { register, handleSubmit, errors, watch, setValue } = useForm({
    defaultValues: { ...user },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success) {
      setValue('file', null);
    }
    return () => dispatch(usersCleanUp());
  }, [dispatch, success, setValue]);

  // const invalidEmailMessage = useFormatMessage('UserForm.invalidEmail');

  const imagePreviewUrl =
    watch('file') && watch('file')[0]
      ? URL.createObjectURL(watch('file')[0])
      : user.logoUrl;

  const goBackMessage = useFormatMessage('UserForm.goBack');

  const pickAnotherFileMessage = useFormatMessage('UserForm.pickAnotherFile');
  const pickFileMessage = useFormatMessage('UserForm.pickFile');

  // const emailMessage = useFormatMessage('UserForm.email');

  const adminMessage = useFormatMessage('UserForm.admin');

  return (
    <>
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          <div className="card tile" style={{maxWidth: '520px'}}>
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <i className="mdi mdi-account-edit default" />
                </span>
                {useFormatMessage('UserForm.userInfo')}
              </p>
            </header>
            <div className="card-content">
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                {imagePreviewUrl && (
                  <>
                    <div className="is-user-avatar image has-max-width is-aligned-center">
                      <img
                        className="user-avatar"
                        src={imagePreviewUrl}
                        alt="User profile logo preview"
                      />
                    </div>
                    <hr />
                  </>
                )}

                <div className="columns is-gapless mb-2">
                  <div className="column is-half mr-2">
                    <Input errors={errors} name="name" register={register}/>
                  </div>
                </div>

                <div className="columns is-gapless mb-2">
                  <div className="column mr-2">
                    <Input errors={errors} name="surname1" register={register}/>
                  </div>
                  <div className="column ml-2">
                    <Input errors={errors} name="surname2" register={register}/>
                  </div>
                </div>

                <div className="columns is-gapless mb-2">
                  <div className="column mr-2">
                    {isEditing ? (
                      <Input errors={errors} name="email" register={register} readOnly/>
                      ) : (
                      <Input errors={errors} name="email" register={register}/>
                    )}
                    </div>
                  <div className="column ml-2">
                    <Input errors={errors} name="phone" register={register}/>
                  </div>
                </div>

                <div className="columns is-gapless mb-2">
                  <div className="column mr-2">
                    <div className="field is-vertical">
                      <InputLabel text={useFormatMessage('UserForm.created')} />
                      <div className="control is-clearfix" data-testid="date">
                        <p className="date is-mutted">
                          {useFormatDate(watch('createdAt'), {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="column ml-2">
                    <div className="field is-vertical">
                      <InputLabel text={useFormatMessage('UserForm.userType')} />
                      <div className="field-body">
                        {!isProfile ? (
                          <div className="field has-check is-horizontal mt-2">
                            <div className="field-label">
                              <label className="label">{adminMessage}</label>
                            </div>
                            <div className="field-body">
                              <div className="field">
                                <div className="field">
                                  <div className="control">
                                    <label className="b-checkbox checkbox">
                                      <input
                                        type="checkbox"
                                        name="isAdmin"
                                        ref={register}
                                      />
                                      <span className="check is-primary" />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="field">
                            <div className="control">
                              <p className="is-mutted">
                                {useFormatBool(watch('isAdmin'), {
                                  true: 'Administrador',
                                  false: 'Estandard',
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label">
                      {useFormatMessage('UserForm.picture')}
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="file has-name">
                        <label className="file-label">
                          <input
                            className="file-input"
                            type="file"
                            name="file"
                            ref={register}
                            accept="image/*"
                          />
                          <span className="file-cta">
                            <span className="file-icon">
                              <i className="mdi mdi-upload" />
                            </span>
                            <span className="file-label">
                              {watch('file') && watch('file').file
                                ? pickAnotherFileMessage
                                : pickFileMessage}
                            </span>
                          </span>
                          <span className="file-name">
                            {watch('file') && watch('file')[0]?.name}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
                
                <div className="field is-horizontal container">
                  <div className="field-body">
                    <div className="field">
                      <div className="field is-grouped is-justify-content-center">
                        <div className="control buttons">
                          {!isProfile && (
                            <Link to={paths.USERS} className="button mr-2">
                              {goBackMessage}
                            </Link>
                          )}
                          <button
                            type="submit"
                            className={`button is-primary ${
                              loading && 'is-loading' 
                            }`}
                          >
                            <span>{useFormatMessage('UserForm.submit')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

UserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    surname1: PropTypes.string,
    surname2: PropTypes.string,
    phone: PropTypes.string,
    logoUrl: PropTypes.string,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  schema: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  isProfile: PropTypes.bool,
};

UserForm.defaultProps = {
  isEditing: false,
  isProfile: false,
};

export default UserForm;
