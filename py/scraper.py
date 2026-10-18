import requests
from bs4 import BeautifulSoup

class eventsScraper:
    @staticmethod
    def scraper():
        url = "https://mtmary.edu/news/events-page.html"
        headers = {'User-Agent': 'Mozilla/5.0'}
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        events_list = soup.find(
            id="calendar",
            class_="col-sm-12 events-container"
        )
        print("status:", response.status_code)
        if events_list is None:
            raise RuntimeError("Could not find the events calendar on the source page")
        
        rows = events_list.find_all(class_="row event-row")
        scraped_events = []
        
        for row in rows:
            date_element = row.find(class_="event-date")
            title_element = row.find(class_="event-title")
            location_element = row.find(class_="info-details")
            
            title = title_element.get_text(" ", strip=True) if title_element else "No title"
            date = date_element.get_text(" ", strip=True) if date_element else "No date"
            location = location_element.get_text(" ", strip=True) if location_element else "No location"
            
            scraped_events.append((title, date, location))
        return scraped_events