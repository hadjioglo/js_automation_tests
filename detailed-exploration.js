const { chromium } = require('playwright');

async function detailedExploration() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    console.log('=== DETAILED WEBSITE EXPLORATION ===');

    try {
        // Navigate to the website
        console.log('\n1. NAVIGATION & PAGE LOAD');
        await page.goto('https://factory-direct.tilda.ws/', { waitUntil: 'networkidle' });
        
        const title = await page.title();
        const url = page.url();
        console.log(`✓ Page Title: ${title}`);
        console.log(`✓ URL: ${url}`);

        // Get all text content to understand the page
        console.log('\n2. PAGE CONTENT ANALYSIS');
        const allText = await page.locator('body').textContent();
        const words = allText.split(/\s+/).filter(word => word.length > 2);
        const uniqueWords = [...new Set(words)].slice(0, 20);
        console.log(`✓ Key content words: ${uniqueWords.join(', ')}`);

        // Find all links
        console.log('\n3. NAVIGATION & LINKS');
        const allLinks = await page.locator('a').all();
        console.log(`✓ Total links found: ${allLinks.length}`);
        
        for (let i = 0; i < Math.min(allLinks.length, 10); i++) {
            try {
                const text = await allLinks[i].textContent();
                const href = await allLinks[i].getAttribute('href');
                if (text && text.trim() && href) {
                    console.log(`  → "${text.trim()}" → ${href}`);
                }
            } catch (e) {
                // Skip if element is stale
            }
        }

        // Analyze forms in detail
        console.log('\n4. FORMS & INPUT ELEMENTS');
        const forms = await page.locator('form').all();
        for (let i = 0; i < forms.length; i++) {
            console.log(`\n📋 Form ${i + 1}:`);
            const inputs = await forms[i].locator('input, textarea, select').all();
            
            for (let j = 0; j < inputs.length; j++) {
                try {
                    const tagName = await inputs[j].evaluate(el => el.tagName);
                    const type = await inputs[j].getAttribute('type');
                    const name = await inputs[j].getAttribute('name');
                    const placeholder = await inputs[j].getAttribute('placeholder');
                    const required = await inputs[j].getAttribute('required');
                    
                    console.log(`  📝 ${tagName}${type ? `[type="${type}"]` : ''}`);
                    if (name) console.log(`     name: ${name}`);
                    if (placeholder) console.log(`     placeholder: ${placeholder}`);
                    if (required !== null) console.log(`     required: ${required !== null}`);
                } catch (e) {
                    console.log(`  📝 Input element (details unavailable)`);
                }
            }
        }

        // Test form interaction
        console.log('\n5. FORM INTERACTION TESTING');
        const nameInput = page.locator('input[name*="name"], input[placeholder*="name"], input[placeholder*="Name"]').first();
        const emailInput = page.locator('input[name*="email"], input[type="email"], input[placeholder*="email"]').first();
        const phoneInput = page.locator('input[name*="phone"], input[type="tel"], input[placeholder*="phone"]').first();
        
        if (await nameInput.count() > 0) {
            console.log('✓ Testing name input field');
            await nameInput.fill('Test User');
        }
        
        if (await emailInput.count() > 0) {
            console.log('✓ Testing email input field');
            await emailInput.fill('test@example.com');
        }
        
        if (await phoneInput.count() > 0) {
            console.log('✓ Testing phone input field');
            await phoneInput.fill('+1234567890');
        }

        // Look for buttons and their purposes
        console.log('\n6. BUTTONS & CALL-TO-ACTIONS');
        const buttons = await page.locator('button, input[type="submit"], input[type="button"], [role="button"]').all();
        console.log(`✓ Found ${buttons.length} interactive buttons`);
        
        for (let i = 0; i < Math.min(buttons.length, 5); i++) {
            try {
                const text = await buttons[i].textContent();
                const type = await buttons[i].getAttribute('type');
                const className = await buttons[i].getAttribute('class');
                console.log(`  🔘 "${text?.trim() || 'No text'}" (type: ${type}, class: ${className?.slice(0, 30)}...)`);
            } catch (e) {
                console.log(`  🔘 Button ${i + 1} (details unavailable)`);
            }
        }

        // Check for interactive elements
        console.log('\n7. INTERACTIVE ELEMENTS');
        const clickableElements = await page.locator('[onclick], [href], button, input[type="submit"]').all();
        console.log(`✓ Found ${clickableElements.length} clickable elements`);

        // Test scrolling and page sections
        console.log('\n8. PAGE SECTIONS & SCROLLING');
        const initialHeight = await page.evaluate(() => document.body.scrollHeight);
        console.log(`✓ Initial page height: ${initialHeight}px`);
        
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
        
        const finalHeight = await page.evaluate(() => document.body.scrollHeight);
        console.log(`✓ Final page height: ${finalHeight}px`);

        // Look for specific business-related content
        console.log('\n9. BUSINESS CONTENT ANALYSIS');
        const serviceKeywords = ['service', 'product', 'factory', 'direct', 'contact', 'about', 'price', 'order'];
        for (const keyword of serviceKeywords) {
            const count = await page.locator(`text=${keyword}`).count();
            if (count > 0) {
                console.log(`✓ Found "${keyword}": ${count} occurrences`);
            }
        }

        // Final screenshot for documentation
        await page.screenshot({ path: 'reports/detailed-exploration.png', fullPage: true });
        console.log('\n✓ Screenshots saved to reports/ directory');

        console.log('\n=== EXPLORATION COMPLETED SUCCESSFULLY ===');

    } catch (error) {
        console.error('❌ Error during exploration:', error.message);
    } finally {
        await context.close();
        await browser.close();
        console.log('🔒 Browser closed.');
    }
}

detailedExploration();