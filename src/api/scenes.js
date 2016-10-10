import { del, get, post, NotFoundError, UnauthorizedError, UnexpectedError } from './request';
import { transformScene, transformShare } from './transformers';

export async function getNewScenesForYou (baseUrl, authenticationToken, locale, { userId }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/user/users/${userId}/scenes?pageSize=20`);
  return data.map(transformScene);
}

export async function getSavedScenesOfUser (baseUrl, authenticationToken, locale, { userId }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/user/users/${userId}/savedScenes?pageSize=20`);
  return { data: data.map(transformScene) };
}

export function getMediumNewScenesForYou () {
  return []; // TODO: implement this
}

export async function getMediumScenes (baseUrl, authenticationToken, locale, { mediumId: mediumUuid }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/media/media/${mediumUuid}/scenes`);
  return data.map(transformScene);
}

export async function getScene (baseUrl, authenticationToken, locale, { sceneId }) {
  try {
    const { body: sceneBody } = await get(authenticationToken, locale, `${baseUrl}/v003/video/scenes/${sceneId}?includeMedium=true`);
    const scene = transformScene(sceneBody);
    // Extend the scene with share information (title, description and image).
    const { body: shareShareBody } = await get(authenticationToken, locale, `${baseUrl}/v003/video/scenes/${sceneId}/share`);
    scene.share = transformShare(shareShareBody);
    return scene;
  } catch (error) {
    switch (error.statusCode) {
      case 403:
        throw new UnauthorizedError();
      case 404:
        throw new NotFoundError('scene', error);
    }
    throw new UnexpectedError(error);
  }
}

export async function saveScene (baseUrl, authenticationToken, locale, { sceneId, userId }) {
  await post(authenticationToken, locale, `${baseUrl}/v003/user/users/${userId}/savedScenes`, { uuid: sceneId });
}

export async function removeSavedScene (baseUrl, authenticationToken, locale, { sceneId, userId }) {
  await del(authenticationToken, locale, `${baseUrl}/v003/user/users/${userId}/savedScenes`, { uuid: sceneId });
}
