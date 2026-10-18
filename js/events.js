const list = document.querySelector("#events-list");

fetch("./events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load events: ${response.status}`);
    }
    return response.json();
  })
  .then((events) => {
    list.replaceChildren();

    for (const event of events) {
      const item = document.createElement("li");
      item.textContent = `${event.title} - ${event.date} @ ${event.location}`;
      list.append(item);
    }
  })
  .catch((error) => {
    console.error(error);
    list.textContent = "Events could not be loaded.";
  });