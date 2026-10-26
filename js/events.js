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
      item.className = "event-card";

      const title = document.createElement("h2");
      title.className = "event-card-title";
      title.textContent = event.title;

      const date = document.createElement("p");
      date.className = "event-card-detail";
      date.textContent = `Date: ${event.date}`;

      const location = document.createElement("p");
      location.className = "event-card-detail";
      location.textContent = `Location: ${event.location}`;

      item.append(title, date, location);
      list.append(item);
    }
  })
  .catch((error) => {
    console.error(error);
    list.textContent = "Events could not be loaded.";
  });