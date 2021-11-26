import routeDataLoader from "$lib/route-data-loader";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
  const routeData = await routeDataLoader(request.headers, request.path);

  const notAllowed = ["headers"];

  request.locals = Object.keys(routeData)
    .filter((key) => !notAllowed.includes(key))
    .reduce((object, key) => {
      object[key] = routeData[key];

      return object;
    }, {});

  const response = await resolve(request);

  return {
    ...response,
    headers: {
      ...response.headers,
      ...routeData.headers,
    },
  };
}

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({ locals }) {
  return locals;
}
