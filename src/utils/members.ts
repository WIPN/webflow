/**
 * Fetches members from MemberStack (using Cloudflare Worker Proxy)
 * @param query - The query string to be appended to the URL (optional)
 * @returns An array of {@link Member}.
 */
export async function fetchMembers(query?: string) {
  try {
    let url = 'https://members.helpers.wipn.org/';
    url += query ? query : '';
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
