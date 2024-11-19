import React from "react";
import "./About.css"; // Import a CSS file for custom styling if needed
import Navbar from "../Navbar/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <section className="about-section">
        {/* Title & Intro */}
        <h2 className="about-title">
          <span>About Us</span>
        </h2>
        <p className="about-intro">
          Managing inventory and billing has never been easier.
          <span>
            <b>
              <i> Inventory Management & Billing System</i>
            </b>
          </span>{" "}
          is a comprehensive solution designed to simplify stock management,
          sales tracking, and invoicing for businesses of all sizes. Whether
          you're a small retailer or a large enterprise, our platform provides
          the tools you need to keep track of inventory, streamline billing, and
          optimize business operations.
        </p>

        {/* Features Overview */}
        <div className="features-grid">
          <div className="feature">
            <h3>Efficient Inventory Tracking</h3>
            <p>
              Keep a real-time record of stock levels, manage product details,
              and reduce the risk of stockouts. Our platform ensures you always
              know what’s available, helping you make informed purchasing
              decisions.
            </p>
          </div>
          <div className="feature">
            <h3>Automated Billing & Invoicing</h3>
            <p>
              Generate and manage invoices with ease. Our automated billing
              system helps you track sales, create customized invoices, and
              process payments, making billing faster and more accurate.
            </p>
          </div>
          <div className="feature">
            <h3>Comprehensive Reporting</h3>
            <p>
              Access detailed sales, inventory, and financial reports to gain
              insights into your business performance. Make data-driven
              decisions to improve profitability and efficiency.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="why-choose-us">
          <h3>Why Choose Us?</h3>
          <ul>
            <li>
              <strong>Reliable & Scalable:</strong> Our system adapts to your
              business needs, whether you're managing a few products or
              thousands.
            </li>
            <li>
              <strong>Easy to Use:</strong> Intuitive interface designed for
              efficiency, helping you focus on growing your business instead of
              managing complex software.
            </li>
            <li>
              <strong>Customer Support:</strong> Our dedicated team is available
              to assist you, ensuring smooth and uninterrupted operations.
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        {/* <div className="cta-buttons">
          <button className="cta-button">Get Started</button>
          <button className="cta-button">Contact Us</button>
        </div> */}
      </section>
    </>
  );
};

export default About;
