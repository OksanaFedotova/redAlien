// import bridge from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge-mock';

bridge.send('VKWebAppInit', {});

const setData = (key, value) => {
  const strValue = JSON.stringify(value);
  if (bridge) {
    try {
      bridge.send('VKWebAppStorageSet', {
        key,
        strValue,
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    localStorage.setItem(key, strValue);
  }
};
const getData = async (keys) => {
  return (await bridge.send('VKWebAppStorageGet', { keys })).keys;
  // bridge
  //   .send('VKWebAppStorageGet', {
  //     keys,
  //   })
  //   .then((data) => {
  //     console.log('i am', data);
  //     if (data.keys) {
  //       console.log(data.keys);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log('i am', error);
  //   });
};
export { setData, getData };
