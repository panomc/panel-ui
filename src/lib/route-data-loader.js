import { base } from "$app/paths";
import got from "got";
import { API_URL } from "$lib/variables";
import UrlPattern from "url-pattern";
import {
  getStatusFromPageType as getStatusFromPostsPageType,
  PageTypes as PostsPageTypes,
} from "../routes/_Posts.svelte";
import {
  getStatusFromPageType as getStatusFromTicketsPageType,
  PageTypes as TicketsPageTypes,
} from "../routes/_Tickets.svelte";
import {
  getStatusFromPageType as getStatusFromPlayersPageType,
  PageTypes as PlayersPageTypes,
} from "../routes/_Players.svelte";

export const patterns = {
  "dashboard": new UrlPattern(base + "/"),
  "notifications": new UrlPattern(base + "/notifications"),
  "posts": new UrlPattern(base + "/posts"),
  "posts/published": new UrlPattern(base + "/posts/published(/:page)"),
  "posts/draft": new UrlPattern(base + "/posts/draft(/:page)"),
  "posts/trash": new UrlPattern(base + "/posts/trash(/:page)"),
  "posts/categories": new UrlPattern(base + "/posts/categories(/:page)"),
  "posts/create-post": new UrlPattern(base + "/posts/create-post"),
  "posts/post": new UrlPattern(base + "/posts/post/:id"),
  "tickets": new UrlPattern(base + "/tickets"),
  "tickets/all": new UrlPattern(base + "/tickets/all(/:page)"),
  "tickets/waitingReply": new UrlPattern(
    base + "/tickets/waitingReply(/:page)"
  ),
  "tickets/closed": new UrlPattern(base + "/tickets/closed(/:page)"),
  "tickets/categories": new UrlPattern(base + "/tickets/categories(/:page)"),
  "tickets/ticket": new UrlPattern(base + "/tickets/ticket/:id"),
  "players": new UrlPattern(base + "/players"),
  "players/all": new UrlPattern(base + "/players/all(/:page)"),
  "players/hasPerm": new UrlPattern(base + "/players/hasPerm(/:page)"),
  "players/banned": new UrlPattern(base + "/players/banned(/:page)"),
  "players/permissions": new UrlPattern(base + "/players/permissions"),
  "players/player": new UrlPattern(base + "/players/player/:username(/:page)"),
};

export default async function loadRouteDataHandler(headers, path) {
  const basicData = await new Promise((resolve) => {
    got
      .get(API_URL + "panel/basicData", {
        headers,
        responseType: "json",
      })
      .then((response) => {
        resolve(response.body);
      });
  });

  return new Promise((resolve) => {
    let resolveData = {};

    resolveData.basicData = basicData;

    const pathsAPI = getPathsAPI(headers, path, resolveData);

    if (typeof pathsAPI === "undefined") {
      resolve({ ...resolveData });

      return;
    }

    pathsAPI
      .then((response) => {
        // Cleanup headers
        const notAllowed = ["vary", "content-type", "content-length"];
        const headers = Object.keys(response.headers)
          .filter((key) => !notAllowed.includes(key))
          .reduce((object, key) => {
            object[key] = response.headers[key];

            return object;
          }, {});

        resolveData = {
          loadedPath: path,
          ...resolveData,
          data: response.body,
          headers,
        };

        // console.log(user);

        resolve(resolveData);

        // console.log("pulled DATAS server-side");
        // console.log(response.body);
      })
      .catch((e) => {
        resolve();
        console.log(e);
      });
  });
}

export function getPathsAPI(headers, path, resolveData) {
  const dashboardMatch = patterns["dashboard"].match(path);

  if (dashboardMatch !== null)
    return got.get(API_URL + "panel/initPage/dashboard", {
      headers,
      responseType: "json",
    });

  const notificationsMatch = patterns["notifications"].match(path);

  if (notificationsMatch !== null)
    return got.get(API_URL + "panel/notifications", {
      headers,
      responseType: "json",
    });

  const postsMatch = patterns["posts"].match(path);
  const postsPublishedMatch = patterns["posts/published"].match(path);

  if (postsMatch !== null || postsPublishedMatch !== null) {
    let page = 1;

    if (postsPublishedMatch !== null && !!postsPublishedMatch.page)
      page = parseInt(postsPublishedMatch.page);

    return got.post(API_URL + "panel/initPage/postPage", {
      json: {
        page,
        page_type: parseInt(
          getStatusFromPostsPageType(PostsPageTypes.PUBLISHED)
        ),
      },
      headers,
      responseType: "json",
    });
  }

  const postsDraftMatch = patterns["posts/draft"].match(path);

  if (postsDraftMatch !== null)
    return got.post(API_URL + "panel/initPage/postPage", {
      json: {
        page: !!postsDraftMatch.page ? parseInt(postsDraftMatch.page) : 1,
        page_type: parseInt(getStatusFromPostsPageType(PostsPageTypes.DRAFT)),
      },
      headers,
      responseType: "json",
    });

  const postsTrashMatch = patterns["posts/trash"].match(path);

  if (postsTrashMatch !== null)
    return got.post(API_URL + "panel/initPage/postPage", {
      json: {
        page: !!postsTrashMatch.page ? parseInt(postsTrashMatch.page) : 1,
        page_type: parseInt(getStatusFromPostsPageType(PostsPageTypes.TRASH)),
      },
      headers,
      responseType: "json",
    });

  const postCategoriesMatch = patterns["posts/categories"].match(path);

  if (postCategoriesMatch !== null)
    return got.post(API_URL + "panel/initPage/posts/categoryPage", {
      json: {
        page: !!postCategoriesMatch.page
          ? parseInt(postCategoriesMatch.page)
          : 1,
      },
      headers,
      responseType: "json",
    });

  const postsCreatePostMatch = patterns["posts/create-post"].match(path);

  if (postsCreatePostMatch !== null)
    return got.get(API_URL + "panel/post/category/categories", {
      headers,
      responseType: "json",
    });

  const postsPostMatch = patterns["posts/post"].match(path);

  if (postsPostMatch !== null)
    return got.post(API_URL + "panel/initPage/editPost", {
      json: {
        id: !!postsPostMatch.id ? parseInt(postsPostMatch.id) : -1,
      },
      headers,
      responseType: "json",
    });

  const ticketsMatch = patterns["tickets"].match(path);
  const ticketsAllMatch = patterns["tickets/all"].match(path);

  if (ticketsMatch !== null || ticketsAllMatch !== null) {
    let page = 1;

    if (ticketsAllMatch !== null && !!ticketsAllMatch.page)
      page = parseInt(ticketsAllMatch.page);

    return got.post(API_URL + "panel/initPage/ticketPage", {
      json: {
        page,
        page_type: parseInt(getStatusFromTicketsPageType(TicketsPageTypes.ALL)),
      },
      headers,
      responseType: "json",
    });
  }

  const ticketsWaitingReplyMatch = patterns["tickets/waitingReply"].match(path);

  if (ticketsWaitingReplyMatch !== null)
    return got.post(API_URL + "panel/initPage/ticketPage", {
      json: {
        page: !!ticketsWaitingReplyMatch.page
          ? parseInt(ticketsWaitingReplyMatch.page)
          : 1,
        page_type: parseInt(
          getStatusFromTicketsPageType(TicketsPageTypes.WAITING_REPLY)
        ),
      },
      headers,
      responseType: "json",
    });

  const ticketsClosedMatch = patterns["tickets/closed"].match(path);

  if (ticketsClosedMatch !== null)
    return got.post(API_URL + "panel/initPage/ticketPage", {
      json: {
        page: !!ticketsClosedMatch.page ? parseInt(ticketsClosedMatch.page) : 1,
        page_type: parseInt(
          getStatusFromTicketsPageType(TicketsPageTypes.CLOSED)
        ),
      },
      headers,
      responseType: "json",
    });

  const ticketCategoriesMatch = patterns["tickets/categories"].match(path);

  if (ticketCategoriesMatch !== null)
    return got.post(API_URL + "panel/initPage/tickets/categoryPage", {
      json: {
        page: !!ticketCategoriesMatch.page
          ? parseInt(ticketCategoriesMatch.page)
          : 1,
      },
      headers,
      responseType: "json",
    });

  const ticketsTicketMatch = patterns["tickets/ticket"].match(path);

  if (ticketsTicketMatch !== null)
    return got.post(API_URL + "panel/initPage/ticket/detail", {
      json: {
        id: !!ticketsTicketMatch.id ? parseInt(ticketsTicketMatch.id) : -1,
      },
      headers,
      responseType: "json",
    });

  const playersMatch = patterns["players"].match(path);
  const playersAllMatch = patterns["players/all"].match(path);

  if (playersMatch !== null || playersAllMatch !== null) {
    let page = 1;

    if (playersAllMatch !== null && !!playersAllMatch.page)
      page = parseInt(playersAllMatch.page);

    return got.post(API_URL + "panel/initPage/playersPage", {
      json: {
        page,
        page_type: parseInt(getStatusFromPlayersPageType(PlayersPageTypes.ALL)),
      },
      headers,
      responseType: "json",
    });
  }

  const playersHasPermMatch = patterns["players/hasPerm"].match(path);

  if (playersHasPermMatch !== null)
    return got.post(API_URL + "panel/initPage/playersPage", {
      json: {
        page: !!playersHasPermMatch.page
          ? parseInt(playersHasPermMatch.page)
          : 1,
        page_type: parseInt(
          getStatusFromPlayersPageType(PlayersPageTypes.HAS_PERM)
        ),
      },
      headers,
      responseType: "json",
    });

  const playersBannedMatch = patterns["players/banned"].match(path);

  if (playersBannedMatch !== null)
    return got.post(API_URL + "panel/initPage/playersPage", {
      json: {
        page: !!playersBannedMatch.page ? parseInt(playersBannedMatch.page) : 1,
        page_type: parseInt(
          getStatusFromPlayersPageType(PlayersPageTypes.BANNED)
        ),
      },
      headers,
      responseType: "json",
    });

  const playersPermissionsMatch = patterns["players/permissions"].match(path);

  if (playersPermissionsMatch !== null)
    return got.get(API_URL + "panel/initPage/permissionsPage", {
      headers,
      responseType: "json",
    });

  const playersPlayerMatch = patterns["players/player"].match(path);

  if (playersPlayerMatch !== null)
    return got.post(API_URL + "panel/initPage/playerDetail", {
      json: {
        username: playersPlayerMatch.username,
        page: !!playersPlayerMatch.page ? parseInt(playersPlayerMatch.page) : 1,
      },
      headers,
      responseType: "json",
    });

  return undefined;
}
