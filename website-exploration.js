const { chromium } = require('playwright');

async function exploreWebsite() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    console.log('Starting website exploration...');

    try {
        // Navigate to the website
        console.log('1. Navigating to https://factory-direct.tilda.ws/');
        await page.goto('https://factory-direct.tilda.ws/', { waitUntil: 'networkidle' });
        
        // Take a screenshot of the homepage
        await page.screenshot({ path: 'reports/homepage.png', fullPage: true });
        
        // Get page title and basic info
        const title = await page.title();
        const url = page.url();
        console.log(`Page Title: ${title}`);
        console.log(`URL: ${url}`);

        // Explore navigation elements
        console.log('\n2. Identifying navigation elements...');
        const navElements = await page.locator('nav, .menu, .navigation, header a').all();
        console.log(`Found ${navElements.length} navigation elements`);

        // Find and log all clickable links in header/navigation
        const headerLinks = await page.locator('header a, nav a, .menu a').all();
        for (let i = 0; i < headerLinks.length; i++) {
            try {
                const text = await headerLinks[i].textContent();
                const href = await headerLinks[i].getAttribute('href');
                if (text && text.trim()) {
                    console.log(`  - Link: "${text.trim()}" -> ${href}`);
                }
            } catch (e) {
                // Skip if element is no longer available
            }
        }

        // Explore main content sections
        console.log('\n3. Identifying main content sections...');
        const sections = await page.locator('section, .section, main > div').all();
        console.log(`Found ${sections.length} main sections`);

        // Look for forms
        console.log('\n4. Identifying forms and interactive elements...');
        const forms = await page.locator('form').all();
        console.log(`Found ${forms.length} forms`);

        for (let i = 0; i < forms.length; i++) {
            const formInputs = await forms[i].locator('input, textarea, select').all();
            console.log(`  Form ${i + 1}: ${formInputs.length} input elements`);
        }

        // Look for buttons
        const buttons = await page.locator('button, input[type="submit"], .btn, .button').all();
        console.log(`Found ${buttons.length} buttons`);

        for (let i = 0; i < Math.min(buttons.length, 10); i++) {
            try {
                const text = await buttons[i].textContent();
                const type = await buttons[i].getAttribute('type');
                if (text && text.trim()) {
                    console.log(`  - Button: "${text.trim()}" (type: ${type})`);
                }
            } catch (e) {
                // Skip if element is no longer available
            }
        }

        // Look for product/service listings
        console.log('\n5. Looking for product/service elements...');
        const productElements = await page.locator('.product, .service, .item, .card, [class*="product"], [class*="service"]').all();
        console.log(`Found ${productElements.length} product/service-like elements`);

        // Check for contact information
        console.log('\n6. Looking for contact information...');
        const contactElements = await page.locator('*:has-text("contact"), *:has-text("phone"), *:has-text("email"), *:has-text("address")').all();
        console.log(`Found ${contactElements.length} contact-related elements`);

        // Test scrolling and identify more content
        console.log('\n7. Scrolling to identify additional content...');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);

        // Look for footer elements
        const footerElements = await page.locator('footer, .footer').all();
        console.log(`Found ${footerElements.length} footer elements`);

        // Test a few key interactions
        console.log('\n8. Testing key interactions...');
        
        // Try to find and click a menu item if available
        const menuItems = await page.locator('nav a, .menu a, header a').first();
        if (await menuItems.count() > 0) {
            try {
                const menuText = await menuItems.textContent();
                console.log(`  - Attempting to click menu item: "${menuText}"`);
                await menuItems.click();
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'reports/after-menu-click.png' });
                await page.goBack();
            } catch (e) {
                console.log(`  - Could not interact with menu item: ${e.message}`);
            }
        }

        // Look for contact forms or search functionality
        const searchInput = await page.locator('input[type="search"], input[placeholder*="search"], input[name*="search"]').first();
        if (await searchInput.count() > 0) {
            console.log('  - Found search functionality');
            await searchInput.fill('test');
            await page.screenshot({ path: 'reports/search-interaction.png' });
        }

        // Final screenshot
        await page.screenshot({ path: 'reports/final-exploration.png', fullPage: true });

        console.log('\n9. Exploration completed successfully!');

    } catch (error) {
        console.error('Error during exploration:', error.message);
    } finally {
        await context.close();
        await browser.close();
        console.log('Browser closed.');
    }
}

exploreWebsite();