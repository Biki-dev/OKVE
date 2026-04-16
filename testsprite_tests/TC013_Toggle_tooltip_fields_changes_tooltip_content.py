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
        # -> Navigate to http://localhost:4173/demo
        await page.goto("http://localhost:4173/demo")
        
        # -> Open the React node details/editor so I can locate tooltip field toggles and metadata key toggles.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div/div/div/article/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'size' node tooltip field toggle, click the 'reason' metadata key toggle, re-select the React node to trigger tooltip preview, then wait for the UI to update so we can inspect the tooltip content.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div[2]/div[2]/button[3]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div[2]/div[4]/button[3]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div/div/div/article/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'size') and contains(., 'reason')]").nth(0).is_visible(), "The tooltip should display the size field and the reason metadata key after toggling them"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    