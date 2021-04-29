/**
 * The function to get url for LINE login api. Caller should generate and keep 
 * a random string "state" and "nonce" which will later be used in server api to
 * get information of login result.
 * 
 * @param {Object} body Object containing:
 *   - redirect_uri: Callback URL registered with the LINE Developers Console.
 *                   This should be a server api.
 *   - state: A unique alphanumeric.
 *   - nonce: A string used to prevent replay attacks (opens new window).
 *            This value is returned in an ID token.
 *
 * @returns {String} Url to access LINE login api.
 */


let get_line_login_url = function(body) {
  let url = "https://access.line.me/oauth2/v2.1/authorize?";
  url += "response_type=code";
  url += "&client_id=1655882165";    // id of my current LINE channel
  url += "&scope=openid%20profile";  // we need openid and user profile
  url += "&scope=openid%20profile";  // we need openid and user profile
  url += `&redirect_uri=${body.redirect_uri}`;
  url += `&state=${body.state}`;
  url += `&nonce=${body.nonce}`;
  return url;
}


module.exports = {
  get_line_login_url
}