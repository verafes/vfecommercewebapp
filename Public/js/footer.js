const createFooter = () => {
    let footer = document.querySelector('footer');

    footer.innerHTML = `
        <div class="footer-content">
            
            <img src="../img/logo-light.png" class="logo" alt="">
            <div>
                <p class="footer-title">About Company</p>
                <p class="info">Welcome to VF Attire Shop, an educational e-commerce initiative where the worlds of education and technology unite to redefine the world of fashion. This project represents a fusion of knowledge and innovation, offering a fresh perspective on the fashion landscape.</p>
                <p class="info">As a creative developer at VF Attire Shop, I bring my passion into the project. I am deeply committed to our mission of merging fashion with education and innovation. My vision for this endeavor is to inspire learning, spark creativity, and empower individuals to excel in the realms of both fashion and technology.</p>
                <p class="footer-title">Contacts:</p>
                <p class="info">Email: help@vfattireshop.com, customersupport@vfattireshop.com</p>
                <p class="info">Phone: (800) 000-0001, (800) 000-0002</p>
            </div>
        </div>
        <div class="footer-social-container">
            <div>
                <a href="#" class="social-link">Terms of Service</a>
                <a href="#" class="social-link">Privacy Policy</a>
            </div>
            <div>
                <a href="#" class="social-link">instagram</a>
                <a href="#" class="social-link">facebook</a>
                <a href="#" class="social-link">twitter</a>
            </div>
        </div>
        <p class="footer-credit">Clothing, Best apparels online store</p>
        
        <!--            <div class="footer-ul-container">-->
<!--                <uL class="category">-->
<!--                    <p class="footer-title" >Support emails:</p> -->
<!--                    <p class="info">help@claothing.com, customersupport@clothing.com</p>-->
<!--                    <p class="info">Telephone: (800) 000-0001, (800) 000-0002</p>-->
<!--                </uL>-->
<!--            </div>-->
    `;
}

createFooter();