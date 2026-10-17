import React from "react";
import missing from "../assets/Images/missing.png";
import search from "../assets/Images/seach.png";
import claim from "../assets/Images/claim.png";
import support from "../assets/Images/community.png";
import assistance from "../assets/Images/assistance.png";
import reliability from "../assets/Images/reliability.png";
import community from "../assets/Images/support.png";
import efficiency from "../assets/Images/efficienct.png";
import Footer from "../footer/Footer";

const HowItWorks = () => {
  return (
    <div>
      <div className="container mx-auto py-10 px-5">
        <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
        <div className="how-it-works-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  justify-center">
          <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400 ">
            <div className="flex gap-3 items-center bg-green-200 p-4 rounded-t-lg border-b-2 border-gray-500">
              <img src={missing} className="h-16" alt="Missing Person" />
              <h3 className="text-2xl font-semibold text-green-800">
                Report Lost Persons
              </h3>
            </div>
            <ul className="list-disc pl-8 flex flex-col space-y-2 text-gray-900 pt-2 rounded-b-lg">
              <li>Open the app and select "Report Lost."</li>
              <li>
                Fill in the details such as the person’s description, last known
                location, and any distinguishing features.
              </li>
              <li>
                Add your contact information so we can reach you when your lost
                person is found.
              </li>
              <li>
                Submit the report. Your entry will be instantly added to our
                database and shaorange with volunteers and local authorities.
              </li>
            </ul>
          </div>

          <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400">
            <div className="flex gap-3 items-center bg-green-200 p-4 rounded-t-lg border-b-2 border-gray-500">
              <img src={search} className="h-16" alt="Missing Person" />
              <h3 className="text-2xl font-semibold text-green-800">
                Search for Persons{" "}
              </h3>
            </div>
            <ul className="list-disc pl-8 flex flex-col space-y-2 text-gray-900 pt-2 rounded-b-lg">
              <li>Open the app and select "Search Found."</li>
              <li>
                Use filters to narrow down your search (e.g., category,
                description, location).
              </li>
              <li>
                Browse through the list of found persons. Each entry includes a
                detailed description and a contact option for further
                information.
              </li>
              <li>
                If you find a match, follow the contact instructions provided to
                initiate the claiming process.
              </li>
            </ul>
          </div>

          <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400">
            <div className="flex gap-3 items-center bg-green-200 p-4 rounded-t-lg border-b-2 border-gray-500">
              <img src={claim} className="h-16" alt="Missing Person" />
              <h3 className="text-2xl font-semibold text-green-800">
                Claim Process
              </h3>
            </div>
            <ul className="list-disc pl-8 flex flex-col space-y-2 text-gray-900 pt-2 rounded-b-lg">
              <li>
                Contact the finder through the app’s messaging system or the
                provided contact information.
              </li>
              <li>
                Verify your ownership by providing necessary identification
                details or specific information about the lost person.
              </li>
              <li>
                Arrange a meet-up at a designated safe spot or coordinate with
                local authorities to retrieve your reunite with the person.
              </li>
              <li>
                Confirm the recovery in the app to help us keep our database
                up-to-date.
              </li>
            </ul>
          </div>
        </div>

        <div className="how-it-works-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 justify-center ">
          <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400">
            <div className="flex gap-3 items-center bg-green-200 p-4 rounded-t-lg border-b-2 border-gray-500">
              <img src={support} className="h-16" alt="Missing Person" />
              <h3 className="text-2xl font-semibold text-green-800">
                Community Support
              </h3>
            </div>
            <ul className="list-disc pl-8 flex flex-col space-y-2 text-gray-900 pt-2 rounded-b-lg">
              <li>
                Pilgrims and volunteers can report found persons through the
                app, contributing to a community-driven support system.
              </li>
              <li>
                Receive real-time notifications about lost and found updates
                that match your report or search criteria.
              </li>
              <li>
                Access tips and guidelines to stay safe and prevent losses
                during the Kumbh Mela.
              </li>
            </ul>
          </div>

          <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400">
            <div className="flex gap-3 items-center bg-green-200 p-4 rounded-t-lg border-b-2 border-gray-500">
              <img src={assistance} className="h-16" alt="Missing Person" />
              <h3 className="text-2xl font-semibold text-green-800">
                24/7 Assistance{" "}
              </h3>
            </div>
            <ul className="list-disc pl-8 flex flex-col space-y-2 text-gray-900 pt-2 rounded-b-lg">
              <li>
                Our dedicated support team is available 24/7 via live chat to
                assist you with any queries or issues.
              </li>
              <li>
                Call our helpline for immediate assistance and guidance on the
                recovery process.
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto py-10 px-5">
          <h2 className="text-4xl font-bold text-center mb-10">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400">
              <div className="flex gap-3 items-center bg-green-200 p-2 rounded-t-lg border-b-2 border-gray-500">
                <img src={efficiency} className="h-12" alt="Missing Person" />
                <h3 className="text-xl font-semibold text-green-800">
                  Efficiency
                </h3>
              </div>{" "}
              <p className="p-3">
                Quick and easy reporting and searching process to help you find
                your lost items or persons with minimal hassle.
              </p>
            </div>
            <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400">
              <div className="flex gap-3 items-center bg-green-200 p-2 rounded-t-lg border-b-2 border-gray-500">
                <img src={reliability} className="h-12" alt="Missing Person" />
                <h3 className="text-xl font-semibold text-green-800">
                  Reliability
                </h3>
              </div>
              <p className="p-3">
                Trusted by thousands of pilgrims and local authorities for a
                dependable lost and found solution at the Kumbh Mela.
              </p>
            </div>

            <div className="bg-slate-100 rounded-lg shadow-lg border-t-4 border-cyan-400 hover:border-orange-400">
              <div className="flex gap-3 items-center bg-green-200 p-2 rounded-t-lg border-b-2 border-gray-500">
                <img src={community} className="h-12" alt="Missing Person" />
                <h3 className="text-xl font-semibold text-green-800">
                  Community Support{" "}
                </h3>
              </div>

              <p className="p-3">
                Join a community of helpful pilgrims and volunteers dedicated to
                reuniting lost items and persons with their rightful owners.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-5">
          <h2 className="text-4xl font-bold text-center mb-10">Contact Us</h2>
          <div className="p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">
              Have any questions or need assistance? Reach out to us:
            </p>
            <div className="border-b-2"></div>
            <div className="flex gap-2 flex-col mt-2">
              <div className="flex items-center">
                <i className="ri-mail-line text-2xl"></i>
                <span>
                  Email:{" "}
                  <a
                    href="mailto:support@kumbhlostandfound.in"
                    className="text-violet-40"
                  >
                    support@kumbhlostandfound.in
                  </a>
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line text-2xl"></i>
                <span>
                  Phone:{" "}
                  <a href="tel:+1920" className="text-violet-400">
                    1920
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default HowItWorks;
