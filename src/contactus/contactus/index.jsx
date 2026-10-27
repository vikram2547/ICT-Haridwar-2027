import React from "react";
import { useOutletContext } from "react-router-dom";
// import "./ContactUsPage.css";

const ContactUsPage = () => {
  const outletContext = useOutletContext() || [];
  const dict = outletContext[0] || {};
  const lang = outletContext[1] || "en";

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  return (
    <div className="contact-us-page">
      <h1>{t("contact_us_title", "Contact Us")}</h1>

      <p>
        {t(
          "contact_us_description",
          "If you have any questions or need assistance, feel free to contact us:"
        )}
      </p>

      <div className="contact-info">
        <h2>{t("contact_us_information", "Contact Information")}</h2>

        <ul>
          <li>
            <strong>{t("contact_us_phone", "Phone")}:</strong>{" "}
            <a href="tel:+919404544434">+91 9404544434</a>
          </li>

          <li>
            <strong>{t("contact_us_email", "Email")}:</strong>{" "}
            <a href="mailto:support@kumbhtsmonitoring.in">
              support@kumbhtsmonitoring.in
            </a>
          </li>

          <li>
            <strong>{t("contact_us_address", "Address")}:</strong>{" "}
            {t(
              "contact_us_address_value",
              "Kumbh Mela Adhikari, Haridwar, Uttarakhand"
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUsPage;