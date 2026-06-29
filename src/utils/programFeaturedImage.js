export function mergeTrainingDescriptionWithFeaturedImage(apiList, fallbackList, featuredImageUrl) {
  const list = Array.isArray(apiList) && apiList.length > 0 ? apiList : fallbackList;
  const localImage = fallbackList?.[0]?.featuredImage;
  const image = featuredImageUrl || localImage;
  return list.map((d) => ({
    ...d,
    featuredImageUrl: featuredImageUrl || "",
    featuredImage: image,
  }));
}

export function resolveTrainingFeaturedImage(trainingDescription, featuredImageUrl) {
  const card = trainingDescription?.[0];
  if (!card) return "";
  return featuredImageUrl || card.featuredImageUrl || card.featuredImage || "";
}
