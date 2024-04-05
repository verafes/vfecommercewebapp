const createFooter = () => {
    let footer = document.querySelector('footer');

    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-about" id="footer-about">
                <div>
                    <img src="../img/logo-light.png" class="logo" role="img" alt="VFShop">
                    <p class="logo-slogan">Where Style Meets Elegance <br> And Fashion Knows No Bounds</p>
                </div>
                <div class="footer-about-container">
                    <div class="about-company">
                        <h3 class="footer-title">About Company:</h3>
                        <p class="info">Welcome to VF Shop, an educational e-commerce initiative where the worlds of education and technology unite to redefine the world of fashion. This project represents a fusion of knowledge and innovation, offering a fresh perspective on the fashion landscape.</p>
                        <p class="info">As a creative developer at VF Shop, I bring my passion into the project. I am deeply committed to our mission of merging fashion with education and innovation. My vision for this endeavor is to inspire learning, spark creativity, and empower individuals to excel in the realms of both fashion and technology.</p>
                        <h3 class="footer-title">Contacts:</h3>
                    </div>
                    <div class="footer-info-container info">
                        <ul class="contact-info">
                            <li class="contact-info-title">Terms & Privacy:</li>
                            <li><a href="/terms" class="contact-info-link social-link">Terms & Services</a></li>
                            <li><a href="/privacy" class="contact-info-link social-link">Privacy Policy</a></li>
                        </ul>
                        <ul class="contact-info">
                            <li class="contact-info-title">Support Emails:</li>
                            <li class="contact-info-link">help@vfshop77.com</a></li>
                            <li class="contact-info-link">support@vfshop77.com</a></li>
                        </ul>
                        <ul class="contact-info">
                            <li class="contact-info-title">Phones:</li>
                            <li class="contact-info-link">1 (800) 555-0123</a></li>
                            <li class="contact-info-link">1 (800) 555-0124</a></li>
                        </ul>
                        <ul class="contact-info">
                            <li class="contact-info-title">Follow us:</li>
                            <li><a href="#" class="contact-info-link social-link">Instagram</a></li>
                            <li><a href="#" class="contact-info-link social-link">Twitter</a></li>
                        </ul>
                    </div>
                </div> 
            </div>
        </div>
        <p class="footer-credit">VF SHop, Best apparels online store</p>
    `;
}

createFooter();