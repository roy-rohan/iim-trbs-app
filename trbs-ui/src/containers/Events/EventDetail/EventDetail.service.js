import axios from "../../../axios-iim";

export const fetchEventDetail = async (eventSlug) => {
  const response = await axios.post(
    "/events/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "slug",
          value: eventSlug,
          op: "=",
        },
      ],
      filter_op: "",
      sort: [],
    })
  );

  return response;
};

export const fetchImages = async (eventId) => {
  const response = await axios.post(
    "/images/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "entity_id",
          value: eventId,
          op: "=",
        },
        {
          field_name: "entity_type",
          value: "event",
          op: "=",
        },
      ],
      filter_op: "AND",
      sort: [],
    })
  );

  return response;
};
