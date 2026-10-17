export const postHTTP = async (url, payload) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `gbes7KiCpI3uqHoYH5OY_TPgPVZ67lsDXT65ZTUFKJ752fvm_xROvoac9yuUdw2V`,
        userID: "31b1ca8716754526b8af83b1b24fb069",
        ulcaApiKey: "16ba35d2ab-5109-45ae-a75d-97238363d64e",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error sending audio to API:", err);
  } finally {
    // setUploading(false);
  }
};

export const getLanguages = async (url, payload) => {
  try {
    const response = await fetch(
      "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute",
      {
        method: "GET",
        headers: {
          Authorization: `gbes7KiCpI3uqHoYH5OY_TPgPVZ67lsDXT65ZTUFKJ752fvm_xROvoac9yuUdw2V`,
          userID: "31b1ca8716754526b8af83b1b24fb069",
          ulcaApiKey: "16ba35d2ab-5109-45ae-a75d-97238363d64e",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error sending audio to API:", err);
  } finally {
    // setUploading(false);
  }
};
