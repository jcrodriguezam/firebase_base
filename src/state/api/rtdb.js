import firebase from 'firebase.js';

const getRealTimeRef = (path) => firebase.database().ref(path);

export const fetchDocument = async (collection, id) => {
  const document = (
    await getRealTimeRef(`${collection}/${id}`).once(`value`)
  ).val();

  return document ? { id, ...document } : null;
};

export const fetchCollection = async (collection, options = {}) => {
  console.log('Entro a fetch collection');
  console.log('collection', collection);
  console.log('options', options);
  let baseQuery = getRealTimeRef(collection);
  console.log('--> 1');
  
  console.log('Antes de netrar');
  if (options.filterBy) {
    console.log('ENTROOO !!!!');
    const { filterBy, value } = options;
    baseQuery = baseQuery.orderByChild(filterBy).equalTo(value);
  }
  console.log('Despues del if');
  console.log('--> 2');
  console.log('baseQuery', baseQuery);

  // const fetchedCollection = await baseQuery.once('value').then((res) => {console.log('res', res);}).catch((err) => {console.log('err', err);});
  const fetchedCollection = (await baseQuery.once('value')).val();
  console.log('--> 3');
  
  const data = fetchedCollection
  ? Object.entries(fetchedCollection).map(([key, value]) => ({
    id: key,
    ...value,
  }))
  : [];
  
  console.log('--> 4');
  return data;
};

export const deleteDocument = (collection, id) => {
  return getRealTimeRef(`${collection}/${id}`).remove();
};

export const createDocument = (collection, id, values) => {
  return getRealTimeRef(`${collection}/${id}`).set(values);
};

export const updateDocument = (collection, id, values) => {
  return getRealTimeRef(`${collection}/${id}`).update(values);
};
