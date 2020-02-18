module.exports = function(data) {
  const badWindowsCharacters = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
  const bWc = badWindowsCharacters;
  const splitCharacters = data.split('');
  const filterNonNtfs = splitCharacters.filter(f => !bWc.includes(f));
  const joinedString = filterNonNtfs.join('');
  return joinedString;
};
