// Bundle entry point - imports all JavaScript files in the correct order

// 1. DataLayer (Google Tag Manager)
import './dataLayer.js';

// 2. SVG Inline functionality
import './svg-inline.js';

// 3. GSAP (GreenSock Animation Platform)
import './gsap.min.js';

// 4. ScrollTrigger plugin
import './ScrollTrigger.min.js';

// 5. Custom animations
import './animation.js';

// 6. Main application logic
import './main.js';
