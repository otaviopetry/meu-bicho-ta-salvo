self.addEventListener("fetch", (event) => {
  if (isImageRequest(event)) {
    handleImageResponse(event);
  }
});

function isImageRequest(event) {
  return (
    event.request.url &&
    event.request.url.indexOf("https://meubichotasalvo.s3.amazonaws.com") !== -1
  );
}

function handleImageResponse(event) {
  if (!caches || !caches.open) {
    event.respondWith(fetch(event.request));

    return;
  }

  event.respondWith(
    caches.open("animal-images").then(async (cache) => {
      return cache.match(event.request).then(async (response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());

          return response;
        });
      });
    })
  );
}
