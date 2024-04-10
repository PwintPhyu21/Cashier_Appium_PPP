require('./helpers/date');

/**
 * get on call person
 * @param {import('./index').Schedule} schedule 
 */
function getOnCallPerson(schedule) {
  const layer = getLayer(schedule.layers);
  return getLayerUser(layer);
}

/**
 * @param {import('./index').Layer[]} layers 
 */
function getLayer(layers) {
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    if (!layer.start && !layer.end) {
      return layer;
    }
    const current_time = new Date().toLocaleTimeString('en-US', { hour12: false });
    if (!layer.start && current_time < layer.end) {
      return layer;
    }
    if (!layer.end && current_time > layer.start) {
      return layer;
    }
    if (current_time < layer.end && current_time > layer.start) {
      return layer;
    }
  }
}

/**
 * @param {import('./index').Layer} layer
 */
function getLayerUser(layer) {
  if (layer.user) {
    return layer.user;
  }
  const rotation = layer.rotation;
  const today = new Date();
  switch (rotation.every) {
    case 'day':
      return getUser(rotation.users, today.getDOY() % rotation.users.length);
    default:
      return getUser(rotation.users, today.getWOY() % rotation.users.length);
  }
}

/**
 * @param {import('./index').User[]} users 
 * @param {number} index 
 */
function getUser(users, index) {
  let count = 0;
  while (count < users.length) {
    const user = users[index];
    if (user.enable === false) {
      index = (index + 1) % users.length;
      count++;
    } else {
      return user;
    }
  }
  return users[index]
}

module.exports = {
  getOnCallPerson
}