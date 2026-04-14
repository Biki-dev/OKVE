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
        
        # -> Click the 'Demo' link in the top navigation to open the demo page.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/header/div/div/div/nav/a[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'frontend' node group chip to filter the graph, then locate the Export PNG control.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section[2]/div[2]/div/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the non-default layout 'radial', then click 'Export PNG', wait for the UI to update, and search the page for any export/PNG/download confirmation or data URL indicating a PNG was generated.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div[2]/div/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section[1]/div[2]/div/div[1]/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the non-default layout button 'radial' to change the graph layout (index 1547).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div[2]/div/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Export PNG' button and then look for evidence of a generated PNG (data URL like 'data:image/png' or any download confirmation).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Wait briefly for the UI to settle, then reload /demo and retry the Export PNG action to check for a download or a data:image/png data URL.
        await page.goto("http://localhost:5173/demo")
        
        # -> Reload the app by navigating to the homepage to recover the SPA, then reopen the Demo page and retry the Export PNG flow.
        await page.goto("http://localhost:5173/")
        
        # -> Navigate to /demo, reproduce the Export PNG flow (select a non-default layout if needed, ensure a node group filter is applied), click Export PNG, then search the page for 'data:image/png' or any download confirmation to verify a PNG was generated.
        await page.goto("http://localhost:5173/demo")
        
        # -> Ensure the frontend group filter is active (click chip if needed), scroll to/find the Export PNG control on the demo page so I can click it and verify a data:image/png or a download was initiated.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section[2]/div[2]/div/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the 'Export PNG' button, wait for the UI to respond, and search the page for a data URL ('data:image/png') or any download confirmation indicating a PNG was generated.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/div/main/div/section/div[2]/div/div/button[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'data:image/png')]").nth(0).is_visible(), "The page should show a data URL (data:image/png) after exporting the graph to PNG."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    