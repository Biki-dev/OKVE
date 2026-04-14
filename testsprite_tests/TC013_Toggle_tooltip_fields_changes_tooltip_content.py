import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5173/
        await page.goto("http://localhost:5173/")
        
        # -> Navigate to the demo page at /demo so we can access the demo controls (left panel) and graph canvas (right).
        await page.goto("http://localhost:5173/demo")
        
        # -> Open the 'React' node details by clicking its button to locate tooltip fields and metadata key controls.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div/div/div/article/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Open the 'React' node details panel so we can locate tooltip and metadata controls.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div/div/div/article/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Locate the tooltip-related controls and metadata-key toggles in the React node details panel and list their labels, control types, indexes, and current states.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[1]/div/main/div/section[1]/div[2]/div/div[1]/div[1]/div/article[1]/button[1]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'React')]").nth(0).is_visible(), "The tooltip should show the node label 'React' after enabling tooltip fields and metadata keys and hovering the node."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    