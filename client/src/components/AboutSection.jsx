import React from "react";
import "./AboutSection.css";

export default function AboutSection() {
  return (
    <div className="about-section">
      <div className="about-container">
        
        {/* Title */}
        <h2 className="about-title">About Esphere</h2>
        <p className="about-subtitle">
          Esphere is a smart and modern real-estate platform designed to help 
          people find rental homes, buy properties, or list their own properties 
          with ease. We focus on providing a seamless user experience, verified 
          listings, and easy navigation.
        </p>

        {/* Features Grid */}
        <div className="about-grid">
          <div className="about-card">
            <h3>✔ Easy to Use</h3>
            <p>
              Our platform is designed to be simple and user-friendly so anyone 
              can search or list properties without difficulty.
            </p>
          </div>

          <div className="about-card">
            <h3>✔ Verified Listings</h3>
            <p>
              Every property listed on Esphere goes through a verification 
              process to ensure authenticity and trust.
            </p>
          </div>

          <div className="about-card">
            <h3>✔ Smart Search</h3>
            <p>
              Filter properties by location, price, type, and more to find the 
              perfect match quickly.
            </p>
          </div>

          <div className="about-card">
            <h3>✔ Fast & Responsive</h3>
            <p>
              Optimized for speed and mobile use so you get a smooth experience 
              everywhere.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
