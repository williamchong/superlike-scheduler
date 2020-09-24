export default ({ _req, res, _route, store, error }) => {
  if (!store.getters.getUserId) {
    error({
      statusCode: 401,
      message: 'LOGIN_NEEDED',
    });
  } else if (process.server) {
    res.set('Cache-Control', 'private');
    res.set('Vary', 'Cookie');
  }
};
