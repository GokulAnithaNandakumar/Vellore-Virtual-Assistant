import requests
from bs4 import BeautifulSoup
import sys

def scrape_wikipedia_to_txt(url: str, output_path: str):
    """
    Scrapes the main content of a Wikipedia page and saves it as a plain text file.
    Args:
        url (str): The Wikipedia page URL.
        output_path (str): The path to save the output .txt file.
    """
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    # Wikipedia main content is inside <div id="mw-content-text">
    content_div = soup.find('div', id='mw-content-text')
    if not content_div:
        print("Could not find main content on the page.")
        return
    # Remove tables, infoboxes, and references
    for tag in content_div.find_all(['table', 'sup', 'span', 'ol', 'ul', 'img']):
        tag.decompose()
    # Get all paragraphs
    paragraphs = content_div.find_all('p')
    text = '\n\n'.join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
    # Save to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Scraped content saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python scrape_wikipedia_to_txt.py <Wikipedia_URL> <output_txt_path>")
    else:
        scrape_wikipedia_to_txt(sys.argv[1], sys.argv[2])
