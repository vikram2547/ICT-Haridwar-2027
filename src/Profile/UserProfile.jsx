
import React, { useEffect, useState } from "react";
import { Avatar, Button, Upload, message, Input, Select, Form } from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import { basicUrl } from "../Axios/commonAxios";
import { DICT } from "../utils/dictionary";

const { Option } = Select;

const UserProfile = () => {
  const outletContext = useOutletContext() || [];
  const contextDict = outletContext[0] || {};
  const lang =
    outletContext[1] || localStorage.getItem("lang") || "en";

  const t = (key, fallback) =>
    contextDict?.[key]?.[lang] ??
    contextDict?.[key]?.en ??
    DICT?.[key]?.[lang] ??
    DICT?.[key]?.en ??
    fallback ??
    key;

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [originalUserData, setOriginalUserData] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  const headerstopost = {
    "x-api-key": "YunHu873jHds83hRujGJKd873",
    "x-api-version": "1.0.1",
    "x-platform": "Web",
    "x-access-token": localStorage.getItem("sessionToken") || "",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${basicUrl}/profile`, {
          method: "GET",
          headers,
        });

        const result = await response.json();

        if (result.success) {
          setUserData(result.data);
          setOriginalUserData(result.data);
          setProfilePic(
            result.data.image || "https://via.placeholder.com/150"
          );
        } else {
          message.error(
            t("user_profile_load_failed", "Failed to load details.")
          );
        }
      } catch (error) {
        message.error(
          t("user_profile_fetch_error", "Error fetching details.")
        );
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${basicUrl}/country`, {
          method: "GET",
          headers,
        });

        const result = await response.json();

        if (result.success) {
          setCountries(result.data.countries || []);
        } else {
          message.error(
            t("user_profile_countries_failed", "Failed to load countries.")
          );
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      }
    };

    fetchUserData();
    fetchCountries();
    // Fetch initial profile and country data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!userData.country_id) {
        setStates([]);
        return;
      }

      try {
        const response = await fetch(
          `${basicUrl}/state?country_id=${userData.country_id}`,
          {
            method: "GET",
            headers,
          }
        );

        const result = await response.json();

        if (result.success) {
          setStates(result.data.states || []);
        } else {
          message.error(
            t("user_profile_states_failed", "Failed to load states.")
          );
        }
      } catch (error) {
        message.error(
          t("user_profile_states_error", "Error fetching states.")
        );
      }
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.country_id]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!userData.country_id || !userData.state_id) {
        setCities([]);
        return;
      }

      try {
        const response = await fetch(
          `${basicUrl}/city?country_id=${userData.country_id}&state_id=${userData.state_id}`,
          {
            method: "GET",
            headers,
          }
        );

        const result = await response.json();

        if (result.success) {
          setCities(result.data.cities || []);
        } else {
          message.error(
            t("user_profile_cities_failed", "Failed to load cities.")
          );
        }
      } catch (error) {
        message.error(
          t("user_profile_cities_error", "Error fetching cities.")
        );
      }
    };

    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.country_id, userData.state_id]);

  const toggleEditMode = () => {
    setIsEditing((previous) => !previous);
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setProfilePic(
      originalUserData.image || "https://via.placeholder.com/150"
    );
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleImageChange = (info) => {
    const file = info.file?.originFileObj || info.file;

    if (!file) return;

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);
  };

  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", userData.name || "");
    formData.append("email", userData.email || "");
    formData.append("company", userData.company || "");
    formData.append("country_id", userData.country_id || "");
    formData.append("state_id", userData.state_id || "");
    formData.append("city_id", userData.city_id || "");
    formData.append("address", userData.address || "");

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch(`${basicUrl}/profile`, {
        method: "POST",
        headers: headerstopost,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success(
          t(
            "user_profile_update_success",
            "Profile updated successfully!"
          )
        );

        setOriginalUserData({ ...userData });
        setIsEditing(false);
        setSelectedImage(null);
      } else {
        message.error(
          result.message ||
            t("user_profile_update_failed", "Failed to update profile.")
        );
      }
    } catch (error) {
      message.error(
        t("user_profile_update_error", "Error updating profile.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCountryChange = (value) => {
    setUserData((previous) => ({
      ...previous,
      country_id: value,
      state_id: "",
      city_id: "",
    }));

    setStates([]);
    setCities([]);
  };

  const handleStateChange = (value) => {
    setUserData((previous) => ({
      ...previous,
      state_id: value,
      city_id: "",
    }));

    setCities([]);
  };

  const handleCityChange = (value) => {
    setUserData((previous) => ({
      ...previous,
      city_id: value,
    }));
  };

  const displayProfilePic = profilePic.includes("blob:")
    ? profilePic
    : profilePic.startsWith("http")
      ? profilePic
      : `${basicUrl}/${profilePic}`;

  return (
    <div className="mt-3 mx-auto p-3 bg-white shadow-md rounded-lg w-full relative">
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={toggleEditMode}
        className="absolute right-4 top-4"
        aria-label={t("user_profile_edit", "Edit profile")}
      />

      <div className="text-d9 text-2xl w-full flex items-end justify-between">
        <div className="font-bold mb-5">
          {t("user_profile_title", "User Profile")}
        </div>
      </div>

      <div className="flex gap-40">
        <div className="flex ml-6 flex-col items-center">
          <Avatar
            size={250}
            src={displayProfilePic || "https://via.placeholder.com/150"}
            alt={t("user_profile_picture_alt", "Profile Picture")}
          />

          {isEditing && (
            <Upload
              name="profilePic"
              showUploadList={false}
              customRequest={({ onSuccess }) => {
                onSuccess?.("ok");
              }}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");

                if (!isImage) {
                  message.error(
                    t(
                      "user_profile_image_only",
                      "Please select an image file."
                    )
                  );
                  return Upload.LIST_IGNORE;
                }

                return true;
              }}
              onChange={handleImageChange}
            >
              <Button
                icon={<UploadOutlined />}
                loading={loading}
                className="mt-4"
              >
                {t(
                  "user_profile_upload_picture",
                  "Upload New Picture"
                )}
              </Button>
            </Upload>
          )}
        </div>

        <Form>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            <div>
              <span className="font-semibold">
                {t("user_profile_name", "Name")}:
              </span>
              <Input
                className="rounded-none"
                name="name"
                value={userData.name ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <span className="font-semibold">
                {t("user_profile_mobile", "Mobile Number")}:
              </span>
              <Input
                className="rounded-none"
                name="phone"
                value={userData.phone ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <span className="font-semibold">
                {t("user_profile_email", "Email")}:
              </span>
              <Input
                className="rounded-none"
                name="email"
                value={userData.email ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <span className="font-semibold">
                {t("user_profile_company", "Company")}:
              </span>
              <Input
                className="rounded-none"
                name="company"
                value={userData.company ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <span className="font-semibold">
                {t("user_profile_country", "Country")}:
              </span>
              <Select
                value={userData.country_id || undefined}
                onChange={handleCountryChange}
                disabled={!isEditing}
                placeholder={t(
                  "user_profile_select_country",
                  "Select country"
                )}
              >
                {countries.map((country) => (
                  <Option
                    key={country.country_id}
                    value={country.country_id}
                  >
                    {country.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <span className="font-semibold">
                {t("user_profile_state", "State")}:
              </span>
              <Select
                value={userData.state_id || undefined}
                onChange={handleStateChange}
                disabled={!isEditing || !userData.country_id}
                placeholder={t(
                  "user_profile_select_state",
                  "Select state"
                )}
              >
                {states.map((state) => (
                  <Option key={state.state_id} value={state.state_id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <span className="font-semibold">
                {t("user_profile_city", "City")}:
              </span>
              <Select
                value={userData.city_id || undefined}
                onChange={handleCityChange}
                disabled={!isEditing || !userData.state_id}
                placeholder={t(
                  "user_profile_select_city",
                  "Select city"
                )}
              >
                {cities.map((city) => (
                  <Option key={city.city_id} value={city.city_id}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <span className="font-semibold">
                {t("user_profile_address", "Address")}:
              </span>
              <Input
                className="rounded-none"
                name="address"
                value={userData.address ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </Form>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              className="w-fit rounded-none bg-5c"
            >
              {t("user_profile_save_changes", "Save Changes")}
            </Button>

            <Button
              danger
              onClick={handleCancel}
              disabled={loading}
              className="w-fit rounded-none ml-2"
            >
              {t("user_profile_cancel", "Cancel")}
            </Button>
          </Form.Item>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
