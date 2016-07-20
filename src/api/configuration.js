import * as request from './request';
import { transformUser } from './transformers';

/**
 * GET /config.json (local)
 * GET /version.json (local)
 * GET /rest/version
 *
 * Get the configuration, like the root url of the API.
 */
export async function getConfiguration () {
  const configuration = (await request.get(null, '/config.json')).body;
  const version = (await request.get(null, '/version.json')).body;
  const { body: { apptvateVersion, spottVersion } } = await request.get(null, `${configuration.urls.api}/version`);
  return { apptvateVersion, spottVersion, version, ...configuration };
}

export async function login (baseUrl, { email: emailIn, password }) {
  try {
    const { body } = await request.post(null, `${baseUrl}/v003/security/login`, { userName: emailIn, password });
    return {
      authenticationToken: body.authenticationToken,
      user: transformUser(body.user)
    };
  } catch (error) {
    if (error.body.message === 'verkeerde gebruikersnaam/password combinatie') {
      throw 'Email/password combination is incorrect.';
    }
    throw error.body.message;
  }
}

export async function loginFacebook (baseUrl, { facebookAccessToken }) {
  try {
    const { body } = await request.post(null, `${baseUrl}/v003/security/login`, { facebookAccessToken });
    return {
      authenticationToken: body.authenticationToken,
      user: transformUser(body.user)
    };
  } catch (error) {
    if (error.body.message === 'verkeerde gebruikersnaam/password combinatie') {
      throw 'Your Facebook account is not linked to a Spott account. You can create an account on Spott by using your Facebook account.';
    }
    throw error.body.message;
  }
}

export function register (baseUrl, { email, firstname, lastname, password }) {
  return request.post(null, `${baseUrl}/v003/user/users/register/username`, { email, firstName: firstname, lastName: lastname, password });
}