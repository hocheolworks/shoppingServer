export const getLocation = (imageFullPath: string): string => {
  const splitArray = imageFullPath.split('/');
  if (splitArray.length >= 4) {
    return splitArray.splice(3).join('/');
  } else {
    return null;
  }
};
