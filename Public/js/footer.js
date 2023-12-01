const createFooter = () => {
    let footer = document.querySelector('footer');

    footer.innerHTML = `
        <div class="footer-content" id="footer-about">
            <div>
                <a href="/" aria-label="VFShop">
                    <img src="../img/logo-light.png" class="logo" role="img" alt="VFShop">
                </a>
                <p class="moto">Where Style Meets Elegance <br> And Fashion Knows No Bounds</p>
            </div>
            
            <div>
                <div class="about-company">
                    <h3 class="footer-title">About Company:</h3>
                    <p class="info">Welcome to VF Shop, an educational e-commerce initiative where the worlds of education and technology unite to redefine the world of fashion. This project represents a fusion of knowledge and innovation, offering a fresh perspective on the fashion landscape.</p>
                    <p class="info">As a creative developer at VF Shop, I bring my passion into the project. I am deeply committed to our mission of merging fashion with education and innovation. My vision for this endeavor is to inspire learning, spark creativity, and empower individuals to excel in the realms of both fashion and technology.</p>
                    <h3 class="footer-title">Contacts:</h3>
                </div>
                <div class="info-contacts">
                    <div class="column">
                        <p class="footer-subtitle">Email:</p> 
                        <p class="info">help@vfshop77.com</p> 
                        <p class="info">customersupport@vfshop77.com</p>
                    </div>
                    <div class="column">
                        <p class="footer-subtitle">Phone: </p>
                        <p class="info">(800) 555-0123</p>
                        <p class="info">(800) 555-0124</p>
                    </div>
                    <div class="column">
                        <p class="footer-subtitle">Our address:</p>
                        <p class="info">2930 El Camino Real </p>
                        <p class="info">Santa Clara, CA, 95050 </p>
                    </div>
                </div>
                <div class="footer-social-container">
                    <div>
                        <a href="/terms" class="social-link">Terms and Conditions</a>
                        <a href="/privacy" class="social-link">Privacy Policy</a>
                    </div>
                    <div>
                        <a href="#" class="social-link">instagram</a>
                        <a href="#" class="social-link">facebook</a>
                        <a href="#" class="social-link">twitter</a>
                    </div>
                </div>
            </div>
        </div>
        <p class="footer-credit">VF SHop, Best apparels online store</p>
    `;
}

createFooter();