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

    const matchingPattern = getMatchingPattern(headers, path, resolveData);

    if (typeof matchingPattern === "undefined") {
      resolve({ ...resolveData });

      return;
    }

    const { pattern, match } = matchingPattern;

    got({
      method: pattern.method,
      url: pattern.url,
      responseType: pattern.responseType,
      headers,
      json: pattern.method !== "get" ? pattern.body(match) : null,
    })
      .then((response) => {
        // Cleanup headers
        const notAllowed = ["vary", "content-type", "content-length"];
        const responseHeaders = Object.keys(response.headers)
          .filter((key) => !notAllowed.includes(key))
          .reduce((object, key) => {
            object[key] = response.headers[key];

            return object;
          }, {});

        // if (!!response.body.error)
        //   resolveData = { ...resolveData, initialRequest: matchingPattern };

        resolveData = {
          loadedPath: path,
          ...resolveData,
          data: response.body,
          responseHeaders,
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

const postsPageBodyHandler = (pattern, pageType) => {
  return {
    page: !!pattern.page ? parseInt(pattern.page) : 1,
    page_type: getStatusFromPostsPageType(pageType),
  };
};

const onlyPageParameterBodyHandler = (pattern) => {
  return {
    page: !!pattern.page ? parseInt(pattern.page) : 1,
  };
};

const onlyIdParameterBodyHandler = (pattern) => {
  return {
    page: !!pattern.id ? parseInt(pattern.id) : -1,
  };
};

const ticketsPageBodyHandler = (pattern, pageType) => {
  return {
    page: !!pattern.page ? parseInt(pattern.page) : 1,
    page_type: getStatusFromTicketsPageType(pageType),
  };
};

const playersPageBodyHandler = (pattern, pageType) => {
  return {
    page: !!pattern.page ? parseInt(pattern.page) : 1,
    page_type: getStatusFromPlayersPageType(pageType),
  };
};

export const patterns = [
  {
    pattern: new UrlPattern(base + "/"),
    method: "get",
    url: "panel/initPage/dashboard",
    responseType: "json",
  },
  {
    pattern: new UrlPattern(base + "/notifications"),
    method: "get",
    url: "panel/notifications",
    responseType: "json",
  },
  {
    pattern: new UrlPattern(base + "/posts"),
    method: "post",
    url: "panel/initPage/postPage",
    responseType: "json",
    body: (pattern) => postsPageBodyHandler(pattern, PostsPageTypes.PUBLISHED),
  },
  {
    pattern: new UrlPattern(base + "/posts/published(/:page)"),
    method: "post",
    url: "panel/initPage/postPage",
    responseType: "json",
    body: (pattern) => postsPageBodyHandler(pattern, PostsPageTypes.PUBLISHED),
  },
  {
    pattern: new UrlPattern(base + "/posts/draft(/:page)"),
    method: "post",
    url: "panel/initPage/postPage",
    responseType: "json",
    body: (pattern) => postsPageBodyHandler(pattern, PostsPageTypes.DRAFT),
  },
  {
    pattern: new UrlPattern(base + "/posts/trash(/:page)"),
    method: "post",
    url: "panel/initPage/postPage",
    responseType: "json",
    body: (pattern) => postsPageBodyHandler(pattern, PostsPageTypes.TRASH),
  },
  {
    pattern: new UrlPattern(base + "/posts/categories(/:page)"),
    method: "post",
    url: "panel/initPage/posts/categoryPage",
    responseType: "json",
    body: onlyPageParameterBodyHandler,
  },
  {
    pattern: new UrlPattern(base + "/posts/post/:id"),
    method: "post",
    url: "panel/initPage/editPost",
    responseType: "json",
    body: onlyIdParameterBodyHandler,
  },
  {
    pattern: new UrlPattern(base + "/tickets"),
    method: "post",
    url: "panel/initPage/ticketPage",
    responseType: "json",
    body: (pattern) => ticketsPageBodyHandler(pattern, TicketsPageTypes.ALL),
  },
  {
    pattern: new UrlPattern(base + "/tickets/all(/:page)"),
    method: "post",
    url: "panel/initPage/ticketPage",
    responseType: "json",
    body: (pattern) => ticketsPageBodyHandler(pattern, TicketsPageTypes.ALL),
  },
  {
    pattern: new UrlPattern(base + "/tickets/waitingReply(/:page)"),
    method: "post",
    url: "panel/initPage/ticketPage",
    responseType: "json",
    body: (pattern) =>
      ticketsPageBodyHandler(pattern, TicketsPageTypes.WAITING_REPLY),
  },
  {
    pattern: new UrlPattern(base + "/tickets/closed(/:page)"),
    method: "post",
    url: "panel/initPage/ticketPage",
    responseType: "json",
    body: (pattern) => ticketsPageBodyHandler(pattern, TicketsPageTypes.CLOSED),
  },
  {
    pattern: new UrlPattern(base + "/tickets/categories(/:page)"),
    method: "post",
    url: "panel/initPage/tickets/categoryPage",
    responseType: "json",
    body: onlyPageParameterBodyHandler,
  },
  {
    pattern: new UrlPattern(base + "/tickets/ticket/:id"),
    method: "post",
    url: "panel/initPage/ticket/detail",
    responseType: "json",
    body: onlyIdParameterBodyHandler,
  },
  {
    pattern: new UrlPattern(base + "/players"),
    method: "post",
    url: "panel/initPage/playersPage",
    responseType: "json",
    body: (pattern) => playersPageBodyHandler(pattern, PlayersPageTypes.ALL),
  },
  {
    pattern: new UrlPattern(base + "/players/all(/:page)"),
    method: "post",
    url: "panel/initPage/playersPage",
    responseType: "json",
    body: (pattern) => playersPageBodyHandler(pattern, PlayersPageTypes.ALL),
  },
  {
    pattern: new UrlPattern(base + "/players/hasPerm(/:page)"),
    method: "post",
    url: "panel/initPage/playersPage",
    responseType: "json",
    body: (pattern) =>
      playersPageBodyHandler(pattern, PlayersPageTypes.HAS_PERM),
  },
  {
    pattern: new UrlPattern(base + "/players/banned(/:page)"),
    method: "post",
    url: "panel/initPage/playersPage",
    responseType: "json",
    body: (pattern) => playersPageBodyHandler(pattern, PlayersPageTypes.BANNED),
  },
  {
    pattern: new UrlPattern(base + "/players/permissions"),
    method: "get",
    url: "panel/initPage/permissionsPage",
    responseType: "json",
  },
  {
    pattern: new UrlPattern(base + "/players/player/:username(/:page)"),
    method: "post",
    url: "panel/initPage/playerDetail",
    responseType: "json",
    body: (pattern) => {
      return {
        username: pattern.username,
        page: !!pattern.page ? parseInt(pattern.page) : 1,
      };
    },
  },
];

export function getMatchingPattern(headers, path, resolveData) {
  patterns.forEach((pattern) => {
    const match = pattern.pattern.match(path);

    if (match) return { pattern, match };
  });

  return undefined;
}
