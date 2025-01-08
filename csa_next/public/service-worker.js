self.addEventListener('backgroundfetchsuccess', event => {
    event.waitUntil(async function() {
        const records = await event.registration.matchAll();
        for (const record of records) {
            // Process the response from the server
            // In an upload scenario, you might just consider the request sent.
        }
        await event.updateUI({ title: 'Upload complete!' });
    }());
});
  
self.addEventListener('backgroundfetchfail', event => {
    //console.log('Background Fetch failed: ', event.registration.id);
    // Optionally, inform the page or retry
});