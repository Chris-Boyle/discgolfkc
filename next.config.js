const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        GOOGLE_MAPS_API_KEY: 'AIzaSyA07CFdDfGAJpznV70OmZqcMa2lJozIRhQ',
      },
    };
  }
  return {
    defaultConfig,
  };
};
