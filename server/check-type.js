var checkType = function (str) {
  var types = [
    'image/png',
    'image/jpeg',
    'image/gif'
  ];
  if (types.indexOf(str) !== -1) return true;
  return false;
};

module.exports = checkType;
