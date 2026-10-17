import { getData } from "../Fetch/Axios";
import URLS from "./URLS";

const optionsMaker = async (
  uri, // URL PATH
  listFieldName, // list name from the response
  labelFieldName, // label key name from the received response
  setOptions,
  params,
  idName
) => {
  const path = URLS[uri].path;
  const response = await getData(
    path,
    { "x-api-version": URLS.country.version },
    params
  );

  if (response?.data[listFieldName]) {
    let finalList = [];

    for (const element of response?.data[listFieldName]) {
      if (element[labelFieldName]) {
        finalList.push({
          label: element[labelFieldName],
          value: element[idName],
        });
      }
    }

    setOptions(() => finalList);
  }
};

export default optionsMaker;
