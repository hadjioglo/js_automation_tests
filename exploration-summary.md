# Factory Direct Website Exploration Summary

## Website Overview
- **URL**: https://factory-direct.tilda.ws/
- **Title**: Factory direct
- **Purpose**: Platform to connect buyers directly with factories, eliminating intermediaries

## Key Findings

### 1. Business Model
The website serves as a B2B marketplace platform where:
- Buyers can find trusted manufacturers
- Factories can register to offer their products
- Direct ordering without intermediaries to save margins
- Early access registration system

### 2. Core Features Identified

#### Navigation & Content
- **Social Sharing**: Facebook and Twitter integration
- **Dual Registration System**: Separate registration for Factories and Buyers
- **Contact Information**: Basic contact capabilities
- **Image Attribution**: Proper credit to photographers (Sebastiaan ter Burg, Peter McConnochie)

#### Interactive Elements
- **Main Registration Form**: 6 input fields including email, name, phone, account type selector
- **Call-to-Action Buttons**: Registration buttons for both user types
- **Form Validation**: Required fields and input type validation

#### Technical Details
- **Page Height**: 5042px (long-form landing page)
- **Responsive Design**: Tilda-based website builder
- **Form Elements**: Email, text, phone, and select inputs with placeholders

## User Flows Identified

### 1. **Factory Registration Flow**
- **Entry Point**: "Register Factory" button
- **Process**: Form completion → Account type selection → Submission
- **Expected Outcome**: Factory account creation and onboarding

### 2. **Buyer Registration Flow**
- **Entry Point**: "Register Buyer" button  
- **Process**: Form completion → Account type selection → Submission
- **Expected Outcome**: Buyer account creation and access to manufacturer directory

### 3. **Information Gathering Flow**
- **Entry Point**: Landing page visit
- **Process**: Content consumption → Social sharing (optional) → Registration decision
- **Expected Outcome**: User education and conversion to registration

### 4. **Contact/Inquiry Flow**
- **Entry Point**: Contact information section
- **Process**: Information gathering → Direct communication initiation
- **Expected Outcome**: Business inquiry or partnership discussion

### 5. **Social Engagement Flow**
- **Entry Point**: Social sharing buttons
- **Process**: Content sharing on Facebook/Twitter
- **Expected Outcome**: Increased brand awareness and referral traffic

## UI Elements & Locators

### Form Elements
- **Email Input**: `input[name="Email"]` - Required email field with placeholder
- **Name Input**: `input[name="Name"]` - Text field for user name
- **Phone Input**: `input[name="Phone"]` - Tel input for contact number
- **Account Type**: `select[name="Account type"]` - Dropdown for Factory/Buyer selection
- **Submit Button**: `input[type="submit"]` - Form submission trigger

### Navigation Elements
- **Factory Registration**: Link/button targeting `#rec1389242973`
- **Buyer Registration**: Link/button targeting `#rec1389242973`
- **Social Sharing**: External links to Facebook and Twitter

### Content Sections
- **Hero Section**: Main value proposition and registration CTAs
- **Benefits Section**: Factory direct advantages
- **Registration Section**: Main form area
- **Footer Section**: Attribution and additional links

## Expected Outcomes

### Successful Registration
- Form submission processes without errors
- User receives confirmation or redirect
- Account creation in backend system
- Email verification process initiated

### Navigation Experience
- Smooth scrolling and responsive design
- Clear call-to-action visibility
- Consistent branding and messaging
- Mobile-friendly interface

### Business Goals
- Lead generation through registrations
- Clear value proposition communication
- User type differentiation (Factory vs Buyer)
- Social media engagement and sharing