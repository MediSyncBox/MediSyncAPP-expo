module.exports = function(api) {
  api.cache(true);
  return {
    // presets: ['module:metro-react-native-babel-preset', 'babel-preset-expo'],
    presets: [['module:metro-react-native-babel-preset', {
      unstable_disableES6Transforms: true
    }]],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
        [
          "@babel/plugin-proposal-decorators",
          {
            legacy: true,
          },
        ],
        ["@babel/plugin-proposal-optional-catch-binding"],
      ],
  };
};
// module.exports = {
//   presets: [['module:metro-react-native-babel-preset', {
//        unstable_disableES6Transforms: true
//    }]],
// };
//
//module.exports = function(api) {
//  api.cache(true);
//  return {
//    presets: ['babel-preset-expo'],
//    env: {
//      production: {
//        plugins: ['react-native-paper/babel'],
//      },
//    },
//  };
//};