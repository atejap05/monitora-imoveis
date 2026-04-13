import asyncio
from playwright.async_api import async_playwright
import json

async def fetch_property_data(url: str) -> dict:
    """
    Fetches property data from a given URL using Playwright.
    Returns a dictionary with title, price, bedrooms, status.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        try:
            # We wait until the dom content is loaded
            response = await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            
            # Check if 404 or 410 (property likely unavaiable)
            if response and response.status in [404, 410]:
                return {"status": "inactive", "error": f"HTTP {response.status}"}

            # Let's wait a bit for scripts to populate the page
            await page.wait_for_timeout(3000)

            title = await page.title()
            
            # This is a generic way to extract visible text that might be the price
            # For a production scenario we should use specific selectors, e.g., page.locator(".price-class")
            body_text = await page.locator("body").inner_text()
            
            # As a simple MVP, we will try to look for explicit things here or return raw lines
            # A more advanced version would use small LLMs here to parse `body_text`.
            
            result = {
                "title": title,
                "status": "active",
                "raw_text_sample": body_text[:500] # just for debugging
            }
            return result

        except Exception as e:
            return {"status": "error", "error": str(e)}
        finally:
            await browser.close()

if __name__ == "__main__":
    # Test execution
    test_url = "https://www.primeiraporta.com.br/imovel/4109009/apartamento-venda-sao-jose-dos-campos-sp-jardim-das-industrias"
    print(f"Testing scraper on {test_url}")
    result = asyncio.run(fetch_property_data(test_url))
    print(json.dumps(result, indent=2, ensure_ascii=False))
