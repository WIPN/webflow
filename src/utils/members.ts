/**
 * Fetches members from MemberStack (using Cloudflare Worker Proxy)
 * @returns An array of {@link Member}.
 */
export async function fetchMembers(query: string) {
  try {
    const response = await fetch(`https://members.helpers.wipn.org/${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
