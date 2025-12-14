
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <p className="lead">
        Your privacy is important to us. It is Natraj Rewards' policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
      </p>
      
      <h2>1. Information We Collect</h2>
      <h3>Log Data</h3>
      <p>
        When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
      </p>
      <h3>Personal Information</h3>
      <p>
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. The types of information we collect may include your name, email address, demographic information (like age and interests), and any other data you provide through our surveys and forms.
      </p>
      
      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect to operate and maintain our services, to match you with relevant surveys and offers from our partners, to communicate with you, and to comply with legal obligations. Your data helps us personalize your experience and provide you with opportunities that are most relevant to your profile.
      </p>

      <h2>3. Security of Your Personal Information</h2>
      <p>
        We take the security of your data seriously. We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
      </p>

      <h2>4. Cookies</h2>
       <p>We use “cookies” to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified.</p>

      <h2>5. Service Providers</h2>
      <p>We may employ third-party companies and individuals to facilitate our Website ("Service Providers"), to provide the Website on our behalf, to perform Website-related services or to assist us in analyzing how our Website is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
      
      <h2>6. Children's Privacy</h2>
      <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

      <p>
        This policy is effective as of {new Date().getFullYear()}. We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>
    </>
  );
};

export default PrivacyPolicy;
