export const viewConvertor = (totalView) => {
  if (totalView >= 1000000) {
    return Math.floor(totalView / 1000000) + "M";
  } else if (totalView >= 1000) {
    return Math.floor(totalView / 1000) + "K"; // Divide by 1000 for thousands
  } else {
    return totalView;
  }
};
